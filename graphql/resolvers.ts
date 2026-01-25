import db from "../db/knex.js";
import { wsBroadcast } from "../ws.js";

type TaskRow = {
  id: number;
  title: string;
  completed: boolean;
  user: string;
};

export const resolvers = {
  Query: {
    tasks: async (): Promise<TaskRow[]> => {
      return db<TaskRow>("tasks_knex").select("*");
    },

    task: async (_: unknown, args: { id: string }): Promise<TaskRow | undefined> => {
      const idNum = Number(args.id);
      if (!Number.isInteger(idNum)) return undefined;

      return db<TaskRow>("tasks_knex").where("id", idNum).first();
    },
  },

  Mutation: {
    createTask: async (
      _: unknown,
      args: { title: string; user: string; completed?: boolean}
    ): Promise<TaskRow> => {
      const [task] = await db<TaskRow>("tasks_knex")
        .insert({
          title: args.title,
          user: args.user,
          completed: args.completed ?? false,
        })
        .returning("*")

        //WS
        wsBroadcast({
          type: "TASK_CREATED",
          payload: { id: task.id },
            });

      
      return task;
    },


    updateTask: async (
      _: unknown,
      args: { id: string; title?: string; user?: string; completed?: boolean}
    ): Promise<TaskRow> => {
      const idNum = Number(args.id);
      if (!Number.isInteger(idNum)) {
        throw new Error("Invalid id");
      }

      const patch: Partial<Omit<TaskRow, "id">> = {};
      if (args.title !== undefined) patch.title = args.title;
      if (args.user !== undefined) patch.user = args.user;
      if (args.completed !== undefined) patch.completed = args.completed;

      const [task] = await db<TaskRow>("tasks_knex")
        .where("id", idNum)
        .update(patch)
        .returning("*")
        
      if (!task) throw new Error("Task not found")

      //WS
      wsBroadcast({
         type: "TASK_UPDATED",
         payload: { id: task.id },
          });

      return task;
    },

    deleteTask: async (_: unknown, args: { id: string }): Promise<TaskRow> => {
      const idNum = Number(args.id);
      if (!Number.isInteger(idNum)) {
        throw new Error("Invalid id");
      }

      const [task] = await db<TaskRow>("tasks_knex")
        .where("id", idNum)
        .del()
        .returning("*");

      if (!task) throw new Error("Task not found")
        
        //WS
        wsBroadcast({
          type: "TASK_DELETED",
          payload: { id: task.id },
            });

      return task;
    },
  },
};
