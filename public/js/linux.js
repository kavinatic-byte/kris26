// ==================== Linux Terminal Simulator ====================

// ---- File Content Generators ----

function generateBootLog() {
  const entries = [
    'Initializing kernel modules...',
    'Loading device drivers: [OK]',
    'Mounting filesystems: [OK]',
    'Network interface eth0: UP (192.168.1.42)',
    'Firewall rules loaded: 128 rules active',
    'SSH daemon started on port 22',
    'Cron scheduler initialized with 3 jobs',
    'User authentication service: ONLINE',
    'Disk check complete: 0 errors found',
    'Swap space activated: 2.0 GB',
    'Memory test passed: 4096 MB available',
    'CPU governor: performance',
    'Temperature sensors: 42 C (nominal)',
    'Fan speed: 2100 RPM',
    'Power management: ACPI mode',
    'ACPI tables loaded: 14 tables',
    'PCI bus scan: 7 devices found',
    'USB controller: 4 ports active',
    'Audio driver: HDA Intel (no output)',
    'Graphics: framebuffer console 1920x1080',
    'System entropy pool: 3584 bits',
    'Random seed: 0xD34DB33F',
    'SELinux status: enforcing',
    'Audit daemon: running (pid 892)',
    'Systemd-journald: 1567 entries since boot',
    'cgroups v2 hierarchy mounted',
    'Namespaces enabled: 7 types',
    'Seccomp filters: 42 rules loaded',
    'AppArmor profiles: 18 loaded, 3 complain',
    'Kernel version: 6.1.0-lts-x86_64',
    'GCC version: 12.2.0',
    'glibc version: 2.36',
    'OpenSSL version: 3.0.7',
    'System uptime check passed',
    'Integrity verification: 943/943 files OK',
    'Boot sequence complete in 2.847s',
  ];
  const lines = [
    '[FLAG_1] SHELL_',
    '=== System Boot Log - Session 0x4F2A ===',
    'Timestamp: 2024-01-15T08:23:41.042Z',
    '',
  ];
  for (let i = 0; i < 160; i++) {
    const ts = new Date(2024, 0, 15, 8, 23, 41).getTime() + i * 1000;
    const t = new Date(ts).toISOString().replace('T', ' ').slice(0, 19);
    const entry = entries[i % entries.length];
    const pid = 100 + (i % 900);
    lines.push('[' + t + '] [' + pid + '] ' + entry);
  }
  lines.push('=== End Boot Log ===');
  return lines.join('\n');
}

function generateNetworkLog() {
  const ips = ['10.0.0.15', '10.0.0.22', '192.168.1.100', '10.0.0.7', '10.0.0.99',
    '203.0.113.5', '198.51.100.42', '172.16.0.88', '10.0.0.254', '192.168.1.200'];
  const ports = [443, 22, 8080, 3000, 9090, 80, 3306, 6379, 5432, 8443];
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'];
  const paths = ['/api/v1/status', '/api/v1/users', '/api/v1/data', '/health',
    '/static/style.css', '/static/app.js', '/api/v1/config', '/metrics',
    '/api/v1/logs', '/api/v1/auth'];
  const statuses = [200, 201, 204, 304, 400, 401, 403, 404, 500, 502];

  const lines = [];
  for (let i = 0; i < 170; i++) {
    const ts = new Date(2024, 0, 15, 8, 23, 41).getTime() + i * 3000;
    const t = new Date(ts).toISOString().replace('T', ' ').slice(0, 19);
    const ip = ips[i % ips.length];
    const port = ports[i % ports.length];
    const method = methods[i % methods.length];
    const path = paths[i % paths.length];
    const status = statuses[i % statuses.length];
    const ms = 1 + (i * 7) % 200;
    lines.push('[' + t + '] ' + ip + ':' + port + ' ' + method + ' ' + path + ' -> ' + status + ' (' + ms + 'ms)');
  }
  lines.push('MASTER_PENGUIN_');
  return lines.join('\n');
}

