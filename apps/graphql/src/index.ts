import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
type Book {
    title: String
    author: String
}

type Query {
    books: [Book]
}
`;

const books = [
  {
    author: 'Kate Chopin',
    title: 'The Awakening',
  },
  {
    author: 'Paul Auster',
    title: 'City of Glass',
  },
];

const resolvers = {
  Query: {
    books() {
      return books;
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
