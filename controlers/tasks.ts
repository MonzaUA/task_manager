import type { Request, Response } from "express";
import db from '../db/knex.js'

type TaskRow = {
    id: number
    title: string
    completed: boolean
    user: string
    deadline: string | null
}

type IdParams = {id: string }

type CreateTaskBody = {
    title: string
    completed?: boolean
    user: string
    deadline?: string | null
}

type UpdateTaskBody = Partial<CreateTaskBody>

const getAllTasks = async (_req: Request, res: Response) => {
    try {
        const tasks = await db<TaskRow>('tasks_knex').select('*')
        res.status(200).json({tasks})
    } catch (error) {
        res.status(500).json({ msg: String (error)})
    }
}


const getTask = async (req: Request<IdParams>, res: Response) => {
  try {
    const { id } = req.params;

    const task = await db<TaskRow>("tasks_knex").where('id', id).first();

    if (!task) {
      return res.status(404).json({ msg: `Task with such ${id} does not exist` });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};


const createTask = async (
  req: Request<{}, {}, CreateTaskBody>,
  res: Response
) => {
  try {
    const { title, completed, user, deadline } = req.body;

    if (!title) return res.status(400).json({ msg: "Title is required" });
    if (!user) return res.status(400).json({ msg: "User is required" });

    const [task] = await db<TaskRow>("tasks_knex")
      .insert({ title, completed, user, deadline })
      .returning("*");

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
};

const updateTask = async (
  req: Request<IdParams, {}, UpdateTaskBody>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const [task] = await db<TaskRow>("tasks_knex")
      .where('id', id)
      .update(req.body)
      .returning("*");

    if (!task) {
      return res.status(404).json({ msg: `no task with ID:${id}` });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

const deleteTask = async (req: Request<IdParams>, res: Response) => {
  try {
    const { id } = req.params;

    const [task] = await db<TaskRow>("tasks_knex")
      .where('id', id)
      .del()
      .returning("*");

    if (!task) {
      return res.status(404).json({ msg: "not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};