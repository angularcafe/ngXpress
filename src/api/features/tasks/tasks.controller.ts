import type { Request, Response } from 'express';
import type { Prisma, TaskPriority, TaskStatus } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { requireSession } from '../../lib/session';

const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const TASK_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
const SORT_FIELDS = ['createdAt', 'dueDate', 'title', 'updatedAt'] as const;

type SortField = (typeof SORT_FIELDS)[number];

function parseStatus(value: unknown): TaskStatus | undefined {
  return typeof value === 'string' && TASK_STATUSES.includes(value as TaskStatus)
    ? (value as TaskStatus)
    : undefined;
}

function parsePriority(value: unknown): TaskPriority | undefined {
  return typeof value === 'string' && TASK_PRIORITIES.includes(value as TaskPriority)
    ? (value as TaskPriority)
    : undefined;
}

function parseSortField(value: unknown): SortField {
  return typeof value === 'string' && SORT_FIELDS.includes(value as SortField)
    ? (value as SortField)
    : 'createdAt';
}

function parsePage(value: unknown): number {
  const page = Number(value);
  return Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0;
}

function parsePageSize(value: unknown): number {
  const pageSize = Number(value);
  if (!Number.isFinite(pageSize)) {
    return 10;
  }

  return Math.min(Math.max(Math.floor(pageSize), 1), 100);
}

function serializeTask(task: {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function getTasks(req: Request, res: Response): Promise<void> {
  const session = await requireSession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const search = typeof req.query['search'] === 'string' ? req.query['search'].trim() : '';
  const status = parseStatus(req.query['status']);
  const priority = parsePriority(req.query['priority']);
  const sort = parseSortField(req.query['sort']);
  const order = req.query['order'] === 'asc' ? 'asc' : 'desc';
  const page = parsePage(req.query['page']);
  const pageSize = parsePageSize(req.query['pageSize']);

  const where: Prisma.TaskWhereInput = {
    userId: session.user.id,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [{ title: { contains: search } }, { description: { contains: search } }],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [sort]: order },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.task.count({ where }),
  ]);

  res.json({
    items: items.map(serializeTask),
    total,
    page,
    pageSize,
  });
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const session = await requireSession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const status = parseStatus(req.body?.status) ?? 'TODO';
  const priority = parsePriority(req.body?.priority) ?? 'MEDIUM';
  const description =
    typeof req.body?.description === 'string' ? req.body.description.trim() || null : null;
  const dueDate =
    typeof req.body?.dueDate === 'string' && req.body.dueDate
      ? new Date(req.body.dueDate)
      : null;

  if (dueDate && Number.isNaN(dueDate.getTime())) {
    res.status(400).json({ error: 'Invalid due date' });
    return;
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      priority,
      dueDate,
      userId: session.user.id,
    },
  });

  res.status(201).json(serializeTask(task));
}

function parseId(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const session = await requireSession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const id = parseId(req.params['id']);
  if (!id) {
    res.status(400).json({ error: 'Invalid task id' });
    return;
  }
  const existing = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const data: Prisma.TaskUpdateInput = {};

  if (typeof req.body?.title === 'string') {
    const title = req.body.title.trim();
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    data.title = title;
  }

  if (typeof req.body?.description === 'string') {
    data.description = req.body.description.trim() || null;
  }

  if (req.body?.status !== undefined) {
    const status = parseStatus(req.body.status);
    if (!status) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }
    data.status = status;
  }

  if (req.body?.priority !== undefined) {
    const priority = parsePriority(req.body.priority);
    if (!priority) {
      res.status(400).json({ error: 'Invalid priority' });
      return;
    }
    data.priority = priority;
  }

  if (req.body?.dueDate !== undefined) {
    if (req.body.dueDate === null || req.body.dueDate === '') {
      data.dueDate = null;
    } else if (typeof req.body.dueDate === 'string') {
      const dueDate = new Date(req.body.dueDate);
      if (Number.isNaN(dueDate.getTime())) {
        res.status(400).json({ error: 'Invalid due date' });
        return;
      }
      data.dueDate = dueDate;
    }
  }

  const task = await prisma.task.update({
    where: { id },
    data,
  });

  res.json(serializeTask(task));
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const session = await requireSession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const id = parseId(req.params['id']);
  if (!id) {
    res.status(400).json({ error: 'Invalid task id' });
    return;
  }
  const existing = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
}
