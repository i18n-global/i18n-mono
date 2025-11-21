import { google, sheets_v4 } from "googleapis";
import * as fs from "fs";
import * as path from "path";

export interface GoogleSheetsConfig {
  credentialsPath?: string;
  spreadsheetId?: string;
  sheetName?: string;
  namespace?: string; // 네임스페이스 (도메인 우선 구조용)
  keyColumn?: string;
  valueColumns?: string[];
  headerRow?: number;
}

export interface TranslationRow {
  key: string;
  [language: string]: string;
}

export class GoogleSheetsManager {
  private sheets: sheets_v4.Sheets | null = null;
  private config: Required<GoogleSheetsConfig>;

  constructor(config: Partial<GoogleSheetsConfig> = {}) {
    this.config = {
      credentialsPath: config.credentialsPath || "./credentials.json",
      spreadsheetId: config.spreadsheetId || "",
      sheetName: config.sheetName || "Translations",
      namespace: config.namespace || "",
      keyColumn: config.keyColumn || "A",
      valueColumns: config.valueColumns || ["B", "C"], // B=English, C=Korean
      headerRow: config.headerRow || 1,
    };
  }

  /**
   * 네임스페이스 경로 반환 (도메인 우선 구조: locales/[namespace]/[lang].json)
   */
  private getNamespacePath(localesDir: string): string {
    if (this.config.namespace) {
      return path.join(localesDir, this.config.namespace);
    }
    return localesDir; // 레거시: locales/[lang].json
  }

  /**
   * Google Sheets API 인증 및 초기화
   */
  async authenticate(): Promise<void> {
    try {
      // 서비스 계정 키 파일 읽기
      if (!fs.existsSync(this.config.credentialsPath)) {
        throw new Error(
          `Credentials file not found: ${this.config.credentialsPath}`
        );
      }

      const credentials = JSON.parse(
        fs.readFileSync(this.config.credentialsPath, "utf8")
      );

      // JWT 클라이언트 생성
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const authClient = await auth.getClient();

      // Sheets API 클라이언트 생성
      this.sheets = google.sheets({ version: "v4", auth: authClient as any });

      console.log("✅ Google Sheets API authenticated successfully");
    } catch (error) {
      console.error("❌ Failed to authenticate Google Sheets API:", error);
      throw error;
    }
  }