function generateDebugOut() {
  const modules = ['auth', 'database', 'cache', 'scheduler', 'websocket', 'api',
    'logger', 'metrics', 'tracing', 'ratelimit', 'validator', 'serializer',
    'encryption', 'compression', 'queue', 'mailer', 'storage', 'search',
    'notifications', 'backup'];
  const statuses = ['OK', 'LOADED', 'PENDING', 'STARTING', 'RUNNING', 'READY',
    'CONNECTED', 'INITIALIZED', 'ACTIVE', 'ONLINE'];

  const lines = [
    'Debug output v3.2.1 - Initialization trace',
    'Timestamp: 2024-01-15T08:23:41.042Z',
    'Platform: linux-x64, Node: v20.11.0',
    '-------------------------------------------------',
    '',
  ];

  for (let i = 0; i < 75; i++) {
    const mod = modules[i % modules.length];
    const stat = statuses[i % statuses.length];
    lines.push('[init] Module \'' + mod + '\': ' + stat + ' (' + (10 + i * 3) + 'ms)');
    if (i % 9 === 3) lines.push('[init]   -> dependency resolved: ' + modules[(i + 3) % modules.length]);
    if (i % 11 === 7) lines.push('[init]   -> config loaded: 5 keys');
  }

  lines.push('');
  lines.push('SECRET: 2024');
  lines.push('');

  for (let i = 0; i < 80; i++) {
    const mod = modules[(i + 10) % modules.length];
    const stat = statuses[(i + 5) % statuses.length];
    lines.push('[runtime] Module \'' + mod + '\': state=' + stat + ' mem=' + (100 + i * 2) + 'KB');
    if (i % 13 === 5) lines.push('[runtime]   -> health check passed');
    if (i % 7 === 2) lines.push('[runtime]   -> event processed: type=' + mod);
  }

  lines.push('');
  lines.push('All modules initialized in 1.847s');
  lines.push('Active workers: 4');
  lines.push('Memory usage: 128MB RSS');
  lines.push('Server ready. Accepting connections.');
  return lines.join('\n');
}

// ---- Virtual Filesystem ----

const FAKE_FS = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        'instruction.txt': {
          type: 'file',
          content: `Welcome to the Linux filesystem!

Navigate into the folder called 'directory'.
Inside you'll find more instructions.

Use the command list on the right if you need help.`,
        },
        directory: {
          type: 'dir',
          children: {
            'instruction_2.txt': {
              type: 'file',
              content: `You found the right folder.

A flag is split into 3 pieces. Each piece is in a different file.

  • logs.txt    — first piece is at the very top of this file
  • network.log — second piece is at the very bottom of this file
  • debug.out   — third piece is somewhere in the middle,
                  marked with the label "SECRET:"

Read these files carefully and combine the 3 pieces in order
to reveal the flag. Submit it in the side panel.`,
            },
            'logs.txt':    { type: 'file', content: generateBootLog() },
            'network.log': { type: 'file', content: generateNetworkLog() },
            'debug.out':   { type: 'file', content: generateDebugOut() },
          },
        },
      },
    },
  },
};

// ---- State ----

let cwd = '/home';
let cmdHistory = [];
let historyIdx = -1;

// ---- Helpers ----

function resolvePath(target) {
  const parts = target.split('/').filter(Boolean);
  const stack = target.startsWith('/') ? [] : cwd.split('/').filter(Boolean);
  for (const p of parts) {
    if (p === '..') {
      if (stack.length > 0) stack.pop();
    } else if (p !== '.') {
      stack.push(p);
    }
  }
  return stack;
}

function pathToString(parts) {
  if (parts.length === 0) return '/';
  return '/' + parts.join('/');
}

function getNode(parts) {
  let node = FAKE_FS;
  for (const part of parts) {
    if (!node || node.type !== 'dir' || !node.children) return null;
    node = node.children[part];
    if (!node) return null;
  }
  return node;
}

function promptStr() {
  const display = cwd === '/' ? '/' : cwd.replace(/^\/home/, '~');
  return display + '$ ';
}

// ---- Terminal Buffer (max ~100 visible lines) ----

const MAX_BUFFER_LINES = 100;

