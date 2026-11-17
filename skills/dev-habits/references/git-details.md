# Git details for the quality gate

## Starting point (the base)

Record it before the first edit when the task will commit or run long. Write it to the **Base** line of `handoff.md`.

- **In a git repo** (`git rev-parse --git-dir` works): the base is `git rev-parse HEAD`. If the repo has no commits yet, use the empty tree `4b825dc642cb6eb9a060e54bf8d69288fbee4904`; it works anywhere a commit does in `git diff`.
- **Not a git repo** (`git rev-parse --git-dir` fails): note "no git", and keep a list of every file you create or edit.
- **You run `git init` during the task:** switch the base to the empty tree.

**No base recorded?** Try these in order, and say which one you used in the report:

1. The parent of the first commit you made in this session (check `git log`). If that commit is the repo's first, use the empty tree.
2. HEAD, if you made no commits in this session.
3. `git merge-base HEAD @{upstream}`, only if you can't tell which commits are yours.

## Measuring the size

- **In a git repo:** run `git diff --stat <base>`, which counts both commits and uncommitted edits. Then add the new files from `git ls-files --others --exclude-standard`.
- **Leave out of the count:** lockfiles (package-lock.json, Cargo.lock, yarn.lock, poetry.lock and the like), snapshots, and generated code. A dependency change still counts as risky, though; see step 4 in SKILL.md.
- **Not a git repo:** use your list of edited files and the lines you changed in them.

## Review targets

### Pushed commits

The review skills diff from `git merge-base HEAD @{upstream}`, not from your base, so commits from this task that were already pushed are left out.

- **If that merge-base differs from your base:** read `git diff <base> <merge-base>` yourself, with the same focus as the reviews, and say so in the report.
- **Teammates' commits on the upstream** aren't in that range, and aren't yours to review.

### Outside git

None of the review skills can see a diff here.

- **/simplify and /code-review:** each takes one path as its target. Pass the deepest folder that holds all the edited files, or the single file if only one changed (for example `high src/`).
  - If that folder would be the project root, call them once per edited file instead, or once per edited folder for 5+ files.
  - Cap it at 5 calls. Past that, check the rest yourself.
- **/security-review:** it only reads a git diff, so don't call it outside git. Instead, read each edited file against the risk list yourself, and say in the report that you did.

## Was a failing test already failing?

**In git:** run that test on the base.

1. Remove any leftover worktree with `git worktree remove --force <scratchpad>/base`.
2. Add a fresh one with `git worktree add <scratchpad>/base <base>`.
3. Install dependencies or build it, the same way the project does. Reuse the main checkout's caches where the tool allows, such as `CARGO_TARGET_DIR` or a shared venv.
4. Run the test there.
5. Remove the worktree afterwards.

The failure is pre-existing only if the test runs at the base and fails the same way. If it can't run there (missing modules, build errors), treat the failure as yours.

**Outside git**, you can't run that check.

- **It touches files you edited:** treat it as yours.
- **It doesn't:** list it in the report as "possibly pre-existing, not verified", and go on without fixing it.

## Snapshot before fixing review findings

**In git:** run `git stash create`, which records the tracked files without touching anything.

- **If it prints nothing:** use HEAD as the snapshot.
- **If the repo has no commits yet:** there's no snapshot, so treat every file as untracked.

Check each file your fixes touched:

- **Tracked file:** read `git diff <snapshot> -- <file>`.
- **Untracked file, or not a git repo:** reread the parts you changed.
