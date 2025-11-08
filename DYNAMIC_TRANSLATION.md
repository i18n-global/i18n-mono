# Dynamic Translation Wrapper - v2.11.0

## Overview

This release introduces **Dynamic Translation Wrapper utilities** - a solution to handle dynamic variable names and complex data structures in translations.

## Problem Solved

### ❌ Before (Doesn't Work)

```typescript
const championshipTypes = ["League", "Cup", "Group"];
const matchCounts = [0, 8, 4];

// This syntax is INVALID - variable names must be simple identifiers
t("{{championshipTypes[index]}}은 {{matchCount[index]}}개 팀 필요", {
  "championshipTypes[index]": championshipTypes[index], // ❌ Invalid syntax
  "matchCount[index]": matchCount[index], // ❌ Invalid syntax
});
```

### ✅ After (Works)

```typescript
// Solution: Compute values first, then pass to translation
const type = championshipTypes[index];
const count = matchCounts[index];

const message = createDynamicTranslation(t("{{type}}은 {{count}}개 팀 필요"), {
  type,
  count: String(count),
});
```

## New Utilities

### 1. `createDynamicTranslation(translatedText, variables)`

Substitute variables into already-translated text.

```typescript
const result = createDynamicTranslation(
  "{{name}}님은 {{score}} 포인트를 얻었습니다",
  { name: "Alice", score: "1500" }
);
// Result: "Alice님은 1500 포인트를 얻었습니다"
```

**Key Features:**

- Works with already-translated strings
- Preserves unreplaced placeholders
- Handles null/undefined gracefully
- Pure string substitution - no rendering

### 2. `buildTranslationParams(data)`

Build translation parameters from a data object, converting all values to strings.

```typescript
const params = buildTranslationParams({
  type: "League",
  count: 0, // Numbers are converted to strings
  active: true, // Booleans are converted to strings
});
// Result: { type: "League", count: "0", active: "true" }
```

**Key Features:**

- Auto-converts numbers to strings
- Auto-converts booleans to strings
- Skips undefined and null values
- Perfect for mapping complex data structures

### 3. `mapToTranslationParams(values, keys)`

Map an array of values to translation parameters using corresponding keys.

```typescript
const values = ["League", 0, 12];
const keys = ["type", "count", "teams"];

const params = mapToTranslationParams(values, keys);
// Result: { type: "League", count: "0", teams: "12" }
```

**Key Features:**

- Maps arrays to key-value pairs
- Handles mismatched lengths gracefully
- Converts all values to strings
- Useful for batch variable substitution

### 4. `buildConditionalTranslation(condition, options)`

Choose a translation key and parameters based on a condition.

```typescript
const [key, params] = buildConditionalTranslation(
  championshipType === "league",
  {
    true: ["league_description", { teams: "12" }],
    false: ["cup_description", { rounds: "4" }],
  }
);
```

**Key Features:**

- Returns translation key and parameters as tuple
- Works seamlessly with useTranslation hook
- Cleaner than ternary operators

## Usage Patterns

### Pattern 1: Array/Object Indexing

```typescript
const championshipTypes = ["League", "Cup", "Group"];
const matchCounts = [0, 8, 4];

const renderInfo = (index: number) => {
  const type = championshipTypes[index];
  const count = matchCounts[index];

  const params = buildTranslationParams({ type, count });
  const message = createDynamicTranslation(
    t("{{type}}은 {{count}}개 팀 필요"),
    params
  );
  return message;
};
```

### Pattern 2: Complex Data Structures

```typescript
interface Player {
  name: string;
  score: number;
  level: number;
}

const player: Player = { name: "Alice", score: 1500, level: 10 };

const params = buildTranslationParams(player);
const message = createDynamicTranslation(
  t("{{name}} - Score: {{score}}, Level: {{level}}"),
  params
);
```

### Pattern 3: Type-Safe with as const

```typescript
const championshipConfig = {
  league: { name: "League", minTeams: 12, maxTeams: 20 },
  cup: { name: "Cup", minTeams: 4, maxTeams: 16 },
} as const;

const renderInfo = (type: keyof typeof championshipConfig) => {
  const config = championshipConfig[type];
  const params = buildTranslationParams(config);
  const message = createDynamicTranslation(
    t("{{name}}: {{minTeams}}명 ~ {{maxTeams}}명 필요"),
    params
  );
  return message;
};
```

### Pattern 4: Conditional Translations

```typescript
const [key, params] = buildConditionalTranslation(isLeague, {
  true: ["league_desc", buildTranslationParams({ type: "League" })],
  false: ["cup_desc", buildTranslationParams({ type: "Cup" })],
});

// Use directly with useTranslation
const { t } = useTranslation();
const message = t(key as any, params);
```

## Real-World Example

```typescript
import { useTranslation, createDynamicTranslation, buildTranslationParams } from "i18nexus";

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

  return <div className="notification">{finalMessage}</div>;
}
```

## Breaking Changes

None. This release is fully backward compatible.

## API Reference

### `createDynamicTranslation(translatedText: string, variables: Record<string, unknown>): string`

**Parameters:**

- `translatedText`: String containing {{variable}} placeholders
- `variables`: Object with variable values

**Returns:** String with substituted variables

**Notes:**

- Unreplaced placeholders are preserved
- Null/undefined values are not substituted

### `buildTranslationParams(data: Record<string, unknown>): TranslationVariables`

**Parameters:**

- `data`: Object with values to convert

**Returns:** Object with all values converted to strings

**Notes:**

