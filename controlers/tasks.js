const db = require('../db/knex')

const getAllTasks = async (req,res) => {
    try {
        const tasks = await db('tasks_knex').select('*')
        res.status(200).json({ tasks })
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

const getTask = async (req,res) => {
    try {
        const {id} = req.params

        const task = await db('tasks_knex')
        .where({id})
        .first()

        if(!task) {
            res.status(404).json({msg: `Task with such ${id} does not exist`})
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({error})
    }
}

const createTask = async (req, res) => {
    try {
        const {title, completed} = req.body

        if(!title) {
            return res.status(400).json({msg: `Title is required`})
        }

        const [task] = await db('tasks_knex')
        .insert({title, completed})
        .returning('*')

        const io = req.app.get('io')
        io.emit('task_created', task)

        
        res.status(201).json({task})
    } catch (error) {
        return res.status(500).json({msg: error})
    }
}

const updateTask = async (req,res) => {
    try {
        const {id} = req.params

        const [task] = await db('tasks_knex')
        .where({id})
        .update(req.body)
        .returning('*')

        if(!task) {
            return res.status(404).json({msg: `no task with ID:${id}`})
        }

        const io = req.app.get('io')
        io.emit('task_updated', task)

        res.status(200).json({task})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

const deleteTask = async (req,res) => {
    try {
        const {id} = req.params

        const [task] = await db ('tasks_knex')
        .where({id})
        .del()
        .returning('*')

        if(!task) {
            return res.status(404).json({msg: `not found`})
        }

        const io = req.app.get('io')
        io.emit('task_deleted', id)

        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({error})
    }
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask

}