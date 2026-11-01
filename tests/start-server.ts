import { spawn, type ChildProcess } from "node:child_process";
import { config } from "dotenv";

export const TEST_PORT = 3100;

// Runs the real app on its own port against the test database, so tests can sign
// up, log in and load pages just like a browser would.
export default async function startServer() {
  const { parsed: env } = config({ path: ".env.test", override: false, processEnv: {} });
  const server: ChildProcess = spawn("npx", ["next", "dev", "--port", String(TEST_PORT)], {
    env: { ...process.env, ...env, NODE_ENV: "development" },
    stdio: "ignore",
    detached: true,
  });

  const deadline = Date.now() + 90_000;
  for (;;) {
    try {
      await fetch(`http://localhost:${TEST_PORT}/login`);
      break;
    } catch {
      if (Date.now() > deadline) throw new Error("The test server didn't start in time.");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return () => {
    if (server.pid) process.kill(-server.pid);
  };
}
