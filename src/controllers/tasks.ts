import { Request, Response } from "express";
import {db} from '../db/knex'

export interface Task {
    id: Number
    title: String
    completed: Boolean
    user: String
    deadline?: String
    created_at?: String
    updated_at?: String
} 

export interface CreateTaskDTO {
    title: String
    completed?: Boolean
    user: String
    deadline?: String
}


export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks: Task[] = await db<Task>('tasks_knex').select('*')
        res.status(200).json({tasks})
    }
    catch (error) {
        res.status(500).json({msg: error})
    }
}

export const getTask = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        const task = await db<Task>('tasks_knex')
          .where('id', id)
          .first()

        if(task!){
          return res.status(404).json({ msg: `Task with ID ${id} does not exist`})
        }

        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({error})
    }
}


export const createTask = async (req: Request, res: Response) => {
    try {
        const {title, completed = false, user, deadline} = req.body

        if(!title) {
            return res.status(400).json({msg: "provide title"})
        }

        if(!user) {
            return res.status(400).json({msg: 'provide user name'})
        }

        const [task] = await db<Task>('tasks_knex')
          .insert({ title, completed, user, deadline})
          .returning('*')
        
        res.status(201).json({task})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)

        const [task] = await db<Task>('tasks_knex')
          .where('id', id)
          .update(req.body)
          .returning('*')

        if(!task) {
            return res.status(400).json({msg: `no task with ID: ${id}`})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

export const deleteTask = async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id)
          
        const [task] = await db<Task>('tasks_knex')
          .where('id', id)
          .del()
          .returning('*')

        if(!task) {
            return res.status(404).json({msg: `Task not found`})
        }
        
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({error})
    }
}