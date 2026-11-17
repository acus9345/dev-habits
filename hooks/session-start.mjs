// SessionStart hook: what it prints becomes context for the session.
// It replaces the CLAUDE.md line a manual install would need.
let source = "";
try {
  const input = JSON.parse(await new Promise((done) => {
    let text = "";
    // Don't wait on a stdin that never closes: give up after 2 seconds.
    const timer = setTimeout(() => done(text), 2000);
    process.stdin.on("data", (chunk) => (text += chunk));
    process.stdin.on("end", () => { clearTimeout(timer); done(text); });
  }));
  source = input.source ?? "";
} catch {
  // No input or not JSON: fall back to the plain reminder.
} finally {
  process.stdin.destroy(); // an open stdin would keep the process alive
}

const lines = [
  "Follow the dev-habits skill on every coding task without being asked: the quality gate after finished changes, researcher subagents for hard problems, the stuck breaker, and handoff notes on long tasks or tasks that will commit.",
];
if (source === "compact") {
  lines.push("The context was just compacted: if a handoff.md exists in the scratchpad directory (or .claude/handoff.md in the project), read it before doing anything else.");
}
console.log(lines.join("\n"));
