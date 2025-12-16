/**
 * Namespace Inference 테스트
 */

import * as path from "path";
import {
  inferNamespaceFromPath,
  inferNamespaceFromFile,
  findUseTranslationCalls,
  validateNamespace,
  NamespacingConfig,
} from "./namespace-inference";

describe("Namespace Inference", () => {
  const baseConfig: NamespacingConfig = {
    enabled: true,
    basePath: "src/app",
    defaultNamespace: "common",
    framework: "nextjs-app",
  };

  describe("inferNamespaceFromPath", () => {
    it("should infer namespace from first folder (default strategy)", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const config = { ...baseConfig, strategy: "first-folder" as const };

      const namespace = inferNamespaceFromPath(filePath, config);

      expect(namespace).toBe("dashboard");
    });

    it("should infer namespace using full-path strategy", () => {
      const filePath = path.join(
        "src/app",
        "dashboard",
        "settings",
        "page.tsx",
      );
      const config = { ...baseConfig, strategy: "full-path" as const };

      const namespace = inferNamespaceFromPath(filePath, config);

      expect(namespace).toBe("dashboard-settings");
    });

    it("should infer namespace using last-folder strategy", () => {
      const filePath = path.join(
        "src/app",
        "dashboard",
        "settings",
        "page.tsx",
      );
      const config = { ...baseConfig, strategy: "last-folder" as const };

      const namespace = inferNamespaceFromPath(filePath, config);

      expect(namespace).toBe("settings");
    });

    it("should return defaultNamespace when file is outside basePath", () => {
      const filePath = path.join("src", "components", "Button.tsx");
      const config = baseConfig;

      const namespace = inferNamespaceFromPath(filePath, config);

      expect(namespace).toBe("common");
    });

    it("should return defaultNamespace when namespacing is disabled", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const config = { ...baseConfig, enabled: false };

      const namespace = inferNamespaceFromPath(filePath, config);

      expect(namespace).toBe("common");
    });

    describe("Next.js App Router patterns", () => {
      it("should remove route groups (parentheses)", () => {
        const filePath = path.join("src/app", "(auth)", "login", "page.tsx");
        const config = { ...baseConfig, framework: "nextjs-app" as const };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("login");
      });

      it("should remove private folders (starting with _)", () => {
        const filePath = path.join(
          "src/app",
          "dashboard",
          "_components",
          "page.tsx",
        );
        const config = { ...baseConfig, framework: "nextjs-app" as const };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("dashboard");
      });

      it("should remove dynamic routes [id]", () => {
        const filePath = path.join("src/app", "users", "[id]", "page.tsx");
        const config = { ...baseConfig, framework: "nextjs-app" as const };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("users");
      });

      it("should remove catch-all routes [...slug]", () => {
        const filePath = path.join("src/app", "docs", "[...slug]", "page.tsx");
        const config = { ...baseConfig, framework: "nextjs-app" as const };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("docs");
      });
    });

    describe("Next.js Pages Router patterns", () => {
      it("should remove dynamic routes [id]", () => {
        const filePath = path.join("src/pages", "users", "[id].tsx");
        const config = {
          ...baseConfig,
          framework: "nextjs-pages" as const,
          basePath: "src/pages",
        };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("users");
      });
    });

    describe("TanStack Router patterns", () => {
      it("should handle file-based routing", () => {
        const filePath = path.join("src/routes", "dashboard.about.tsx");
        const config = {
          ...baseConfig,
          framework: "tanstack-file" as const,
          basePath: "src/routes",
        };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("dashboard");
      });

      it("should handle folder-based routing", () => {
        const filePath = path.join("src/routes", "dashboard", "_layout.tsx");
        const config = {
          ...baseConfig,
          framework: "tanstack-folder" as const,
          basePath: "src/routes",
        };

        const namespace = inferNamespaceFromPath(filePath, config);

        expect(namespace).toBe("dashboard");
      });
    });

    it("should handle special file names (page, layout, template)", () => {
      const filePath = path.join("src/app", "page.tsx");
      const config = baseConfig;

      const namespace = inferNamespaceFromPath(filePath, config);

      expect(namespace).toBe("common");
    });
  });

  describe("findUseTranslationCalls", () => {
    it("should find useTranslation calls with namespace", () => {
      const code = `
        import { useTranslation } from "i18nexus";
        
        export default function Page() {
          const { t } = useTranslation("dashboard");
          return <div>{t("title")}</div>;
        }
      `;

      const calls = findUseTranslationCalls("test.tsx", code);

      expect(calls).toHaveLength(1);
      expect(calls[0].namespace).toBe("dashboard");
    });

    it("should find useTranslation calls without namespace", () => {
      const code = `
        const { t } = useTranslation();
      `;

      const calls = findUseTranslationCalls("test.tsx", code);

      expect(calls).toHaveLength(1);
      expect(calls[0].namespace).toBeUndefined();
    });

    it("should find multiple useTranslation calls", () => {
      const code = `
        const { t1 } = useTranslation("home");
        const { t2 } = useTranslation("about");
      `;

      const calls = findUseTranslationCalls("test.tsx", code);

      expect(calls).toHaveLength(2);
      expect(calls[0].namespace).toBe("home");
      expect(calls[1].namespace).toBe("about");
    });

    it("should return empty array for invalid code", () => {
      const code = "invalid syntax {{{{";

      const calls = findUseTranslationCalls("test.tsx", code);

      expect(calls).toEqual([]);
    });
  });

  describe("inferNamespaceFromFile", () => {
    it("should prioritize explicit namespace in useTranslation", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `
        const { t } = useTranslation("settings");
      `;
      const config = baseConfig;

      const namespace = inferNamespaceFromFile(filePath, code, config);

      expect(namespace).toBe("settings");
    });

    it("should fall back to path-based inference when no useTranslation", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `export default function Page() { return <div>Hello</div>; }`;
      const config = baseConfig;

      const namespace = inferNamespaceFromFile(filePath, code, config);

      expect(namespace).toBe("dashboard");
    });

    it("should return defaultNamespace when namespacing is disabled", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `const { t } = useTranslation("dashboard");`;
      const config = { ...baseConfig, enabled: false };

      const namespace = inferNamespaceFromFile(filePath, code, config);

      expect(namespace).toBe("common");
    });
  });

  describe("validateNamespace", () => {
    it("should return valid when namespace matches", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `const { t } = useTranslation("dashboard");`;
      const config = baseConfig;

      const result = validateNamespace(filePath, code, "dashboard", config);

      expect(result.valid).toBe(true);
    });

    it("should return invalid when namespace doesn't match", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `const { t } = useTranslation("settings");`;
      const config = baseConfig;

      const result = validateNamespace(filePath, code, "dashboard", config);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Namespace Mismatch");
    });

    it("should return invalid when useTranslation has no namespace", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `const { t } = useTranslation();`;
      const config = baseConfig;

      const result = validateNamespace(filePath, code, "dashboard", config);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Namespace required");
    });

    it("should return valid when namespacing is disabled", () => {
      const filePath = path.join("src/app", "dashboard", "page.tsx");
      const code = `const { t } = useTranslation();`;
      const config = { ...baseConfig, enabled: false };

      const result = validateNamespace(filePath, code, "dashboard", config);

      expect(result.valid).toBe(true);
    });
  });
});
