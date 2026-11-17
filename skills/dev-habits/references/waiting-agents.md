# Waiting and mechanical steps on Haiku agents

Use this only when no installed skill already hands these steps to cheap agents.

1. **Spawn the agents.** Use the Agent tool with `model: "haiku"` and a general-purpose agent, one agent per independent step. They run in the background; keep working on the real problem meanwhile. For one or two quick commands, run them yourself, since an agent costs more than it saves.
2. **Write a fixed brief** for each one, so the agent never has to make a judgment call. Give:
   - the exact commands
   - the working directory
   - what success looks like
   - what to report back: pass/fail, the key output lines, and URLs
   - the line "if anything unexpected happens, stop and report; don't improvise"
3. **Keep outward actions gated.** Get the user's approval before any brief that publishes, pushes, tags or posts, just as when doing it yourself.
4. **Watching CI.** A single command is cut off after 10 minutes, so never block on one `gh run watch`. Have the agent either:
   - run `gh run watch <id> --exit-status` in the background and wait for it to finish, or
   - re-check with short `gh run view <id> --json status,conclusion,jobs` calls.

   Then it reports each job's result and the failing log lines. Never poll from the main agent.
5. **Verify.** When the results arrive, check the key claims yourself (for example `gh run view`, or the published version) before telling the user it worked. Don't redo the agents' work.
