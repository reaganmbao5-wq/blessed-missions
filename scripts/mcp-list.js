const { spawn } = require('child_process');

const proc = spawn('npx', ['-y', '@21st-dev/magic@latest'], {
  env: { ...process.env, TWENTY_FIRST_API_KEY: "an_sk_36d93685bccaddd3d424a28043e3111c40043610efb58283d5f36a4068b33725" },
  shell: true,
  stdio: ['pipe', 'pipe', 'inherit']
});

proc.stdout.on('data', (data) => {
  const messages = data.toString().trim().split('\n');
  for (const msg of messages) {
    if (!msg) continue;
    try {
      const parsed = JSON.parse(msg);
      if (parsed.method === 'window/logMessage') {
        console.log('[MCP LOG]', parsed.params.message);
      } else {
        console.log('[MCP RESPONSE]', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('[RAW OUT]', msg);
    }
  }
});

// Send initialization request
proc.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "antigravity", version: "1.0.0" }
  }
}) + "\n");

// Wait 2 seconds, then send tools/list
setTimeout(() => {
  proc.stdin.write(JSON.stringify({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {}
  }) + "\n");
}, 2000);

// Wait another 2 seconds, then kill
setTimeout(() => {
  proc.kill();
}, 4000);
