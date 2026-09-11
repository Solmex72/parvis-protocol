// PARVIS CONFIG — file, environment, and flags, resolved in one place.
//
// Precedence, highest wins:
//
//     CLI flag  >  environment  >  parvis.config.json  >  built-in default
//
// The file lives at <root>/parvis.config.json by default, or wherever
// PARVIS_CONFIG points. It is plain JSON with no schema magic: every key is
// optional, unknown keys are reported rather than ignored, and a malformed
// file is an error you are told about — never silently replaced by defaults.
//
// Copyright (c) 2026 Connor Woods. MIT.

import fs from "node:fs";
import path from "node:path";

export const DEFAULTS = Object.freeze({
  root: ".",
  host: "127.0.0.1",
  port: 7843,
  allowNonLoopback: false,
  openBrowser: true,
  editableDirs: ["_os", "_os/protocol"],
  lockedFiles: ["01-ESTOP.md", "00-PRECEDENCE.md", "COVENANT.md", "ESTOP.md"],
  operator: null,
  refreshMs: 5000,
});

export const KEYS = Object.keys(DEFAULTS);

const LOOPBACK = new Set(["127.0.0.1", "::1", "localhost"]);
export const isLoopback = (h) => LOOPBACK.has(String(h));

// ---------------------------------------------------------------------------

function readFileConfig(configPath) {
  let raw;
  try { raw = fs.readFileSync(configPath, "utf8"); }
  catch { return { found: false, values: {}, warnings: [] }; }

  let parsed;
  try { parsed = JSON.parse(raw); }
  catch (e) {
    // A broken config is loud. Silently falling back to defaults would change
    // the bind address and the locked-file list without telling anyone.
    const err = new Error(`${configPath} is not valid JSON: ${e.message}`);
    err.code = "PARVIS_BAD_CONFIG";
    throw err;
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    const err = new Error(`${configPath} must contain a JSON object`);
    err.code = "PARVIS_BAD_CONFIG";
    throw err;
  }

  const warnings = [];
  const values = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (k.startsWith("//") || k === "$schema") continue;   // comment convention
    if (!KEYS.includes(k)) { warnings.push(`unknown key "${k}" ignored`); continue; }
    values[k] = v;
  }
  return { found: true, values, warnings };
}

function envConfig() {
  const v = {};
  if (process.env.PARVIS_ROOT) v.root = process.env.PARVIS_ROOT;
  if (process.env.PARVIS_HOST) v.host = process.env.PARVIS_HOST;
  if (process.env.PARVIS_PORT) v.port = Number(process.env.PARVIS_PORT);
  if (process.env.PARVIS_OPEN) v.openBrowser = process.env.PARVIS_OPEN !== "0";
  if (process.env.PARVIS_OPERATOR) v.operator = process.env.PARVIS_OPERATOR;
  if (process.env.PARVIS_ALLOW_NON_LOOPBACK === "1") v.allowNonLoopback = true;
  return v;
}

function validate(cfg, warnings) {
  const errors = [];

  if (!Number.isInteger(cfg.port) || cfg.port < 1 || cfg.port > 65535) {
    errors.push(`port must be an integer 1–65535, got ${JSON.stringify(cfg.port)}`);
  }
  if (typeof cfg.host !== "string" || !cfg.host) {
    errors.push("host must be a non-empty string");
  }
  if (!Array.isArray(cfg.editableDirs) || cfg.editableDirs.some((d) => typeof d !== "string")) {
    errors.push("editableDirs must be an array of strings");
  }
  if (!Array.isArray(cfg.lockedFiles) || cfg.lockedFiles.some((d) => typeof d !== "string")) {
    errors.push("lockedFiles must be an array of strings");
  }

  // A relative or parent-escaping editable dir would defeat the allowlist.
  for (const d of Array.isArray(cfg.editableDirs) ? cfg.editableDirs : []) {
    if (path.isAbsolute(d) || d.split(/[\\/]/).includes("..")) {
      errors.push(`editableDirs entry "${d}" must be a relative path inside the root`);
    }
  }

  // THE BIND DECISION. protocol/07 §3 requires loopback. Binding anywhere else
  // publishes the console — and with it, edit access to your governing
  // documents — to every machine that can route to this one. It is allowed,
  // because an operator may have a real reason, but never by accident: it
  // takes a second, explicit key, and it is announced everywhere.
  if (!isLoopback(cfg.host) && !cfg.allowNonLoopback) {
    errors.push(
      `host "${cfg.host}" is not loopback. Binding a public interface exposes the ` +
      `console to your network. If you mean it, also set "allowNonLoopback": true ` +
      `(or PARVIS_ALLOW_NON_LOOPBACK=1) and read protocol/07-INTERFACE.md §3 first.`
    );
  }
  if (!isLoopback(cfg.host) && cfg.allowNonLoopback) {
    warnings.push(
      `EXPOSED: bound to ${cfg.host}, not loopback. Anyone who can reach this ` +
      `host and port can read your tree and edit unlocked documents. There is ` +
      `no user authentication — the session token only proves same-page origin.`
    );
  }

  if (errors.length) {
    const err = new Error("invalid configuration:\n  - " + errors.join("\n  - "));
    err.code = "PARVIS_BAD_CONFIG";
    throw err;
  }
}

/**
 * Resolve the effective configuration.
 * @param {object} flags values parsed from the command line (highest priority)
 * @param {string} [cwd] directory to resolve a relative root and config against
 */
export function load(flags = {}, cwd = process.cwd()) {
  const configPath = path.resolve(
    process.env.PARVIS_CONFIG || path.join(flags.root || process.env.PARVIS_ROOT || cwd, "parvis.config.json")
  );

  const file = readFileConfig(configPath);
  const warnings = [...file.warnings];

  const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

  const cfg = {
    ...DEFAULTS,
    ...clean(file.values),
    ...clean(envConfig()),
    ...clean(flags),
  };

  cfg.root = path.resolve(cwd, cfg.root);
  cfg.port = Number(cfg.port);

  validate(cfg, warnings);

  return {
    ...cfg,
    configPath,
    configFound: file.found,
    warnings,
    // Where each value actually came from — the settings panel shows this so
    // you are never guessing why a value is what it is.
    sources: Object.fromEntries(KEYS.map((k) => [
      k,
      k in clean(flags) ? "flag"
        : k in clean(envConfig()) ? "env"
        : k in clean(file.values) ? "file"
        : "default",
    ])),
  };
}

/**
 * Write a partial config back to the file, preserving keys already there.
 * Returns the merged object that was written.
 */
export function save(configPath, patch) {
  let existing = {};
  try { existing = JSON.parse(fs.readFileSync(configPath, "utf8")); } catch { /* new file */ }
  if (existing === null || typeof existing !== "object" || Array.isArray(existing)) existing = {};

  for (const [k, v] of Object.entries(patch)) {
    if (!KEYS.includes(k)) continue;          // never persist an unknown key
    if (v === null || v === undefined) delete existing[k];
    else existing[k] = v;
  }

  // Validate the result before it touches disk, so a settings panel cannot
  // write a file that stops the sidecar from starting next time.
  validate({ ...DEFAULTS, ...existing, root: path.dirname(configPath), port: Number(existing.port ?? DEFAULTS.port) }, []);

  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(existing, null, 2) + "\n", "utf8");
  return existing;
}
