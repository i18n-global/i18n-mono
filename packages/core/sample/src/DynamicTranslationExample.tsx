/**
 * Example: Dynamic Translation Wrapper
 *
 * Demonstrates how to use the dynamic translation utilities to solve
 * the problem of dynamic variable names and array/object indexing
 */

import React from "react";
import {
  createDynamicTranslation,
  buildTranslationParams,
  mapToTranslationParams,
  buildConditionalTranslation,
} from "i18nexus";

/**
 * Example 1: Using arrays with computed indices
 *
 * BEFORE (❌ doesn't work):
 * ```
 * t("{{championshipTypes[index]}}은 {{matchCount[index]}}개 팀 필요", {
 *   championshipTypes[index]: championshipTypes[index],  // ❌ Invalid syntax
 * })
 * ```
 *
 * AFTER (✅ works):
 * ```
 * const type = championshipTypes[index];
 * const count = matchCount[index];
 * t("{{type}}은 {{count}}개 팀 필요", { type, count: String(count) })
 * ```
 */
export function ChampionshipExample() {
  const championshipTypes = ["League", "Cup", "Group"];
  const matchCounts = [0, 8, 4];

  // Solution 1: Compute values first, then pass to translation
  const renderWithComputedValues = (index: number) => {
    const type = championshipTypes[index];
    const count = matchCounts[index];

    const translatedText = `{{type}}은 정확히 {{count}}개 팀 필요`;
    const message = createDynamicTranslation(translatedText, {
      type,
      count: String(count),
    });

    return message;
  };

  // Solution 2: Use buildTranslationParams for cleaner code
  const renderWithBuiltParams = (index: number) => {
    const data = {
      type: championshipTypes[index],
      count: matchCounts[index],
    };

    const params = buildTranslationParams(data);
    const translatedText = `{{type}}은 정확히 {{count}}개 팀 필요`;
    const message = createDynamicTranslation(translatedText, params);

    return message;
  };

  // Solution 3: Use mapToTranslationParams for array-based data
  const renderWithMappedParams = (index: number) => {
    const values = [championshipTypes[index], matchCounts[index]];
    const keys = ["type", "count"];

    const params = mapToTranslationParams(values, keys);
    const translatedText = `{{type}}은 정확히 {{count}}개 팀 필요`;
    const message = createDynamicTranslation(translatedText, params);

    return message;
  };

  return (
    <div>
      <h2>Championship Examples</h2>
      <ul>
        <li>{renderWithComputedValues(0)}</li>
        <li>{renderWithBuiltParams(1)}</li>
        <li>{renderWithMappedParams(2)}</li>
      </ul>
    </div>
  );
}

/**
 * Example 2: Conditional translations with dynamic data
 */
