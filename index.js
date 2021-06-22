const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const { authors } = require("./fixtures/authors");
const { books } = require("./fixtures/books");

const schema = buildSchema(`

  type Book {
    id: Int!
    name: String!
    authorId: Int!
  }

  type Author {
    id: Int!
    name: String!
  }

  type Query {
    authors: [Author]
    books: [Book]
    booksByAuthor(authorId: Int!): [Book]
    authorById(authorId: Int!): Author
  }
`);

const rootValue = {
  authors: () => authors,
  books: () => books,
  booksByAuthor: ({ authorId }) =>
    books.filter((book) => book.authorId === authorId),
  authorById: ({ authorId }) =>
    authors.find((author) => author.id === authorId),
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(4000);
