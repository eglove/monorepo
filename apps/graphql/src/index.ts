import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { HTTP_STATUS } from '@ethang/toolbelt/constants/http';
import { GraphQLError } from 'graphql/error';

import { imageApi } from './image/api';

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
    async books() {
      const response = await imageApi.fetch.imageGet({
        pathVariables: { filename: 'filename' },
      });

      if (!response.isSuccess) {
        throw new GraphQLError(response.error.message, {
          extensions: { code: HTTP_STATUS.INTERNAL_SERVER_ERROR },
        });
      }

      const data = await response.data?.json();

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
