import db from "../db/knex.js";
import { wsBroadcast } from "../ws.js";
export const resolvers = {
    Query: {
        tasks: async () => {
            return db("tasks_knex").select("*");
        },
        task: async (_, args) => {
            const idNum = Number(args.id);
            if (!Number.isInteger(idNum))
                return undefined;
            return db("tasks_knex").where("id", idNum).first();
        },
    },
    Mutation: {
        createTask: async (_, args) => {
            const [task] = await db("tasks_knex")
                .insert({
                title: args.title,
                user: args.user,
                completed: args.completed ?? false,
            })
                .returning("*");
            //WS
            wsBroadcast({
                type: "TASK_CREATED",
                payload: { id: task.id },
            });
            return task;
        },
        updateTask: async (_, args) => {
            const idNum = Number(args.id);
            if (!Number.isInteger(idNum)) {
                throw new Error("Invalid id");
            }
            const patch = {};
            if (args.title !== undefined)
                patch.title = args.title;
            if (args.user !== undefined)
                patch.user = args.user;
            if (args.completed !== undefined)
                patch.completed = args.completed;
            const [task] = await db("tasks_knex")
                .where("id", idNum)
                .update(patch)
                .returning("*");
            if (!task)
                throw new Error("Task not found");
            //WS
            wsBroadcast({
                type: "TASK_UPDATED",
                payload: { id: task.id },
            });
            return task;
        },
        deleteTask: async (_, args) => {
            const idNum = Number(args.id);
            if (!Number.isInteger(idNum)) {
                throw new Error("Invalid id");
            }
            const [task] = await db("tasks_knex")
                .where("id", idNum)
                .del()
                .returning("*");
            if (!task)
                throw new Error("Task not found");
            //WS
            wsBroadcast({
                type: "TASK_DELETED",
                payload: { id: task.id },
            });
            return task;
        },
    },
};
//# sourceMappingURL=resolvers.js.map