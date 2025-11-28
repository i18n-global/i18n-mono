/**
 * Adaptive Translation Wrapper
 *
 * 파일 개수에 따라 자동으로 최적 버전 선택:
 * - < 3000 파일: Babel (단일 스레드)
 * - >= 3000 파일: SWC + Workers (병렬 처리)
 */

import { glob } from "glob";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { wrapTranslations as wrapWithBabel } from "./babel/wrapper";
import { wrapTranslations as wrapWithWorkers } from "./swc-worker/wrapper";

const FILE_COUNT_THRESHOLD = 3000;

export async function wrapTranslations(
  config: Partial<ScriptConfig> = {},
): Promise<{
  processedFiles: string[];
  totalTime: number;
  stats?: any;
  strategy?: "babel" | "swc-worker";
}> {
  const fullConfig = {
    ...SCRIPT_CONFIG_DEFAULTS,
    ...config,
  } as Required<ScriptConfig>;

  // 1. 파일 개수 확인
  const filePaths = await glob(fullConfig.sourcePattern);
  const fileCount = filePaths.length;

  // 2. 전략 선택
  const useWorkers = fileCount >= FILE_COUNT_THRESHOLD;
  const strategy = useWorkers ? "swc-worker" : "babel";

  console.log(`📁 Found ${fileCount} files`);
  console.log(
    `🎯 Strategy: ${strategy} ${useWorkers ? "(parallel processing)" : "(single-threaded)"}`,
  );

  // 3. 선택된 전략으로 실행
  if (useWorkers) {
    const result = await wrapWithWorkers(config);
    return {
      ...result,
      strategy: "swc-worker",
    };
  } else {
    const result = await wrapWithBabel(config);
    return {
      ...result,
      strategy: "babel",
    };
  }
}
