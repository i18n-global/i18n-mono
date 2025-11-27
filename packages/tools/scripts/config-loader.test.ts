import * as fs from "fs";
import * as pathLib from "path";
import { loadConfig, I18nexusConfig } from "./config-loader";

describe("config-loader", () => {
  const testConfigPath = pathLib.join(__dirname, "test-config.json");

  afterEach(() => {
    if (fs.existsSync(testConfigPath)) {
      fs.unlinkSync(testConfigPath);
    }
  });

  describe("namespaceLocation 변환", () => {
    it("namespaceLocation이 설정되면 namespacing.basePath로 변환", () => {
      const testConfig = {
        languages: ["en", "ko"],
        defaultLanguage: "en",
        localesDir: "./locales",
        sourcePattern: "app/**/*.tsx",
        translationImportSource: "i18nexus",
        namespaceLocation: "src/pages",
      };

      fs.writeFileSync(testConfigPath, JSON.stringify(testConfig));

      const config = loadConfig(testConfigPath, { silent: true });

      expect(config.namespacing?.enabled).toBe(true);
      expect(config.namespacing?.basePath).toBe("src/pages");
      expect(config.namespacing?.defaultNamespace).toBe("common");
    });

    it("namespaceLocation과 namespacing을 함께 설정하면 병합", () => {
      const testConfig = {
        languages: ["en", "ko"],
        defaultLanguage: "en",
        localesDir: "./locales",
        sourcePattern: "app/**/*.tsx",
        translationImportSource: "i18nexus",
        namespaceLocation: "src/pages",
        namespacing: {
          defaultNamespace: "global",
          framework: "nextjs-pages" as const,
        },
      };

      fs.writeFileSync(testConfigPath, JSON.stringify(testConfig));

      const config = loadConfig(testConfigPath, { silent: true });

      expect(config.namespacing?.enabled).toBe(true);
      expect(config.namespacing?.basePath).toBe("src/pages");
      expect(config.namespacing?.defaultNamespace).toBe("global");
      expect(config.namespacing?.framework).toBe("nextjs-pages");
    });

    it("namespaceLocation이 없으면 기존 namespacing 설정 유지", () => {
      const testConfig = {
        languages: ["en", "ko"],
        defaultLanguage: "en",
        localesDir: "./locales",
        sourcePattern: "app/**/*.tsx",
        translationImportSource: "i18nexus",
        namespacing: {
          enabled: true,
          basePath: "src/app",
          defaultNamespace: "custom",
        },
      };

      fs.writeFileSync(testConfigPath, JSON.stringify(testConfig));

      const config = loadConfig(testConfigPath, { silent: true });

      expect(config.namespacing?.enabled).toBe(true);
      expect(config.namespacing?.basePath).toBe("src/app");
      expect(config.namespacing?.defaultNamespace).toBe("custom");
    });
  });
});
