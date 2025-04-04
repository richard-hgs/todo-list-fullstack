/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `todo_task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `todo_task_name_key` ON `todo_task`(`name`);
