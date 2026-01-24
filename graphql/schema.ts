export const typeDefs = `#graphql
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    user: String!
    deadline: String
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(
      title: String!
      user: String!
      completed: Boolean
      deadline: String
    ): Task!

    updateTask(
      id: ID!
      title: String
      user: String
      completed: Boolean
      deadline: String
    ): Task!

    deleteTask(id: ID!): Task!
  }
`;