  /**
   * 스프레드시트가 존재하는지 확인
   */
  async checkSpreadsheet(): Promise<boolean> {
    if (!this.sheets) {
      throw new Error(
        "Google Sheets client not initialized. Call authenticate() first."
      );
    }

    try {
      await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.spreadsheetId,
      });
      return true;
    } catch (error) {
      console.error("❌ Spreadsheet not accessible:", error);
      return false;
    }
  }

  /**
   * 워크시트가 존재하는지 확인하고, 없으면 생성
   */
  async ensureWorksheet(): Promise<void> {
    if (!this.sheets) {
      throw new Error(
        "Google Sheets client not initialized. Call authenticate() first."
      );
    }

    try {
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.config.spreadsheetId,
      });

      const sheetExists = spreadsheet.data.sheets?.some(
        (sheet) => sheet.properties?.title === this.config.sheetName
      );

      if (!sheetExists) {
        console.log(`📝 Creating worksheet: ${this.config.sheetName}`);

        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.config.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: this.config.sheetName,
                  },
                },
              },
            ],
          },
        });

        // 헤더 행 추가
        await this.addHeaders();
      }
    } catch (error) {
      console.error("❌ Failed to ensure worksheet:", error);
      throw error;
    }
  }

  /**
   * 헤더 행 추가
   */
  private async addHeaders(): Promise<void> {
    if (!this.sheets) return;

    const headers = ["Key", "English", "Korean"];
    const range = `${this.config.sheetName}!A${this.config.headerRow}:C${this.config.headerRow}`;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.config.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [headers],
      },
    });

    console.log("📝 Headers added to worksheet");
  }

  /**
   * 로컬 번역 파일들을 읽어서 Google Sheets에 업로드
   * @param localesDir 로컬 번역 파일 디렉토리
   * @param autoTranslate true일 경우 영어는 GOOGLETRANSLATE 수식으로 업로드
   * @param force true일 경우 기존 데이터를 모두 지우고 새로 업로드
   */
  async uploadTranslations(
    localesDir: string,
    autoTranslate: boolean = false,
    force: boolean = false
  ): Promise<void> {
    if (!this.sheets) {
      throw new Error(
        "Google Sheets client not initialized. Call authenticate() first."
      );
    }

    try {
      console.log("📤 Uploading translations to Google Sheets...");
      if (autoTranslate) {
        console.log(
          "🤖 Auto-translate mode: English will use GOOGLETRANSLATE formula"
        );
      }
      if (force) {
        console.log("💪 Force mode: Overwriting all existing data");
      }

      // 로컬 번역 파일들 읽기
      const translations = await this.readLocalTranslations(localesDir);

      if (translations.length === 0) {
        console.log("📝 No translation files found");
        return;
      }

      let translationsToUpload: TranslationRow[];

      if (force) {
        // Force 모드: 모든 키 업로드
        translationsToUpload = translations;

        // 기존 데이터 모두 삭제 (헤더 제외)
        const existingData = await this.downloadTranslations();
        if (existingData.length > 0) {
          const deleteRange = `${this.config.sheetName}!A${this.config.headerRow + 1}:C${
            existingData.length + this.config.headerRow
          }`;
          await this.sheets.spreadsheets.values.clear({
            spreadsheetId: this.config.spreadsheetId,
            range: deleteRange,
          });
          console.log(`�️  Cleared ${existingData.length} existing rows`);
        }
      } else {
        // 일반 모드: 새로운 키만 업로드
        const existingData = await this.downloadTranslations();
        const existingKeys = new Set(existingData.map((row) => row.key));

        translationsToUpload = translations.filter(
          (t) => !existingKeys.has(t.key)
        );

        if (translationsToUpload.length === 0) {
          console.log("📝 No new translations to upload");
          return;
        }
      }

      // 시작 행 계산
      const startRow = this.config.headerRow + 1;

      // 데이터 준비
      const values = translationsToUpload.map((translation, index) => {
        const currentRow = startRow + index;
        const key = translation.key;
        const korean = translation.ko || "";
        const localEnglishValue = translation.en || "";

        const english = autoTranslate
          ? localEnglishValue === ""
            ? `=GOOGLETRANSLATE(C${currentRow}, "ko", "en")`
            : localEnglishValue
          : localEnglishValue;

        return [key, english, korean];
      });

      const endRow = startRow + values.length - 1;
      const range = `${this.config.sheetName}!A${startRow}:C${endRow}`;

      // 데이터 업로드
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      });

      console.log(
        `✅ Uploaded ${translationsToUpload.length} translations to Google Sheets`
      );
      if (autoTranslate) {
        console.log(
          "🤖 English translations will be auto-generated by Google Sheets"
        );
      }
    } catch (error) {
      console.error("❌ Failed to upload translations:", error);
      throw error;
    }
  }

  /**
   * Google Sheets에서 번역 데이터 다운로드
   * valueRenderOption을 FORMATTED_VALUE로 설정하여 수식이 아닌 계산된 결과값을 가져옴
   */
  async downloadTranslations(): Promise<TranslationRow[]> {
    if (!this.sheets) {
      throw new Error(
        "Google Sheets client not initialized. Call authenticate() first."
      );
    }

    try {
      console.log("📥 Downloading translations from Google Sheets...");

      const range = `${this.config.sheetName}!A:C`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range,
        valueRenderOption: "FORMATTED_VALUE", // 수식의 계산 결과를 가져옴
      });

      const rows = response.data.values || [];

      if (rows.length <= this.config.headerRow) {
        console.log("📝 No translation data found");
        return [];
      }

      // 헤더 행 제외하고 데이터 파싱
      const dataRows = rows.slice(this.config.headerRow);
      const translations: TranslationRow[] = dataRows
        .filter((row) => row[0]) // 키가 있는 행만
        .map((row) => ({
          key: row[0] || "",
          en: row[1] || "",
          ko: row[2] || "",
        }));

      console.log(
        `✅ Downloaded ${translations.length} translations from Google Sheets`
      );
      return translations;
    } catch (error) {
      console.error("❌ Failed to download translations:", error);
      throw error;
    }
  }

  /**
   * Google Sheets 데이터를 로컬 번역 파일로 저장 (언어별 파일: en.json, ko.json)
   */
  async saveTranslationsToLocal(
    localesDir: string,
    languages: string[] = ["en", "ko"]
  ): Promise<void> {
    try {
      const translations = await this.downloadTranslations();

      if (translations.length === 0) {
        console.log("📝 No translations to save");
        return;
      }

      // locales 디렉토리가 없으면 생성
      if (!fs.existsSync(localesDir)) {
        fs.mkdirSync(localesDir, { recursive: true });
      }

      // 도메인 우선 구조: locales/[namespace]/[lang].json
      const namespacePath = this.getNamespacePath(localesDir);
      if (!fs.existsSync(namespacePath)) {
        fs.mkdirSync(namespacePath, { recursive: true });
      }

      // 언어별로 번역 파일 생성
      for (const lang of languages) {
        const translationObj: Record<string, string> = {};
        translations.forEach((row) => {
          if (row[lang]) {
            translationObj[row.key] = row[lang];
          }
        });

        const filePath = path.join(namespacePath, `${lang}.json`);
        fs.writeFileSync(
          filePath,
          JSON.stringify(translationObj, null, 2),
          "utf-8"
        );

        console.log(
          `📝 Saved ${Object.keys(translationObj).length} ${lang} translations to ${filePath}`
        );
      }
    } catch (error) {
      console.error("❌ Failed to save translations to local:", error);
      throw error;
    }
  }

  /**
   * Google Sheets 데이터를 로컬 번역 파일로 저장 (증분 업데이트 - 추가된 데이터만)
   */
  async saveTranslationsToLocalIncremental(
    localesDir: string,
    languages: string[] = ["en", "ko"]
  ): Promise<void> {
    try {
      const translations = await this.downloadTranslations();

      if (translations.length === 0) {
        console.log("📝 No translations to save");
        return;
      }

      // locales 디렉토리가 없으면 생성
      if (!fs.existsSync(localesDir)) {
        fs.mkdirSync(localesDir, { recursive: true });
      }

      // 도메인 우선 구조: locales/[namespace]/[lang].json
      const namespacePath = this.getNamespacePath(localesDir);
      if (!fs.existsSync(namespacePath)) {
        fs.mkdirSync(namespacePath, { recursive: true });
      }

      // 언어별로 번역 파일 생성/업데이트
      for (const lang of languages) {
        const filePath = path.join(namespacePath, `${lang}.json`);

        // 기존 번역 파일 읽기
        let existingTranslations: Record<string, string> = {};
        if (fs.existsSync(filePath)) {
          existingTranslations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }

        // 새로운 번역만 추가 (기존 키는 유지)
        let addedCount = 0;
        translations.forEach((row) => {
          if (row[lang] && !existingTranslations[row.key]) {
            existingTranslations[row.key] = row[lang];
            addedCount++;
          }
        });

        fs.writeFileSync(
          filePath,
          JSON.stringify(existingTranslations, null, 2),
          "utf-8"
        );

        console.log(
          `📝 Added ${addedCount} new ${lang} translations to ${filePath} (total: ${Object.keys(existingTranslations).length})`
        );
      }
    } catch (error) {
      console.error("❌ Failed to save translations to local:", error);
      throw error;
    }
  }

  /**
   * 로컬 번역 파일들 읽기
   * - namespace가 없으면: locales/en.json, locales/ko.json (레거시)
   * - namespace가 있으면: locales/${namespace}/en.json, locales/${namespace}/ko.json (도메인 우선)
   */
  async readLocalTranslations(localesDir: string): Promise<TranslationRow[]> {
    const translations: TranslationRow[] = [];
    const allKeys = new Set<string>();

    const namespacePath = this.getNamespacePath(localesDir);

    if (!fs.existsSync(namespacePath)) {
      console.log(`⚠️  Locales directory not found: ${namespacePath}`);
      return [];
    }

    // 도메인 우선 구조: locales/[namespace]/[lang].json
    if (this.config.namespace) {
      // 네임스페이스 디렉토리에서 .json 파일들 찾기 (ko.json, en.json 등)
      const files = fs
        .readdirSync(namespacePath)
        .filter((file) => file.endsWith(".json") && file !== "index.ts");

      const translationData: Record<string, Record<string, string>> = {};

      // 각 언어 파일 읽기
      for (const file of files) {
        const lang = path.basename(file, ".json"); // ko.json -> ko
        const filePath = path.join(namespacePath, file);

        try {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          translationData[lang] = content;

          Object.keys(content).forEach((key) => {
            allKeys.add(key);
          });
        } catch (error) {
          console.warn(`⚠️  Failed to read ${filePath}:`, error);
        }
      }

      // 모든 키에 대해 번역 행 생성
      allKeys.forEach((key) => {
        const row: TranslationRow = { key };
        Object.keys(translationData).forEach((lang) => {
          row[lang] = translationData[lang][key] || "";
        });
        translations.push(row);
      });
    } else {
      // 레거시 구조: locales/en.json, locales/ko.json
      const files = fs
        .readdirSync(namespacePath)
        .filter((file) => file.endsWith(".json") && file !== "index.ts");

      const translationData: Record<string, Record<string, string>> = {};

      // 각 언어 파일 읽기
      for (const file of files) {
        const lang = path.basename(file, ".json"); // en.json -> en
        const filePath = path.join(namespacePath, file);

        try {
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
          translationData[lang] = content;

          Object.keys(content).forEach((key) => {
            allKeys.add(key);
          });
        } catch (error) {
          console.warn(`⚠️  Failed to read ${filePath}:`, error);
        }
      }

      // 모든 키에 대해 번역 행 생성
      allKeys.forEach((key) => {
        const row: TranslationRow = { key };
        Object.keys(translationData).forEach((lang) => {
          row[lang] = translationData[lang][key] || "";
        });
        translations.push(row);
      });
    }

    return translations;
  }

  /**
   * 양방향 동기화 - 로컬과 Google Sheets 간의 차이점 해결
   */
  async syncTranslations(localesDir: string): Promise<void> {
    try {
      console.log("🔄 Starting bidirectional sync...");

      // 로컬과 원격 데이터 읽기
      const [localTranslations, remoteTranslations] = await Promise.all([
        this.readLocalTranslations(localesDir),
        this.downloadTranslations(),
      ]);

      const localKeys = new Set(localTranslations.map((t) => t.key));
      const remoteKeys = new Set(remoteTranslations.map((t) => t.key));

      // 새로운 로컬 키들을 Google Sheets에 업로드
      const newLocalKeys = localTranslations.filter(
        (t) => !remoteKeys.has(t.key)
      );
      if (newLocalKeys.length > 0) {
        console.log(
          `📤 Uploading ${newLocalKeys.length} new local keys to Google Sheets`
        );
        await this.uploadNewTranslations(newLocalKeys);
      }

      // 새로운 원격 키들을 로컬에 다운로드
      const newRemoteKeys = remoteTranslations.filter(
        (t) => !localKeys.has(t.key)
      );
      if (newRemoteKeys.length > 0) {
        console.log(
          `📥 Downloading ${newRemoteKeys.length} new remote keys to local files`
        );
        await this.addTranslationsToLocal(localesDir, newRemoteKeys);
      }

      console.log("✅ Sync completed successfully");
    } catch (error) {
      console.error("❌ Failed to sync translations:", error);
      throw error;
    }
  }

  /**
   * 새로운 번역들을 Google Sheets에 추가
   */
  private async uploadNewTranslations(
    translations: TranslationRow[]
  ): Promise<void> {
    if (!this.sheets || translations.length === 0) return;

    const values = translations.map((t) => [t.key, t.en || "", t.ko || ""]);

    // 기존 데이터의 마지막 행 찾기
    const existingData = await this.downloadTranslations();
    const startRow = existingData.length + this.config.headerRow + 1;
    const endRow = startRow + values.length - 1;
    const range = `${this.config.sheetName}!A${startRow}:C${endRow}`;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.config.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
  }

  /**
   * 새로운 번역들을 로컬 파일에 추가
   */
  private async addTranslationsToLocal(
    localesDir: string,
    translations: TranslationRow[]
  ): Promise<void> {
    const languages = ["en", "ko"];
    const namespacePath = this.getNamespacePath(localesDir);

    if (!fs.existsSync(namespacePath)) {
      fs.mkdirSync(namespacePath, { recursive: true });
    }

    for (const lang of languages) {
      const filePath = path.join(namespacePath, `${lang}.json`);

      // 기존 번역 읽기
      let existingTranslations: Record<string, string> = {};
      if (fs.existsSync(filePath)) {
        existingTranslations = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }

      // 새로운 번역 추가
      translations.forEach((t) => {
        if (t[lang]) {
          existingTranslations[t.key] = t[lang];
        }
      });

      // 파일 저장
      fs.writeFileSync(
        filePath,
        JSON.stringify(existingTranslations, null, 2),
        "utf-8"
      );
    }
  }

  /**
   * 스프레드시트 상태 확인
   */
  async getStatus(): Promise<{
    spreadsheetId: string;
    sheetName: string;
    totalRows: number;
    lastUpdated?: string;
  }> {
    if (!this.sheets) {
      throw new Error(
        "Google Sheets client not initialized. Call authenticate() first."
      );
    }

    try {
      const [spreadsheet, values] = await Promise.all([
        this.sheets.spreadsheets.get({
          spreadsheetId: this.config.spreadsheetId,
        }),
        this.sheets.spreadsheets.values.get({
          spreadsheetId: this.config.spreadsheetId,
          range: `${this.config.sheetName}!A:A`,
        }),
      ]);

      const totalRows =
        (values.data.values?.length || 0) - this.config.headerRow;

      return {
        spreadsheetId: this.config.spreadsheetId,
        sheetName: this.config.sheetName,
        totalRows: Math.max(0, totalRows),
        lastUpdated: spreadsheet.data.properties?.timeZone || undefined,
      };
    } catch (error) {
      console.error("❌ Failed to get status:", error);
      throw error;
    }
  }

  /**
   * CSV 파일에서 번역 데이터 읽기 (구글 시트 호환 형식)
   */
  async readTranslationsFromCSV(
    csvFilePath: string
  ): Promise<TranslationRow[]> {
    try {
      console.log(`📥 Reading translations from CSV: ${csvFilePath}`);

      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file not found: ${csvFilePath}`);
      }

      const csvContent = fs.readFileSync(csvFilePath, "utf-8");
      const lines = csvContent.split("\n").filter((line) => line.trim());

      if (lines.length <= 1) {
        console.log("📝 No translation data found in CSV");
        return [];
      }

      // 헤더 확인 (Key, English, Korean 순서 기대)
      const header = lines[0];
      if (
        !header.toLowerCase().includes("key") ||
        !header.toLowerCase().includes("english") ||
        !header.toLowerCase().includes("korean")
      ) {
        console.warn(
          "⚠️ CSV header format might not be correct. Expected: Key, English, Korean"
        );
      }

      // 데이터 파싱
      const translations: TranslationRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = this.parseCSVLine(line);

        if (values.length >= 3 && values[0]) {
          translations.push({
            key: values[0],
            en: values[1] || "",
            ko: values[2] || "",
          });
        }
      }

      console.log(`✅ Read ${translations.length} translations from CSV`);
      return translations;
    } catch (error) {
      console.error("❌ Failed to read CSV file:", error);
      throw error;
    }
  }

  /**
   * CSV 라인 파싱 (간단한 CSV 파서)
   */
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // 이스케이프된 따옴표
          current += '"';
          i += 2;
        } else {
          // 따옴표 시작/끝
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === "," && !inQuotes) {
        // 컬럼 구분자
        values.push(current);
        current = "";
        i++;
      } else {
        current += char;
        i++;
      }
    }

    values.push(current);
    return values;
  }

  /**
   * 번역 데이터를 CSV 형식으로 저장 (구글 시트 호환)
   */
  async saveTranslationsToCSV(
    csvFilePath: string,
    translations: TranslationRow[]
  ): Promise<void> {
    try {
      console.log(`📤 Saving translations to CSV: ${csvFilePath}`);

      const csvLines = ["Key,English,Korean"];

      translations.forEach(({ key, en, ko }) => {
        const escapedKey = this.escapeCsvValue(key);
        const escapedEn = this.escapeCsvValue(en || "");
        const escapedKo = this.escapeCsvValue(ko || "");

        csvLines.push(`${escapedKey},${escapedEn},${escapedKo}`);
      });

      const csvContent = csvLines.join("\n");

      // 디렉토리 생성
      const csvDir = path.dirname(csvFilePath);
      if (!fs.existsSync(csvDir)) {
        fs.mkdirSync(csvDir, { recursive: true });
      }

      fs.writeFileSync(csvFilePath, csvContent, "utf-8");

      console.log(`✅ Saved ${translations.length} translations to CSV`);
    } catch (error) {
      console.error("❌ Failed to save CSV file:", error);
      throw error;
    }
  }

  /**
   * CSV 값 이스케이프
   */
  private escapeCsvValue(value: string): string {
    if (
      value.includes(",") ||
      value.includes('"') ||
      value.includes("\n") ||
      value.includes("\r")
    ) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * CSV 파일을 로컬 JSON 번역 파일로 변환
   */
  async convertCSVToLocalTranslations(
    csvFilePath: string,
    localesDir: string,
    languages: string[] = ["en", "ko"]
  ): Promise<void> {
    try {
      const translations = await this.readTranslationsFromCSV(csvFilePath);

      if (translations.length === 0) {
        console.log("📝 No translations to convert");
        return;
      }

      // 도메인 우선 구조: locales/[namespace]/[lang].json
      const namespacePath = this.getNamespacePath(localesDir);
      if (!fs.existsSync(namespacePath)) {
        fs.mkdirSync(namespacePath, { recursive: true });
      }

      // 언어별로 번역 파일 생성
      for (const lang of languages) {
        const translationObj: Record<string, string> = {};
        translations.forEach((row) => {
          if (row[lang]) {
            translationObj[row.key] = row[lang];
          }
        });

        const filePath = path.join(namespacePath, `${lang}.json`);
        fs.writeFileSync(
          filePath,
          JSON.stringify(translationObj, null, 2),
          "utf-8"
        );

        console.log(
          `📝 Converted ${Object.keys(translationObj).length} ${lang} translations to ${filePath}`
        );
      }
    } catch (error) {
      console.error("❌ Failed to convert CSV to local translations:", error);
      throw error;
    }
  }
}

// 기본 인스턴스
export const defaultGoogleSheetsManager = new GoogleSheetsManager();