- Skips undefined and null values
- Converts all other types to strings

### `mapToTranslationParams(values: unknown[], keys: string[]): TranslationVariables`

**Parameters:**

- `values`: Array of values
- `keys`: Array of corresponding keys

**Returns:** Object mapping keys to stringified values

**Notes:**

- Uses minimum of arrays' lengths

### `buildConditionalTranslation(condition: boolean, options: { true: [key, params?], false: [key, params?] }): [key, params?]`

**Parameters:**

- `condition`: Boolean condition
- `options`: Object with true/false branches

**Returns:** Tuple of [translationKey, parameters]

**Notes:**

- Each branch is a tuple of [key, params]
- Params are optional

## Testing

All utilities include comprehensive test coverage:

- 26 new tests for dynamic translation utilities
- 105 total tests passing
- 100% test coverage for new features

## Migration Guide

No migration needed - this is an additive release. Existing code continues to work unchanged.

## Size Impact

- Package size: 35.8 kB (unchanged from 2.10.0)
- Tree-shakeable: All utilities can be individually imported
- No additional peer dependencies

## Related Features

- ✅ Type-safe translation keys (v2.8.0)
- ✅ Generic useTranslation parameters (v2.9.0)
- ✅ Automatic I18nProvider type extraction (v2.10.0)
- ✅ **Dynamic translation wrappers (v2.11.0)** ← NEW

## Limitations & Edge Cases

### ❌ What Doesn't Work

#### 1. Complex Variable Names (Cannot be fixed)

```typescript
// ❌ INVALID - Variable names must be simple identifiers
{
  "championshipTypes[index]": value,           // Invalid syntax
  "data.user.name": value,                    // Invalid syntax
  "items[0]": value,                          // Invalid syntax
}

// ✅ VALID - Extract values first
const value = championshipTypes[index];
{ championshipType: value }
```

**Why:** JavaScript object keys cannot contain bracket notation or dots (unless quoted as strings, which doesn't work with template substitution).

#### 2. Dynamic Template Keys (Cannot be fixed)

```typescript
// ❌ INVALID - Template keys must be static
const key = "user_" + type;
t(`{{${key}}}`, variables); // Won't work

// ✅ VALID - Use conditional translation
const [key, params] = buildConditionalTranslation(type === "admin", {
  true: ["admin_message", params],
  false: ["user_message", params],
});
t(key, params);
```

**Why:** Translation keys must be known at compile time for type safety.

#### 3. Nested Object/Array Access (Cannot be fixed)

```typescript
// ❌ INVALID
t("{{users[0].name}}", { "users[0].name": users[0].name });

// ✅ VALID - Extract the value first
const name = users[0].name;
t("{{name}}", { name });
```

**Why:** Placeholder syntax only supports simple identifiers (alphanumeric + underscore).

#### 4. Computed Property Names (Cannot be fixed)

```typescript
// ❌ INVALID
const key = `team_${type}`;
t(`{{${key}}}`, { [key]: value });

// ✅ VALID - Pre-compute values
const type = "league";
const teamValue = teamData[type];
t("{{team}}", { team: teamValue });
```

**Why:** Similar to #1 - computed names don't work in template syntax.

### ✅ Workarounds

#### Workaround 1: Conditional JSX (Best for mixed content)

```typescript
// When some text needs translation and some is dynamic data
{championshipType === 0 ? (
  <p>{t("no_team_limit")}</p>
) : (
  <p>
    {t("select_teams")} ({matchCount[championshipType]}{t("teams")})
  </p>
)}
```

#### Workaround 2: Template Literals (Simple cases)

```typescript
// For simple dynamic content without i18n requirements
const type = championshipTypes[index];
const count = matchCount[index];

`${type}은 ${count}개 팀 필요`; // No translation, but supports any syntax
```

#### Workaround 3: Pre-Computed Messages (Complex cases)

```typescript
// Build translations ahead of time
const messages = championshipTypes.map((type, index) => ({
  type,
  count: matchCount[index],
  message: t("teams_required", { type, count: String(matchCount[index]) }),
}));

// Then use the pre-computed message
messages[championshipType].message;
```

#### Workaround 4: Message Builder Function

```typescript
// Create a helper function for this specific case
function getTeamsRequiredMessage(championshipType: number): string {
  const type = championshipTypes[championshipType];
  const count = matchCount[championshipType];

  if (championshipType === 0) {
    return t("no_team_limit");
  }

  const params = buildTranslationParams({ type, count });
  return createDynamicTranslation(
    t("teams_required_template"),
    params
  );
}

// Usage
<p>{getTeamsRequiredMessage(championshipType)}</p>
```

#### Workaround 5: i18n JSON Structure

```typescript
// Define all possible messages upfront in your i18n config
export const translations = {
  en: {
    championship_league: "League has no team selection limit",
    championship_cup: "Cup requires exactly 8 teams",
    championship_group: "Group requires exactly 4 teams",
  },
};

// Usage
<p>{t(`championship_${championshipTypes[championshipType].toLowerCase()}`)}</p>
```

## Decision Tree: Which Solution to Use?

```
Does the text vary based on data?
├─ YES: Is it a simple string concatenation?
│  ├─ YES: Use template literal or conditional JSX
│  └─ NO: Is it translatable content?
│     ├─ YES: Pre-compute value, use createDynamicTranslation
│     └─ NO: Use template literal
└─ NO: Use regular t() call
```

## Next Steps

See `DYNAMIC_TRANSLATION.md` for comprehensive documentation and examples.

```

```
