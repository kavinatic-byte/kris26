import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Sorting API", () => {
  it("creates a new game with valid n", async () => {
    const response = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 5 }),
      })
    );
    expect(response.status).toBe(200);
    const data = await response.json() as { gameId: string; n: number };
    expect(data.gameId).toBeTruthy();
    expect(data.n).toBe(5);
  });

  it("rejects n < 2", async () => {
    const response = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 1 }),
      })
    );
    expect(response.status).toBe(400);
    const data = await response.json() as { error: string };
    expect(data.error).toContain("between 2 and 20");
  });

  it("rejects n > 20", async () => {
    const response = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 21 }),
      })
    );
    expect(response.status).toBe(400);
  });

  it("rejects non-integer n", async () => {
    const response = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 5.5 }),
      })
    );
    expect(response.status).toBe(400);
  });

  it("compare returns which position is larger", async () => {
    const newResp = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 3 }),
      })
    );
    const { gameId } = await newResp.json() as { gameId: string };

    const resp = await SELF.fetch(
      new Request("http://example.com/api/sorting/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, posA: 1, posB: 2 }),
      })
    );
    expect(resp.status).toBe(200);
    const data = await resp.json() as { larger: number };
    expect([1, 2]).toContain(data.larger);
  });

  it("swap succeeds", async () => {
    const newResp = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 3 }),
      })
    );
    const { gameId } = await newResp.json() as { gameId: string };

    const resp = await SELF.fetch(
      new Request("http://example.com/api/sorting/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, posA: 1, posB: 3 }),
      })
    );
    expect(resp.status).toBe(200);
  });

  it("submit returns correct or false", async () => {
    const newResp = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 2 }),
      })
    );
    const { gameId } = await newResp.json() as { gameId: string };

    const resp = await SELF.fetch(
      new Request("http://example.com/api/sorting/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
      })
    );
    expect(resp.status).toBe(200);
    const data = await resp.json() as { correct: boolean };
    expect(typeof data.correct).toBe("boolean");
  });

  it("returns 404 for unknown game", async () => {
    const resp = await SELF.fetch(
      new Request("http://example.com/api/sorting/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: "nonexistent", posA: 1, posB: 2 }),
      })
    );
    expect(resp.status).toBe(404);
  });

  it("returns 400 for invalid positions", async () => {
    const newResp = await SELF.fetch(
      new Request("http://example.com/api/sorting/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: 3 }),
      })
    );
    const { gameId } = await newResp.json() as { gameId: string };

    const resp = await SELF.fetch(
      new Request("http://example.com/api/sorting/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, posA: 1, posB: 99 }),
      })
    );
    expect(resp.status).toBe(400);
  });

  it("returns 404 for unknown API path", async () => {
    const resp = await SELF.fetch(
      new Request("http://example.com/api/unknown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    );
    expect(resp.status).toBe(404);
  });

  describe("Linux flag check", () => {
    it("accepts the correct flag", async () => {
      const resp = await SELF.fetch(
        new Request("http://example.com/api/linux/check-flag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flag: "SHELL_MASTER_PENGUIN_2024" }),
        })
      );
      expect(resp.status).toBe(200);
      const data = await resp.json() as { correct: boolean };
      expect(data.correct).toBe(true);
    });

    it("rejects an incorrect flag", async () => {
      const resp = await SELF.fetch(
        new Request("http://example.com/api/linux/check-flag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flag: "WRONG" }),
        })
      );
      expect(resp.status).toBe(200);
      const data = await resp.json() as { correct: boolean };
      expect(data.correct).toBe(false);
    });

    it("rejects empty flag", async () => {
      const resp = await SELF.fetch(
        new Request("http://example.com/api/linux/check-flag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
      );
      expect(resp.status).toBe(400);
    });
  });

  describe("CTF password check", () => {
    it("accepts correct password for part 1", async () => {
      const resp = await SELF.fetch(
        new Request("http://example.com/api/ctf/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ part: 1, password: "hidden_in_plain_sight" }),
        })
      );
      expect(resp.status).toBe(200);
      const data = await resp.json() as { correct: boolean };
      expect(data.correct).toBe(true);
    });

    it("rejects wrong password", async () => {
      const resp = await SELF.fetch(
        new Request("http://example.com/api/ctf/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ part: 1, password: "wrong" }),
        })
      );
      const data = await resp.json() as { correct: boolean };
      expect(data.correct).toBe(false);
    });

    it("rejects invalid part number", async () => {
      const resp = await SELF.fetch(
        new Request("http://example.com/api/ctf/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ part: 5, password: "x" }),
        })
      );
      expect(resp.status).toBe(400);
    });

    it("accepts all 4 correct passwords", async () => {
      const passwords: Record<string, string> = {
        "1": "hidden_in_plain_sight",
        "2": "html_secrets_revealed",
        "3": "follow_the_broken_path",
        "4": "js_is_not_a_vault",
      };
      for (const [part, pw] of Object.entries(passwords)) {
        const resp = await SELF.fetch(
          new Request("http://example.com/api/ctf/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ part: Number(part), password: pw }),
          })
        );
        const data = await resp.json() as { correct: boolean };
        expect(data.correct).toBe(true);
      }
    });
  });

  it("serves static index.html at /", async () => {
    const resp = await SELF.fetch(new Request("http://example.com/"));
    expect(resp.status).toBe(200);
    const text = await resp.text();
    expect(text).toContain("<title>Mini Games</title>");
  });
});
