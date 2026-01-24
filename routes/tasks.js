import { Router } from 'express' // const express = require('express')


// const {getAllTasks,
//     getTask,
//     createTask,
//     updateTask,
//     deleteTask,
// } = require('../controlers/tasks')

import {getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} from '../controlers/tasks.js'


const router = Router();

router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

export default router

