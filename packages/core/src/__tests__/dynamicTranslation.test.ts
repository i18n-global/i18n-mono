import {
  createDynamicTranslation,
  buildTranslationParams,
  buildConditionalTranslation,
  mapToTranslationParams,
} from "../utils/dynamicTranslation";

describe("dynamicTranslation", () => {
  describe("createDynamicTranslation", () => {
    it("should substitute simple variables", () => {
      const result = createDynamicTranslation("Hello {{name}}", {
        name: "John",
      });
      expect(result).toBe("Hello John");
    });

    it("should substitute multiple variables", () => {
      const result = createDynamicTranslation(
        "{{type}}은 {{count}}개 팀 필요",
        { type: "League", count: "0" },
      );
      expect(result).toBe("League은 0개 팀 필요");
    });

    it("should handle numeric values", () => {
      const result = createDynamicTranslation("Count: {{count}}", {
        count: 42,
      });
      expect(result).toBe("Count: 42");
    });

    it("should preserve unreplaced placeholders", () => {
      const result = createDynamicTranslation("Name: {{name}}, Age: {{age}}", {
        name: "John",
      });
      expect(result).toBe("Name: John, Age: {{age}}");
    });

    it("should handle empty variables", () => {
      const result = createDynamicTranslation("Hello {{name}}", {});
      expect(result).toBe("Hello {{name}}");
    });

    it("should return original text if no variables provided", () => {
      const text = "Hello world";
      const result = createDynamicTranslation(text, {});
      expect(result).toBe(text);
    });

    it("should handle undefined variables gracefully", () => {
      const variables: Record<string, unknown> = { value: undefined };
      const result = createDynamicTranslation("Value: {{value}}", variables);
      expect(result).toBe("Value: {{value}}");
    });

    it("should convert null to string", () => {
      const variables: Record<string, unknown> = { value: null };
      const result = createDynamicTranslation("Value: {{value}}", variables);
      expect(result).toBe("Value: {{value}}");
    });

    it("should work with real-world example", () => {
      const championshipTypes = ["League", "Cup", "Group"];
      const matchCounts = [0, 8, 4];

      const type = championshipTypes[0];
      const count = matchCounts[0];

      const result = createDynamicTranslation(
        "{{type}}은 정확히 {{count}}개 팀 필요",
        { type, count: String(count) },
      );

      expect(result).toBe("League은 정확히 0개 팀 필요");
    });
  });

  describe("buildTranslationParams", () => {
    it("should build params from object", () => {
      const result = buildTranslationParams({
        type: "League",
        count: 0,
      });

      expect(result).toEqual({
        type: "League",
        count: "0",
      });
    });

    it("should convert numbers to strings", () => {
      const result = buildTranslationParams({
        age: 42,
        score: 100.5,
      });

      expect(result).toEqual({
        age: "42",
        score: "100.5",
      });
    });

    it("should skip undefined values", () => {
      const result = buildTranslationParams({
        name: "John",
        middle: undefined,
        last: "Doe",
      });

      expect(result).toEqual({
        name: "John",
        last: "Doe",
      });
    });

    it("should skip null values", () => {
      const result = buildTranslationParams({
        name: "John",
        middle: null,
        last: "Doe",
      });

      expect(result).toEqual({
        name: "John",
        last: "Doe",
      });
    });

    it("should skip complex objects", () => {
      const result = buildTranslationParams({
        name: "John",
        data: { nested: true },
        array: [1, 2, 3],
      });

      expect(result).toEqual({
        name: "John",
        data: "[object Object]",
        array: "1,2,3",
      });
    });

    it("should handle empty object", () => {
      const result = buildTranslationParams({});
      expect(result).toEqual({});
    });
  });

  describe("buildConditionalTranslation", () => {
    it("should return true option when condition is true", () => {
      const result = buildConditionalTranslation(true, {
        true: ["greeting", { name: "John" }],
        false: ["farewell", { name: "Jane" }],
      });

      expect(result).toEqual(["greeting", { name: "John" }]);
    });

    it("should return false option when condition is false", () => {
      const result = buildConditionalTranslation(false, {
        true: ["greeting", { name: "John" }],
        false: ["farewell", { name: "Jane" }],
      });

      expect(result).toEqual(["farewell", { name: "Jane" }]);
    });

    it("should handle undefined params", () => {
      const result = buildConditionalTranslation(true, {
        true: ["greeting"],
        false: ["farewell"],
      });

      expect(result).toEqual(["greeting"]);
    });
  });

  describe("mapToTranslationParams", () => {
    it("should map array values to keys", () => {
      const result = mapToTranslationParams(
        ["League", 0, true],
        ["type", "count", "isRestricted"],
      );

      expect(result).toEqual({
        type: "League",
        count: "0",
        isRestricted: "true",
      });
    });

    it("should handle mismatched lengths (more values)", () => {
      const result = mapToTranslationParams(
        ["John", "Doe", "Mr"],
        ["first", "last"],
      );

      expect(result).toEqual({
        first: "John",
        last: "Doe",
      });
    });

    it("should handle mismatched lengths (more keys)", () => {
      const result = mapToTranslationParams(
        ["John", "Doe"],
        ["first", "middle", "last"],
      );

      expect(result).toEqual({
        first: "John",
        middle: "Doe",
      });
    });

    it("should skip null and undefined values", () => {
      const result = mapToTranslationParams(
        ["John", null, "Doe", undefined],
        ["first", "middle", "last", "suffix"],
      );

      expect(result).toEqual({
        first: "John",
        last: "Doe",
      });
    });

    it("should convert numbers to strings", () => {
      const result = mapToTranslationParams([42, 3.14], ["age", "pi"]);

      expect(result).toEqual({
        age: "42",
        pi: "3.14",
      });
    });

    it("should handle empty arrays", () => {
      const result = mapToTranslationParams([], ["first", "second"]);
      expect(result).toEqual({});
    });

    it("should handle boolean values", () => {
      const result = mapToTranslationParams([true, false], ["active", "admin"]);

      expect(result).toEqual({
        active: "true",
        admin: "false",
      });
    });

    it("should work with real-world example", () => {
      const championshipData = {
        league: { type: "League", count: 0 },
        cup: { type: "Cup", count: 8 },
      };

      const type = championshipData.league.type;
      const count = championshipData.league.count;

      const result = mapToTranslationParams([type, count], ["type", "count"]);

      expect(result).toEqual({
        type: "League",
        count: "0",
      });
    });
  });

  describe("integration tests", () => {
    it("should work together: buildParams + createDynamicTranslation", () => {
      const data = { name: "Alice", score: 1000 };
      const params = buildTranslationParams(data);
      const result = createDynamicTranslation(
        "Player {{name}} scored {{score}} points",
        params,
      );

      expect(result).toBe("Player Alice scored 1000 points");
    });

    it("should work together: mapToParams + createDynamicTranslation", () => {
      const values = ["Bob", 500];
      const keys = ["name", "score"];
      const params = mapToTranslationParams(values, keys);
      const result = createDynamicTranslation(
        "{{name}} has {{score}} points",
        params,
      );

      expect(result).toBe("Bob has 500 points");
    });

    it("should work together: conditional + params", () => {
      const isLeague = true;
      const params1 = buildTranslationParams({ type: "League", count: 0 });
      const params2 = buildTranslationParams({ type: "Cup", count: 8 });

      const [key, params] = buildConditionalTranslation(isLeague, {
        true: ["league_desc", params1],
        false: ["cup_desc", params2],
      });

      expect(key).toBe("league_desc");
      expect(params).toEqual({
        type: "League",
        count: "0",
      });
    });
  });
});
