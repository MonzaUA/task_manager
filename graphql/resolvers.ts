import db from "../db/knex.js";

type TaskRow = {
  id: number;
  title: string;
  completed: boolean;
  user: string;
  deadline: string | null;
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
      args: { title: string; user: string; completed?: boolean; deadline?: string }
    ): Promise<TaskRow> => {
      const [task] = await db<TaskRow>("tasks_knex")
        .insert({
          title: args.title,
          user: args.user,
          completed: args.completed ?? false,
          deadline: args.deadline ?? null,
        })
        .returning("*");

      return task;
    },

    updateTask: async (
      _: unknown,
      args: { id: string; title?: string; user?: string; completed?: boolean; deadline?: string }
    ): Promise<TaskRow> => {
      const idNum = Number(args.id);
      if (!Number.isInteger(idNum)) {
        throw new Error("Invalid id");
      }

      const patch: Partial<Omit<TaskRow, "id">> = {};
      if (args.title !== undefined) patch.title = args.title;
      if (args.user !== undefined) patch.user = args.user;
      if (args.completed !== undefined) patch.completed = args.completed;
      if (args.deadline !== undefined) patch.deadline = args.deadline ?? null;

      const [task] = await db<TaskRow>("tasks_knex")
        .where("id", idNum)
        .update(patch)
        .returning("*");

      if (!task) throw new Error("Task not found");
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

      if (!task) throw new Error("Task not found");
      return task;
    },
  },
};
