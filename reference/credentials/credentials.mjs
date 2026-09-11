// CREDENTIALS — how an agent holds a capability without holding the secret.
//
// Governed by protocol/12-CREDENTIALS.md.
//
// The entire contract in one line:
//
//     An agent gains a CAPABILITY. It never gains a SECRET.
//
// A credential reaches a process by being PLACED where it can read it — an
// environment variable populated from a password manager at launch. It is never
// SENT: not typed into a session, not written to the tree, not put on a command
// line where `ps` can read it.
//
// There is deliberately no code path in this file that writes a secret value to
// disk, returns it inside an Error, or includes it in anything formatted for a
// log, a surface, or a reply. That absence is the feature, exactly as the
// absence of `eval` is the feature in airlock.mjs.
//
// Zero dependencies. Node 18+.
// Copyright (c) 2026 Connor Woods. MIT.

// ---------------------------------------------------------------------------
// The registry of live secrets, kept only so redact() can scrub them back out.
// Values never leave this module except through use().
// ---------------------------------------------------------------------------

const live = new Set();

const REDACTED = "‹redacted›";

// A value shorter than this is not worth registering for redaction: scrubbing
// it would mangle ordinary prose far more often than it would hide a secret.
const MIN_REDACTABLE = 8;

// ---------------------------------------------------------------------------
// HANDLES — 12 §1.
//
// A handle is the NAME of a place a secret lives. It is safe to log, safe to
// commit, safe to put in a REQ row. It is not the secret.
// ---------------------------------------------------------------------------

/**
 * Declare a credential handle. Does not read the secret.
 * @param {string} envVar  name of the environment variable holding the value
 * @param {{scope?: string, expires?: string}} [meta]
 */
export function handle(envVar, meta = {}) {
  if (typeof envVar !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(envVar)) {
    throw new Error(
      `credential handle must be an ENV_VAR_NAME, got ${JSON.stringify(envVar)}`
    );
  }
  return Object.freeze({
    envVar,
    scope: meta.scope ?? "unspecified",
    expires: meta.expires ?? null,
    // Anything that stringifies this object gets the handle, never the value.
    toString() {
      return `<${envVar} — see password manager>`;
    },
    toJSON() {
      return { envVar, scope: this.scope, expires: this.expires };
    },
  });
}

/** True if the secret behind a handle is actually present in this process. */
export function available(h) {
  const v = process.env[h.envVar];
  return typeof v === "string" && v.length > 0;
}

// ---------------------------------------------------------------------------
// USE — 12 §6. Read at the point of use. Do not retain.
// ---------------------------------------------------------------------------

/**
 * Resolve a handle and hand the value to `fn`, and only to `fn`.
 *
 * The value is registered for redaction for the duration of the call, so
 * anything this code path later formats through redact() cannot carry it.
 *
 * @param {ReturnType<typeof handle>} h
 * @param {(secret: string) => any} fn
 */
export async function use(h, fn) {
  const value = process.env[h.envVar];
  if (typeof value !== "string" || value.length === 0) {
    // The error names the HANDLE and never the value — 12 §6.
    throw new Error(
      `credential ${h.envVar} is not present in this process. ` +
        `Inject it from the password manager at launch; do not paste it. ` +
        `See protocol/12-CREDENTIALS.md §4.`
    );
  }
  const registered = value.length >= MIN_REDACTABLE;
  if (registered) live.add(value);
  try {
    return await fn(value);
  } finally {
    // The value stays registered for redaction; it does not stay reachable
    // from anything this module hands back.
    if (registered && !available(h)) live.delete(value);
  }
}

// ---------------------------------------------------------------------------
// REDACT — 12 §6. Scrub before anything crosses into a file, a surface or a
// reply. This is the last line of defence, not the first.
// ---------------------------------------------------------------------------

/** Replace every live secret value in `text` with a marker. */
export function redact(text) {
  let out = String(text);
  for (const secret of live) {
    if (!secret) continue;
    out = out.split(secret).join(REDACTED);
  }
  return out;
}

/**
 * Throw if `text` still carries a live secret. Use before writing, surfacing,
 * or sending — so a leak fails loudly here rather than silently downstream.
 */
export function assertClean(text, where = "output") {
  const s = String(text);
  for (const secret of live) {
    if (secret && s.includes(secret)) {
      // Deliberately does not quote the offending text: an error message that
      // echoed the secret would be the leak it is trying to prevent.
      throw new Error(
        `refusing to emit ${where}: it contains a live credential value. ` +
          `Pass it through redact() first. See protocol/12-CREDENTIALS.md §6.`
      );
    }
  }
  return s;
}

// ---------------------------------------------------------------------------
// LAUNCH HELP — 12 §4. Printed for a human, contains no values.
// ---------------------------------------------------------------------------

/**
 * The command a human runs to inject a secret without it touching disk.
 * Returns a string of instructions; resolves nothing itself.
 */
export function injectionHint(h, { manager = "bw" } = {}) {
  const cmds = {
    bw: `${h.envVar}="$(bw get password '<item>')" node your-agent.mjs`,
    op: `${h.envVar}="$(op read 'op://vault/<item>/credential')" node your-agent.mjs`,
    pass: `${h.envVar}="$(pass show <item>)" node your-agent.mjs`,
  };
  const posix = cmds[manager] ?? cmds.bw;
  return [
    `# ${h.envVar} — scope: ${h.scope}${h.expires ? `, expires: ${h.expires}` : ""}`,
    `# The value never lands on disk and never enters a conversation.`,
    ``,
    `# POSIX:`,
    posix,
    ``,
    `# PowerShell:`,
    `$env:${h.envVar} = (bw get password '<item>'); node your-agent.mjs`,
    ``,
    `# Never: echo it, commit it, paste it into a session, or pass it as an`,
    `# argument — argv is visible to other processes. See 12 §4 and §6.`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// For the leak checker, so it can assert this module keeps its promise.
// ---------------------------------------------------------------------------

export const __testing = {
  register(v) {
    live.add(v);
  },
  clear() {
    live.clear();
  },
  size() {
    return live.size;
  },
  REDACTED,
};
