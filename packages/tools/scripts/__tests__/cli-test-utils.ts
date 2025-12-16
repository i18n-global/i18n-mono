/**
 * CLI E2E 테스트 유틸리티
 * CLI 명령어 실행 및 테스트 프로젝트 생성 헬퍼 함수
 */

import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { I18nexusConfig } from "../config-loader";

export interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ProjectStructure {
  [key: string]: string | ProjectStructure;
}

/**
 * CLI 명령어 실행
 * @param command - 실행할 명령어 (예: "i18n-extractor")
 * @param args - 명령어 인자 배열
 * @param cwd - 작업 디렉토리
 * @returns 실행 결과
 */
export function runCLICommand(
  command: string,
  args: string[] = [],
  cwd: string,
): Promise<CLIResult> {
  return new Promise((resolve) => {
    // dist/bin 디렉토리에서 실행 파일 찾기
    // package.json을 찾아서 tools 루트 디렉토리 찾기
    let toolsRoot = __dirname;
    while (toolsRoot !== path.dirname(toolsRoot)) {
      const packageJsonPath = path.join(toolsRoot, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
          if (pkg.name === "i18nexus-tools") {
            break;
          }
        } catch {
          // JSON 파싱 실패 시 계속
        }
      }
      toolsRoot = path.dirname(toolsRoot);
    }

    const commandPath = path.join(toolsRoot, "dist", "bin", `${command}.js`);

    // 파일이 존재하는지 확인
    if (!fs.existsSync(commandPath)) {
      resolve({
        stdout: "",
        stderr: `Command file not found: ${commandPath}\nSearched from: ${__dirname}\nTools root: ${toolsRoot}`,
        exitCode: 1,
      });
      return;
    }

    const childProcess = child_process.spawn("node", [commandPath, ...args], {
      cwd,
      env: { ...process.env, NODE_ENV: "test" },
    });

    let stdout = "";
    let stderr = "";

    childProcess.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    childProcess.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    childProcess.on("close", (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0,
      });
    });

    childProcess.on("error", (error) => {
      resolve({
        stdout,
        stderr: stderr + error.message,
        exitCode: 1,
      });
    });
  });
}

/**
 * 테스트 프로젝트 구조 생성
 * @param baseDir - 기본 디렉토리
 * @param structure - 프로젝트 구조 (객체 형태)
 * @returns 생성된 프로젝트 경로
 */
export function createTestProject(
  baseDir: string,
  structure: ProjectStructure,
): string {
  const projectDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "i18nexus-cli-test-"),
  );

  function createStructure(currentDir: string, struct: ProjectStructure): void {
    for (const [key, value] of Object.entries(struct)) {
      const fullPath = path.join(currentDir, key);

      if (typeof value === "string") {
        // 파일 생성
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, value, "utf-8");
      } else {
        // 디렉토리 생성
        fs.mkdirSync(fullPath, { recursive: true });
        createStructure(fullPath, value);
      }
    }
  }

  createStructure(projectDir, structure);
  return projectDir;
}

/**
 * i18nexus.config.json 파일 생성
 * @param baseDir - 기본 디렉토리
 * @param config - 설정 객체 (선택사항)
 * @returns 생성된 설정 파일 경로
 */
export function createTestConfig(
  baseDir: string,
  config: Partial<I18nexusConfig> = {},
): string {
  const defaultConfig: I18nexusConfig = {
    languages: ["en", "ko"],
    defaultLanguage: "en",
    localesDir: "./locales",
    sourcePattern: "src/**/*.{ts,tsx}",
    translationImportSource: "i18nexus",
    fallbackNamespace: "common",
    namespacing: {
      enabled: false,
      basePath: "",
      defaultNamespace: "common",
    },
  };

  const finalConfig = { ...defaultConfig, ...config };
  const configPath = path.join(baseDir, "i18nexus.config.json");
  fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2), "utf-8");

  return configPath;
}

/**
 * 임시 디렉토리 생성
 */
export function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "i18nexus-cli-test-"));
}

/**
 * 디렉토리 정리
 */
export function cleanupDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * 파일 존재 확인
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * JSON 파일 읽기
 */
export function readJsonFile(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/**
 * 파일 내용 읽기
 */
export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * 디렉토리 내 파일 목록 가져오기
 */
export function listFiles(dir: string, recursive: boolean = false): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile()) {
      files.push(fullPath);
    } else if (stat.isDirectory() && recursive) {
      files.push(...listFiles(fullPath, true));
    }
  }

  return files;
}

/**
 * 디렉토리 내 디렉토리 목록 가져오기
 */
export function listDirectories(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const dirs: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      dirs.push(item);
    }
  }

  return dirs;
}