function trimBuffer() {
  // Count total lines across all children
  let total = 0;
  for (const child of $output.children) {
    total += child.textContent.split('\n').length;
  }

  // Remove entire children from the top until under limit
  while (total > MAX_BUFFER_LINES && $output.children.length > 1) {
    const first = $output.children[0];
    total -= first.textContent.split('\n').length;
    first.remove();
  }

  // If the last child still exceeds limit, truncate inside it
  while (total > MAX_BUFFER_LINES && $output.children.length === 1) {
    const last = $output.children[0];
    const spans = last.querySelectorAll('span');
    if (spans.length === 0) break;

    // Single span with too many lines: truncate its text
    if (spans.length === 1) {
      const lines = spans[0].textContent.split('\n').filter(l => l !== '');
      spans[0].textContent = lines.slice(-MAX_BUFFER_LINES).join('\n') + '\n';
      total = MAX_BUFFER_LINES;
      break;
    }

    // Remove the first span
    const firstSpan = spans[0];
    total -= firstSpan.textContent.split('\n').length;
    firstSpan.remove();
  }
}

// ---- Command Handlers ----

function cmdLs(args) {
  const target = args[0] || '.';
  const parts = resolvePath(target);
  const node = getNode(parts);
  if (!node) return [['error', 'ls: ' + target + ': No such file or directory']];
  if (node.type !== 'dir') return [['error', 'ls: ' + target + ': Not a directory']];
  const names = Object.keys(node.children).sort();
  if (names.length === 0) return [];
  const colored = names.map(name => {
    const child = node.children[name];
    return child.type === 'dir' ? ['info', name + '/'] : ['normal', name];
  });
  return colored;
}

function cmdCd(args) {
  if (args.length === 0) {
    cwd = '/home';
    return [];
  }
  const target = args[0];
  const parts = resolvePath(target);
  const node = getNode(parts);
  if (!node) return [['error', 'cd: ' + target + ': No such file or directory']];
  if (node.type !== 'dir') return [['error', 'cd: ' + target + ': Not a directory']];
  cwd = pathToString(parts);
  return [];
}

function cmdCat(args) {
  if (args.length === 0) return [['error', 'cat: missing file operand']];
  const results = [];
  for (const target of args) {
    const parts = resolvePath(target);
    const node = getNode(parts);
    if (!node) { results.push(['error', 'cat: ' + target + ': No such file or directory']); continue; }
    if (node.type !== 'file') { results.push(['error', 'cat: ' + target + ': Is a directory']); continue; }
    results.push(['normal', node.content]);
  }
  return results;
}

function cmdHead(args) {
  if (args.length === 0) return [['error', 'head: missing file operand']];
  const target = args[0];
  const parts = resolvePath(target);
  const node = getNode(parts);
  if (!node) return [['error', 'head: ' + target + ': No such file or directory']];
  if (node.type !== 'file') return [['error', 'head: ' + target + ': Is a directory']];
  const lines = node.content.split('\n');
  return [['normal', lines.slice(0, 10).join('\n')]];
}

function cmdTail(args) {
  if (args.length === 0) return [['error', 'tail: missing file operand']];
  const target = args[0];
  const parts = resolvePath(target);
  const node = getNode(parts);
  if (!node) return [['error', 'tail: ' + target + ': No such file or directory']];
  if (node.type !== 'file') return [['error', 'tail: ' + target + ': Is a directory']];
  const lines = node.content.split('\n');
  return [['normal', lines.slice(-10).join('\n')]];
}

function cmdGrep(args) {
  if (args.length < 2) return [['error', 'grep: missing pattern or file\nUsage: grep <pattern> <file>']];
  const pattern = args[0];
  const target = args[1];
  const parts = resolvePath(target);
  const node = getNode(parts);
  if (!node) return [['error', 'grep: ' + target + ': No such file or directory']];
  if (node.type !== 'file') return [['error', 'grep: ' + target + ': Is a directory']];
  const lines = node.content.split('\n');
  const matches = lines.filter(l => l.includes(pattern));
  if (matches.length === 0) return [['info', '(no matches)']];
  return matches.map(m => ['highlight', m]);
}

// ---- Command Router ----

