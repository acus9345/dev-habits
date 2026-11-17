# dev-habits

A [Claude Code](https://claude.com/claude-code) plugin that gives the agent good working habits on coding tasks, without being asked.

## What it does

- **Quality gate after big changes.** A big change is 200+ changed lines or 5+ files, not counting lockfiles.
  - The gate runs tests and lint, then `/simplify`, then `/code-review high`.
  - It adds `/security-review` when the change touches risky code: secrets, auth, network, installers, shell commands, file deletion, untrusted input, CI, or dependency changes.
  - After fixing findings it retests and checks the fixes. A second review runs only if the fixes are big.
  - Small changes still get tests and lint. Small risky changes also get the reviews.
- **Researcher subagents.** When a hard problem comes up while other work is still left, it sends 1–3 subagents to research it in the background, each from a different angle.
- **Stuck breaker.** After two failed fixes for the same failure, it stops guessing, writes down what's been ruled out, and researches the root cause.
- **Cheap agents for waiting.** CI watching, publishing and install checks go to Haiku agents, unless a skill for that is already installed.
- **Handoff notes.** On long tasks, or tasks that will commit, it keeps a short notes file (goal, starting commit, done, next, decisions) that survives context compaction. Short tasks don't create one.

If a review skill, the Agent tool or `gh` isn't available, it does that part by hand and says so. It works in git repos, repos with no commits yet, and folders without git.

## Install

As a plugin (recommended):

```
/plugin install dev-habits --marketplace acus9345/dev-habits
```

On older Claude Code versions, add the marketplace first:

```
/plugin marketplace add acus9345/dev-habits
/plugin install dev-habits@dev-habits
```

If you installed it manually before, remove `~/.claude/skills/dev-habits` and the dev-habits line from `~/.claude/CLAUDE.md` first. Otherwise two copies load.

The plugin includes a small session-start hook. It reminds the agent to follow the skill on every coding task, and to read its handoff notes after a compaction. The hook needs `node` on your PATH. Without it, the skill still works, but it may trigger less reliably.

### Manual install

Copy the skill folder into your skills folder:

```bash
git clone https://github.com/acus9345/dev-habits
cp -r dev-habits/skills/dev-habits ~/.claude/skills/
```

Then add this line to `~/.claude/CLAUDE.md`. It does the same job as the plugin's hook:

```markdown
- Follow the dev-habits skill on every coding task without being asked. After a context compaction, read `handoff.md` in the scratchpad (or `.claude/handoff.md`) first if it exists.
```

## Layout

- `skills/dev-habits/SKILL.md`: the habits themselves
- `skills/dev-habits/references/`: details loaded only when needed (git edge cases, Haiku agent briefs)
- `hooks/`: the session-start reminder
- `.claude-plugin/`: the plugin and marketplace manifests

## Notes

- Commits, pushes and publishing still need your approval. The plugin never does them on its own.
- It never escalates to `/code-review max` or `ultra`. Those stay your call.

## License

MIT