export function ConditionalChampionshipExample() {
  const championshipType = "league"; // or "cup"

  const [key, params] = buildConditionalTranslation(
    championshipType === "league",
    {
      true: [
        "league_description",
        buildTranslationParams({ type: "League", teams: 12 }),
      ],
      false: [
        "cup_description",
        buildTranslationParams({ type: "Cup", rounds: 4 }),
      ],
    }
  );

  return (
    <div>
      <h2>Conditional Championship: {key}</h2>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}

/**
 * Example 3: Complex dynamic data structure
 */
export function ComplexDynamicExample() {
  interface PlayerStats {
    name: string;
    score: number;
    level: number;
  }

  const playerStats: PlayerStats[] = [
    { name: "Alice", score: 1500, level: 10 },
    { name: "Bob", score: 2000, level: 15 },
    { name: "Charlie", score: 1200, level: 8 },
  ];

  const renderPlayerStats = (player: PlayerStats) => {
    const params = buildTranslationParams({
      name: player.name,
      score: player.score,
      level: player.level,
    });

    const translatedText = "{{name}}님은 {{score}} 포인트 / Level: {{level}}";
    return createDynamicTranslation(translatedText, params);
  };

  return (
    <div>
      <h2>Player Rankings</h2>
      <ul>
        {playerStats.map((player) => (
          <li key={player.name}>{renderPlayerStats(player)}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 4: Real-world use case with useTranslation hook
 */
import { useTranslation } from "i18nexus";

interface GameResult {
  playerName: string;
  championshipType: string;
  teamsRequired: number;
}

export function GameResultNotification({ result }: { result: GameResult }) {
  const { t } = useTranslation();

  // Step 1: Prepare your data
  const messageData = {
    player: result.playerName,
    championship: result.championshipType,
    teams: result.teamsRequired,
  };

  // Step 2: Build translation parameters
  const params = buildTranslationParams(messageData);

  // Step 3: Get translated template
  const translatedTemplate = t("game_result_template");

  // Step 4: Apply dynamic translation
  const finalMessage = createDynamicTranslation(translatedTemplate, params);

  return (
    <div className="notification">
      <p>{finalMessage}</p>
    </div>
  );
}

/**
 * Example 5: Type-safe pattern with as const
 */
export function TypeSafeExample() {
  // Define your data structure as const for type safety
  const championshipConfig = {
    league: {
      name: "League",
      minTeams: 12,
      maxTeams: 20,
    },
    cup: {
      name: "Cup",
      minTeams: 4,
      maxTeams: 16,
    },
  } as const;

  const renderChampionshipInfo = (type: keyof typeof championshipConfig) => {
    const config = championshipConfig[type];
    const params = buildTranslationParams({
      name: config.name,
      min: config.minTeams,
      max: config.maxTeams,
    });

    const translatedText = "{{name}}: {{min}}명 ~ {{max}}명의 팀이 필요합니다";
    return createDynamicTranslation(translatedText, params);
  };

  return (
    <div>
      <h2>Championship Info</h2>
      <p>{renderChampionshipInfo("league")}</p>
      <p>{renderChampionshipInfo("cup")}</p>
    </div>
  );
}

/**
 * Example 6: Complete solution for your problem
 */
export function CompleteSolutionExample() {
  // Your original problem:
  // const {t}= useTranslation()
  // t("{{championshipTypes[index]}}은 {{matchCount[index]}}개 팀 필요", {...})
  //
  // ✅ Complete solution:

  type ChampionshipType = "league" | "cup" | "group";

  const championshipTypes: Record<ChampionshipType, string> = {
    league: "League",
    cup: "Cup",
    group: "Group",
  };

  const matchCounts: Record<ChampionshipType, number> = {
    league: 0,
    cup: 8,
    group: 4,
  };

  const getChampionshipInfo = (championshipType: ChampionshipType) => {
    // Step 1: Extract values by key (not by index/bracket notation)
    const type = championshipTypes[championshipType];
    const count = matchCounts[championshipType];

    // Step 2: Create translation parameters
    const params = buildTranslationParams({
      type,
      count,
    });

    // Step 3: Get translated text (you would call t() for this)
    const translatedText = "{{type}}은 {{count}}개 팀 필요";

    // Step 4: Apply dynamic translation
    return createDynamicTranslation(translatedText, params);
  };

  return (
    <div>
      <h2>Complete Solution</h2>
      <div>{getChampionshipInfo("league")}</div>
      <div>{getChampionshipInfo("cup")}</div>
      <div>{getChampionshipInfo("group")}</div>
    </div>
  );
}

export default ChampionshipExample;

/**
 * Example 7: Edge Cases & Workarounds
 *
 * Some cases cannot be solved with dynamic translation.
 * These are fundamental limitations of JavaScript/TypeScript.
 *
 * This example shows the EDGE CASES and their RECOMMENDED WORKAROUNDS
 */

/**
 * EDGE CASE: Conditional rendering with mixed translated/dynamic content
 *
 * Your original problem:
 * ```
 * {championshipType === 0
 *   ? "리그는 팀 선택 제한이 없습니다"
 *   : `${championshipTypes[championshipType]}은 정확히 ${matchCount[championshipType]}개의 팀을 선택해야 합니다.`}
 * ```
 *
 * ❌ This doesn't work with i18n:
 * ```
 * {championshipType === 0
 *   ? t("리그는 팀 선택 제한이 없습니다")
 *   : t("{{championshipTypes[championshipType]}}은 정확히 {{matchCount[championshipType]}}개의 팀을 선택해야 합니다.", {
 *       championshipTypes[championshipType]: championshipTypes[championshipType], // ❌ INVALID SYNTAX
 *       matchCount[championshipType]: matchCount[championshipType], // ❌ INVALID SYNTAX
 *     })}
 * ```
 *
 * ✅ SOLUTION 1: Use conditional JSX (Recommended)
 * ```
 * {championshipType === 0 ? (
 *   <p>{t("no_team_limit")}</p>
 * ) : (
 *   <p>
 *     {championshipTypes[championshipType]}은 정확히 {matchCount[championshipType]}개의 팀을 선택해야 합니다.
 *   </p>
 * )}
 * ```
 */
export function EdgeCaseExample1_ConditionalRendering() {
  const { t } = useTranslation();

  const championshipTypes = ["League", "Cup", "Group"];
  const matchCounts = [0, 8, 4];
  const championshipType = 1; // Cup

  return (
    <div>
      <h3>Edge Case: Conditional with Mixed Content</h3>

      {/* ✅ SOLUTION 1: Conditional JSX */}
      <div className="solution-1">
        <h4>Solution 1: Conditional JSX (Best)</h4>
        {championshipType === 0 ? (
          <p>{t("no_team_limit")}</p>
        ) : (
          <p>
            {championshipTypes[championshipType]}은 정확히{" "}
            {matchCounts[championshipType]}개의 팀을 선택해야 합니다.
          </p>
        )}
      </div>

      {/* ✅ SOLUTION 2: Pre-computed message builder */}
      <div className="solution-2">
        <h4>Solution 2: Message Builder Function</h4>
        <p>{getTeamsRequiredMessage(championshipType)}</p>
      </div>

      {/* ✅ SOLUTION 3: Message map */}
      <div className="solution-3">
        <h4>Solution 3: Pre-computed Messages Map</h4>
        <p>{getMessageFromMap(championshipType)}</p>
      </div>
    </div>
  );
}

/**
 * SOLUTION 2: Message builder function
 * Separates the logic for handling different cases
 */
function getTeamsRequiredMessage(championshipType: number): string {
  const championshipTypes = ["League", "Cup", "Group"];
  const matchCounts = [0, 8, 4];
  const { t } = useTranslation();

  if (championshipType === 0) {
    return t("no_team_limit");
  }

  const type = championshipTypes[championshipType];
  const count = matchCounts[championshipType];

  // Now you can use dynamic translation safely
  const params = buildTranslationParams({ type, count });
  const template = t("select_teams_template"); // "{{type}}은 정확히 {{count}}개의 팀을 선택해야 합니다."
  return createDynamicTranslation(template, params);
}

/**
 * SOLUTION 3: Pre-computed message map
 * Build all messages upfront
 */
function getMessageFromMap(championshipType: number): string {
  const { t } = useTranslation();

  const championshipTypes = ["League", "Cup", "Group"];
  const matchCounts = [0, 8, 4];

  // Pre-compute all possible messages
  const messageMap: Record<number, string> = {
    0: t("no_team_limit"),
    1: (() => {
      const params = buildTranslationParams({
        type: championshipTypes[1],
        count: matchCounts[1],
      });
      return createDynamicTranslation(t("select_teams_template"), params);
    })(),
    2: (() => {
      const params = buildTranslationParams({
        type: championshipTypes[2],
        count: matchCounts[2],
      });
      return createDynamicTranslation(t("select_teams_template"), params);
    })(),
  };

  return messageMap[championshipType] || "";
}

/**
 * EDGE CASE: Complex object/array indexing
 *
 * ❌ These don't work:
 * - {{arr[0]}}
 * - {{obj.prop}}
 * - {{data[user.id]}}
 *
 * ✅ SOLUTION: Extract the value first
 */
export function EdgeCaseExample2_ComplexIndexing() {
  const championshipData = {
    league: { type: "League", minTeams: 12, maxTeams: 20 },
    cup: { type: "Cup", minTeams: 4, maxTeams: 16 },
    group: { type: "Group", minTeams: 8, maxTeams: 16 },
  };

  const renderChampionshipInfo = (key: "league" | "cup" | "group") => {
    // ✅ Extract values first
    const config = championshipData[key];
    const params = buildTranslationParams({
      name: config.type,
      min: config.minTeams,
      max: config.maxTeams,
    });

    const template = "{{name}}: {{min}}명 ~ {{max}}명의 팀이 필요합니다";
    return createDynamicTranslation(template, params);
  };

  return (
    <div>
      <h3>Edge Case: Complex Object Indexing</h3>
      <ul>
        <li>{renderChampionshipInfo("league")}</li>
        <li>{renderChampionshipInfo("cup")}</li>
        <li>{renderChampionshipInfo("group")}</li>
      </ul>
    </div>
  );
}

/**
 * EDGE CASE: Dynamic translation keys
 *
 * ❌ This doesn't work:
 * ```typescript
 * const key = "message_" + type;
 * t(`{{${key}}}`, variables); // ❌ Template interpolation with dynamic keys
 * ```
 *
 * ✅ SOLUTION: Use conditional translation builder
 */
export function EdgeCaseExample3_DynamicKeys() {
  const championshipType = "league"; // or "cup"

  const [key, params] = buildConditionalTranslation(
    championshipType === "league",
    {
      true: ["league_description", { teams: "12" }],
      false: ["cup_description", { rounds: "4" }],
    }
  );

  return (
    <div>
      <h3>Edge Case: Dynamic Translation Keys</h3>
      <p>Key: {key}</p>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}

/**
 * SUMMARY: When to Use What
 *
 * 1. Simple string: t("key")
 * 2. Single variable: t("Hello {{name}}", { name })
 * 3. Multiple variables: buildTranslationParams({ x, y, z }) + createDynamicTranslation()
 * 4. Conditional content: Use JSX conditional (? :)
 * 5. Complex logic: Create a helper function
 * 6. Array access: Extract value first
 * 7. Object access: Extract value first
 * 8. Dynamic keys: Use buildConditionalTranslation()
 */
export function SummaryGuide() {
  const scenarios = [
    {
      scenario: "Static translation",
      solution: 't("key")',
      example: 't("greeting")',
    },
    {
      scenario: "One variable",
      solution: "t + buildTranslationParams",
      example: "With 1 param",
    },
    {
      scenario: "Multiple variables",
      solution: "createDynamicTranslation()",
      example: "See ChampionshipExample",
    },
    {
      scenario: "Conditional content",
      solution: "JSX ternary operator",
      example: "See EdgeCaseExample1",
    },
    {
      scenario: "Complex logic",
      solution: "Helper function",
      example: "getTeamsRequiredMessage()",
    },
    {
      scenario: "Array/object access",
      solution: "Extract value first",
      example: "const val = arr[i]",
    },
    {
      scenario: "Dynamic keys",
      solution: "buildConditionalTranslation()",
      example: "See EdgeCaseExample3",
    },
  ];

  return (
    <div>
      <h2>Decision Guide: Which Solution to Use?</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "16px",
          }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}>
                Scenario
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}>
                Solution
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  textAlign: "left",
                }}>
                Example
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                }}>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.scenario}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.solution}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  {item.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
