-- DropIndex
DROP INDEX "task_userId_idx";

-- CreateIndex
CREATE INDEX "task_userId_createdAt_idx" ON "task"("userId", "createdAt");
