# Replacing the Old MediFlow Project

Recommended safe sequence:

1. Keep a backup or Git branch/tag of the old project.
2. Create a fresh repository/worktree or delete the old implementation files.
3. Copy this package into the new root.
4. Confirm no old Lambda/API Gateway/SQS architecture instructions remain.
5. Commit this AIDLC baseline.
6. Open `codex/Task-01-initialize-nestjs.md` and give that task to Codex.
7. Review Codex output before proceeding to Task 02.

Do not mix the previous Lambda architecture and this NestJS modular-monolith architecture in the same source tree.
