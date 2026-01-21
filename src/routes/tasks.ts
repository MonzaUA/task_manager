import { Router } from "express";
import {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/tasks' 

const router:Router = Router()

router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

export default router