export const typeDefs = `#graphql
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    user: String!
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
    ): Task!

    updateTask(
      id: ID!
      title: String
      user: String
      completed: Boolean
    ): Task!

    deleteTask(id: ID!): Task!
  }
`;
