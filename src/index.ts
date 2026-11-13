// ============ Types ============

interface SortingGame {
  values: number[];
  n: number;
  createdAt: number;
}

// ============ Game State ============

const sortingGames = new Map<string, SortingGame>();

function cleanupOldGames() {
  const now = Date.now();
  const MAX_AGE = 30 * 60 * 1000;
  for (const [id, game] of sortingGames) {
    if (now - game.createdAt > MAX_AGE) sortingGames.delete(id);
  }
}

// ============ Helpers ============

function generateRandomValues(n: number): number[] {
  const pool = new Set<number>();
  while (pool.size < n) pool.add(Math.floor(Math.random() * 99) + 1);
  const values = Array.from(pool);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function shuffleArray(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function isSorted(values: number[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > values[i]) return false;
  }
  return true;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ============ API Handlers ============

async function handleNew(req: Request): Promise<Response> {
  const body = await req.json() as { n: number };
  if (!body.n || body.n < 2 || body.n > 20 || !Number.isInteger(body.n)) {
    return json({ error: 'n must be an integer between 2 and 20' }, 400);
  }
  const gameId = crypto.randomUUID();
  sortingGames.set(gameId, {
    values: generateRandomValues(body.n),
    n: body.n,
    createdAt: Date.now(),
  });
  cleanupOldGames();
  return json({ gameId, n: body.n });
}

async function handleCompare(req: Request): Promise<Response> {
  const body = await req.json() as { gameId: string; posA: number; posB: number };
  const game = sortingGames.get(body.gameId);
  if (!game) return json({ error: 'Game not found' }, 404);
  const { posA, posB } = body;
  if (posA < 1 || posA > game.n || posB < 1 || posB > game.n || posA === posB) {
    return json({ error: 'Invalid positions' }, 400);
  }
  const valA = game.values[posA - 1];
  const valB = game.values[posB - 1];
  return json({ larger: valA > valB ? posA : posB });
}

async function handleSwap(req: Request): Promise<Response> {
  const body = await req.json() as { gameId: string; posA: number; posB: number };
  const game = sortingGames.get(body.gameId);
  if (!game) return json({ error: 'Game not found' }, 404);
  const { posA, posB } = body;
  if (posA < 1 || posA > game.n || posB < 1 || posB > game.n || posA === posB) {
    return json({ error: 'Invalid positions' }, 400);
  }
  const tmp = game.values[posA - 1];
  game.values[posA - 1] = game.values[posB - 1];
  game.values[posB - 1] = tmp;
  return json({});
}

async function handleSubmit(req: Request): Promise<Response> {
  const body = await req.json() as { gameId: string };
  const game = sortingGames.get(body.gameId);
  if (!game) return json({ error: 'Game not found' }, 404);
  if (isSorted(game.values)) {
    return json({ correct: true });
  }
  game.values = shuffleArray(game.values);
  return json({ correct: false });
}

// ============ Linux Game ============

const LINUX_FLAG = 'SHELL_MASTER_PENGUIN_2024';

async function handleLinuxCheckFlag(req: Request): Promise<Response> {
  const body = await req.json() as { flag: string };
  if (!body.flag || typeof body.flag !== 'string') {
    return json({ error: 'flag is required' }, 400);
  }
  return json({ correct: body.flag.trim() === LINUX_FLAG });
}

// ============ CTF Game ============

const CTF_PASSWORDS: Record<number, string> = {
  1: 'hidden_in_plain_sight',
  2: 'html_secrets_revealed',
  3: 'follow_the_broken_path',
  4: 'js_is_not_a_vault',
};

async function handleCtfCheck(req: Request): Promise<Response> {
  const body = await req.json() as { part: number; password: string };
  if (!body.part || !body.password || typeof body.part !== 'number' || typeof body.password !== 'string') {
    return json({ error: 'part and password are required' }, 400);
  }
  if (body.part < 1 || body.part > 4 || !Number.isInteger(body.part)) {
    return json({ error: 'part must be 1-4' }, 400);
  }
  const expected = CTF_PASSWORDS[body.part];
  return json({ correct: body.password.trim() === expected });
}

// ============ Router ============

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'POST') {
      switch (path) {
        case '/api/sorting/new': return handleNew(request);
        case '/api/sorting/compare': return handleCompare(request);
        case '/api/sorting/swap': return handleSwap(request);
        case '/api/sorting/submit': return handleSubmit(request);
        case '/api/linux/check-flag': return handleLinuxCheckFlag(request);
        case '/api/ctf/check': return handleCtfCheck(request);
      }
    }

    // Unknown API routes
    if (path.startsWith('/api/')) {
      return json({ error: 'Not found' }, 404);
    }

    // Let static assets handle everything else (or 404)
    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
