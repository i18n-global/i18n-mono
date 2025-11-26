#!/usr/bin/env node

const { spawn } = require("child_process");
const net = require("net");

// 포트가 사용 가능한지 확인
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close();
      resolve(true);
    });

    server.listen(port, "127.0.0.1");
  });
}

// 사용 가능한 포트 찾기
async function findAvailablePort(startPort = 3000, maxPort = 3100) {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(
    `No available port found between ${startPort} and ${maxPort}`
  );
}

// Next.js 개발 서버 시작
async function startDevServer() {
  try {
    const port = await findAvailablePort(3000);
    console.log(`\n🚀 Starting Next.js on port ${port}...\n`);

    const child = spawn("next", ["dev", "-p", port.toString()], {
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });

    child.on("close", (code) => {
      process.exit(code);
    });

    // Handle termination signals
    process.on("SIGINT", () => {
      child.kill("SIGINT");
    });

    process.on("SIGTERM", () => {
      child.kill("SIGTERM");
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

startDevServer();
