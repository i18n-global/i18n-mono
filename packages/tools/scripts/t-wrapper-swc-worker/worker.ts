/**
 * Worker Thread 실행 코드
 * - 파일 파싱 (SWC)
 * - AST 변환 (Babel traverse/generator)
 * - 파일 쓰기
 */

import { parentPort } from "worker_threads";
import { parseSync } from "@swc/core";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import { WorkerTask, WorkerResult } from "./types";
import { tryTransformComponent } from "../t-wrapper/ast/component-transformer";
import {
  applyTranslationsToAST,
  writeASTToFile,
} from "../t-wrapper/applier/translation-applier";

if (!parentPort) {
  throw new Error("This file must be run as a Worker Thread");
}

/**
 * SWC로 파싱 후 Babel AST로 변환
 *
 * 참고: SWC의 parseSync는 SWC AST를 반환하지만,
 * 여기서는 transform을 통해 코드를 먼저 정규화한 후
 * Babel로 다시 파싱하는 방식을 사용합니다.
 */
function parseWithSwc(code: string): t.File {
  try {
    // SWC로 빠르게 파싱 (문법 검증 및 트랜스파일)
    const result = parseSync(code, {
      syntax: "typescript",
      tsx: true,
      decorators: true,
      dynamicImport: true,
    });

    // SWC AST를 Babel AST로 변환하는 것은 복잡하므로,
    // 대신 Babel parser를 직접 사용 (하이브리드 접근)
    // SWC의 주된 이점은 병렬 처리에서 나옴
    const babelParser = require("@babel/parser");
    return babelParser.parse(code, {
      sourceType: "module",
      plugins: [
        "typescript",
        "jsx",
        "decorators-legacy",
        "classProperties",
        "objectRestSpread",
      ],
    });
  } catch (error) {
    throw new Error(`Parse error: ${error}`);
  }
}

/**
 * 파일 처리 메인 함수
 */
function processFile(task: WorkerTask): WorkerResult {
  const startTime = Date.now();
  const { filePath, code, config } = task;

  try {
    // 1. 파싱 (SWC/Babel 하이브리드)
    const ast = parseWithSwc(code);

    // 2. AST 순회 및 변환
    let isFileModified = false;
    const modifiedComponentPaths: NodePath<t.Function>[] = [];

    traverse(ast, {
      FunctionDeclaration: (path) => {
        if (tryTransformComponent(path, code, modifiedComponentPaths)) {
          isFileModified = true;
        }
      },
      ArrowFunctionExpression: (path) => {
        if (
          t.isVariableDeclarator(path.parent) &&
          t.isIdentifier(path.parent.id)
        ) {
          if (tryTransformComponent(path, code, modifiedComponentPaths)) {
            isFileModified = true;
          }
        }
      },
    });

    // 3. 변경사항 적용
    if (isFileModified) {
      applyTranslationsToAST(ast, modifiedComponentPaths, config);
      writeASTToFile(ast, filePath, config);

      const processingTime = Date.now() - startTime;
      return {
        type: "success",
        filePath,
        modified: true,
        processingTime,
      };
    } else {
      const processingTime = Date.now() - startTime;
      return {
        type: "no-change",
        filePath,
        modified: false,
        processingTime,
      };
    }
  } catch (error) {
    return {
      type: "error",
      filePath,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Worker 메시지 리스너
 */
parentPort.on("message", (task: WorkerTask) => {
  if (task.type === "process-file") {
    const result = processFile(task);
    parentPort!.postMessage(result);
  }
});
