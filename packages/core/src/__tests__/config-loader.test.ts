/**
 * Tests for config loader functionality
 */

import * as fs from "fs";
import * as pathLib from "path";
import * as os from "os";
import {
  loadI18nexusConfig,
  loadI18nexusConfigSilently,
} from "../utils/config-loader";

describe("Config Loader", () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(() => {
    // Create temporary directory
    tempDir = fs.mkdtempSync(pathLib.join(os.tmpdir(), "i18nexus-test-"));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("loadI18nexusConfig", () => {
    it("should return null when config file does not exist", () => {
      const config = loadI18nexusConfig("nonexistent.config.json", {
        silent: true,
      });
      expect(config).toBeNull();
    });

    it("should load config file successfully", () => {
      const configContent = {
        fallbackNamespace: "common",
        enableFallback: true,
        languages: ["en", "ko"],
        defaultLanguage: "en",
      };

      fs.writeFileSync(
        "i18nexus.config.json",
        JSON.stringify(configContent, null, 2),
      );

      const config = loadI18nexusConfig("i18nexus.config.json", {
        silent: true,
      });

      expect(config).not.toBeNull();
      expect(config?.fallbackNamespace).toBe("common");
      expect(config?.enableFallback).toBe(true);
      expect(config?.languages).toEqual(["en", "ko"]);
      expect(config?.defaultLanguage).toBe("en");
    });

    it("should handle missing fallbackNamespace gracefully", () => {
      const configContent = {
        languages: ["en", "ko"],
      };

      fs.writeFileSync(
        "i18nexus.config.json",
        JSON.stringify(configContent, null, 2),
      );

      const config = loadI18nexusConfig("i18nexus.config.json", {
        silent: true,
      });

      expect(config).not.toBeNull();
      expect(config?.fallbackNamespace).toBeUndefined();
    });

    it("should default enableFallback to true when not specified", () => {
      const configContent = {
        fallbackNamespace: "common",
      };

      fs.writeFileSync(
        "i18nexus.config.json",
        JSON.stringify(configContent, null, 2),
      );

      const config = loadI18nexusConfig("i18nexus.config.json", {
        silent: true,
      });

      expect(config?.enableFallback).toBe(true);
    });

    it("should handle invalid JSON gracefully", () => {
      fs.writeFileSync("i18nexus.config.json", "invalid json{");

      const config = loadI18nexusConfig("i18nexus.config.json", {
        silent: true,
      });

      expect(config).toBeNull();
    });
  });

  describe("loadI18nexusConfigSilently", () => {
    it("should load config without console output", () => {
      const configContent = {
        fallbackNamespace: "common",
      };

      fs.writeFileSync(
        "i18nexus.config.json",
        JSON.stringify(configContent, null, 2),
      );

      const config = loadI18nexusConfigSilently("i18nexus.config.json");

      expect(config).not.toBeNull();
      expect(config?.fallbackNamespace).toBe("common");
    });
  });
});
