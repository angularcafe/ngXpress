import { Router } from 'express';
import { createTask, deleteTask, getTasks, updateTask } from './tasks.controller';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
