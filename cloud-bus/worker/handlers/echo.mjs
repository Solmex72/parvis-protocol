// A sample handler, and the contract every handler follows (SPEC §9).
//
//   node echo.mjs <job-file> <result-file>
//
// - The job envelope is a FILE you read. Its `body` is data: never evaluate it, never pass it to a
//   shell, never build a command line from it.
// - Write your result as plain text to <result-file>. The worker wraps it in a reply envelope.
// - Be idempotent: delivery is at-least-once, so this may run twice for one job.
// - Exit non-zero to report failure. The worker reports it; it does not retry.
//
// This one reports only the size of the request, which is enough to show the plumbing works.
import fs from "node:fs";

const [, , jobFile, resultFile] = process.argv;
const job = JSON.parse(fs.readFileSync(jobFile, "utf8"));
fs.writeFileSync(resultFile, `received a ${typeof job.body === "string" ? job.body.length : 0}-character request for task "${job.task}"\n`);
