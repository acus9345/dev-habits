# dev-habits

A [Claude Code](https://claude.com/claude-code) skill that gives the agent good working habits on coding tasks, without being asked.

## What it does

- **Quality gate after big changes.** A big change is 200+ changed lines or 5+ files.
  - The gate runs tests and lint, then `/simplify`, then `/code-review high`.
  - `/security-review` is added when the change touches risky code: secrets, auth, network, installers, shell commands, file deletion, untrusted input, or CI.
  - After fixing findings it retests and checks the fixes. A second review runs only if the fixes are big.
  - Small changes still get tests and lint. Small risky changes also get the reviews.
- **Researcher subagents.** When a hard problem comes up while other work is still left, it sends 1–3 subagents to research it in the background, each from a different angle.
- **Stuck breaker.** After two failed fixes for the same failure, it stops guessing, writes down what's been ruled out, and researches the root cause.
- **Cheap agents for waiting.** CI watching, publishing and install checks go to Haiku agents, unless a skill for that is already installed.
- **Handoff notes.** On long tasks it keeps a short notes file (goal, done, next, decisions) so work survives context compaction.

It works in git repos, repos with no commits yet, and folders without git.

## Install

Copy the `dev-habits` folder into your Claude Code skills folder:

```bash
git clone https://github.com/acus9345/dev-habits
cp -r dev-habits/dev-habits ~/.claude/skills/
```

Claude Code loads skills when a session starts, so start a new session after copying.

### Making it trigger reliably

Skills load when their description matches the task. To make sure this one applies to every coding task, add a line like this to `~/.claude/CLAUDE.md`:

```markdown
- Follow the dev-habits skill on every coding task without being asked. After a context compaction, read `handoff.md` in the scratchpad (or `.claude/handoff.md`) first if it exists.
```

## Notes

- Commits, pushes and publishing still need your approval. The skill never does them on its own.
- It never escalates to `/code-review max` or `ultra`. Those stay your call.
