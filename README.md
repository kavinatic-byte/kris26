# 🎮 Mini Games

A collection of browser mini-games built with Cloudflare Workers.  
Play at: *your-workers-dev-url*

## Games

| Game | Description |
|------|-------------|
| 🔢 **Sorting Challenge** | Hidden numbers need sorting! Use compare and swap operations to arrange them in order. |
| 🐧 **Linux Terminal** | Explore a simulated Linux filesystem. Use real commands to find a hidden flag! |

## Sorting Challenge — How to Play

1. Choose the number of elements (2–20)
2. Each position hides a random number — you only see `?`
3. Select two positions and use:
   - **Compare** — reveals which position has the larger value
   - **Swap** — exchanges the values at the two positions
4. When you think it's sorted, hit **Submit**
5. Wrong? Numbers reshuffle. Right? 🏆

## Linux Terminal — How to Play

1. You're dropped into a simulated Linux shell at `/home`
2. Use `ls` to see what's around, `cd` to navigate, `cat`/`head`/`tail`/`grep` to read files
3. Follow the instruction files to find the hidden flag pieces
4. Submit the flag in the side panel — checked server-side, no cheating

## Tech Stack

- **Frontend** — vanilla HTML, CSS, JavaScript (served as static assets)
- **Backend** — Cloudflare Workers (TypeScript)
- **Runtime** — [workerd](https://github.com/cloudflare/workerd) (local dev via Wrangler)

## Project Structure

```
public/
  index.html              # Menu page
  sorting.html            # Sorting game page
  linux.html              # Linux terminal game page
  css/
    style.css             # Shared styles
    sorting.css           # Sorting game styles
    linux.css             # Linux terminal styles
  js/
    sorting.js            # Sorting game client logic
    linux.js              # Linux terminal simulator
src/
  index.ts                # Worker — API endpoints
test/
  index.spec.ts           # Vitest tests (14)
wrangler.jsonc            # Wrangler config
```

## API

All game state lives in the Worker. Secrets never reach the client.

### Sorting

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/sorting/new` | `{ n }` | `{ gameId, n }` |
| POST | `/api/sorting/compare` | `{ gameId, posA, posB }` | `{ larger }` |
| POST | `/api/sorting/swap` | `{ gameId, posA, posB }` | `{}` |
| POST | `/api/sorting/submit` | `{ gameId }` | `{ correct }` |

### Linux

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/linux/check-flag` | `{ flag }` | `{ correct }` |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A Cloudflare account (for deployment)

### Install

```bash
npm install
```

### Local Development

```bash
npx wrangler dev
```

Opens at `http://localhost:8787`.

### Run Tests

```bash
npm test
```

### Deploy

```bash
npx wrangler deploy
```

## License

MIT