const COMMANDS = {
  ls: cmdLs,
  cd: cmdCd,
  cat: cmdCat,
  head: cmdHead,
  tail: cmdTail,
  grep: cmdGrep,
};

function executeCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  const tokens = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inQuote) {
      if (ch === quoteChar) { inQuote = false; quoteChar = ''; }
      else { current += ch; }
    } else {
      if (ch === '"' || ch === "'") { inQuote = true; quoteChar = ch; }
      else if (ch === ' ') {
        if (current) { tokens.push(current); current = ''; }
      } else { current += ch; }
    }
  }
  if (current) tokens.push(current);
  if (tokens.length === 0) return [];

  const cmd = tokens[0];
  const args = tokens.slice(1);
  const handler = COMMANDS[cmd];
  if (!handler) return [['error', cmd + ': command not found']];
  return handler(args);
}

// ---- Terminal UI ----

const $output = document.getElementById('terminalOutput');
const $input = document.getElementById('terminalInput');
const $prompt = document.getElementById('promptDisplay');
const $flagInput = document.getElementById('flagInput');
const $flagSubmit = document.getElementById('flagSubmit');
const $flagMsg = document.getElementById('flagMsg');
const $winOverlay = document.getElementById('winOverlay');
const $playAgain = document.getElementById('playAgain');

function updatePrompt() {
  $prompt.textContent = promptStr();
}

function appendToOutput(segments) {
  const wrapper = document.createElement('div');
  for (const seg of segments) {
    if (Array.isArray(seg)) {
      const [cls, text] = seg;
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text + '\n';
      wrapper.appendChild(span);
    }
  }
  $output.appendChild(wrapper);
  trimBuffer();
  $output.scrollTop = $output.scrollHeight;
}

function appendCommand(cmd) {
  const cmdDiv = document.createElement('div');
  cmdDiv.className = 'cmd-line';
  cmdDiv.textContent = promptStr() + cmd;
  $output.appendChild(cmdDiv);
  trimBuffer();
}

function handleCommand(raw) {
  appendCommand(raw);
  const result = executeCommand(raw);
  appendToOutput(result);
  updatePrompt();
  $output.scrollTop = $output.scrollHeight;
}

// ---- Input Handling ----

$input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const cmd = $input.value;
    $input.value = '';
    if (cmd.trim()) {
      cmdHistory.push(cmd);
      historyIdx = cmdHistory.length;
    }
    handleCommand(cmd);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (cmdHistory.length > 0 && historyIdx > 0) {
      historyIdx--;
      $input.value = cmdHistory[historyIdx];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIdx < cmdHistory.length - 1) {
      historyIdx++;
      $input.value = cmdHistory[historyIdx];
    } else {
      historyIdx = cmdHistory.length;
      $input.value = '';
    }
  }
});

document.querySelector('.terminal-output').addEventListener('click', () => {
  $input.focus();
});

// ---- Flag Submission ----

$flagSubmit.addEventListener('click', async () => {
  const flag = $flagInput.value.trim();
  if (!flag) return;

  $flagSubmit.disabled = true;
  $flagSubmit.textContent = 'Checking...';

  const resp = await fetch('/api/linux/check-flag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flag }),
  });

  $flagSubmit.disabled = false;
  $flagSubmit.textContent = 'Submit';

  const data = await resp.json();
  if (data.correct) {
    $winOverlay.classList.add('active');
  } else {
    $flagMsg.textContent = 'Incorrect flag. Keep looking!';
    $flagMsg.style.color = '#f85149';
  }
});

$playAgain.addEventListener('click', () => {
  cwd = '/home';
  $output.innerHTML = '';
  $input.value = '';
  $flagInput.value = '';
  $flagMsg.textContent = '';
  $winOverlay.classList.remove('active');
  updatePrompt();
  $input.focus();
});

// ---- Init ----

appendToOutput([
  ['info', 'Linux Terminal Simulator'],
  ['info', 'Type commands to explore the filesystem.'],
  ['info', 'Commands: ls, cd, cat, head, tail, grep'],
  ['info', 'Start with: ls'],
  ['normal', ''],
]);

updatePrompt();
$input.focus();
