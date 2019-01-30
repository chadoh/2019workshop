import { ApolloServer, gql } from "apollo-server";

const PORT = 4444;

const typeDefs = gql`
  type Query {
    testString: String
  }
`;

const server = new ApolloServer({ typeDefs, mocks: true });

server
  .listen({ port: PORT })
  .then(({ url }) => console.log(`🚀 Server ready at ${url}`));
