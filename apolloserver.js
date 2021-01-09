const { ApolloServer, gql } = require("apollo-server");
const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];
const typeDefs = gql(`
type Book {
    name:String
    authorId:Int
    id:ID!
    author: Author
}
type Author {
    id: ID!,
    name:String,  
    book:[Book] 
}
type Query {
    books:[Book]
    authors:[Author]
    bookById(authorId : Int) : Book
}
type Mutation {
  addBook(name: String!,authorId: Int): Book
}
`);
const resolvers = {
  Query: {
    books() {
      return books;
    },
    authors() {
      return authors;
    },
  },
  Mutation: {
    addBook(parent, args, context, info) {
      console.log(args);
      const book = {
        id: books.length + 1,
        name: args.name,
        authorId: args.authorId,
      };
      return book;
    },
  },
  Book: {
    author(parent) {
      return authors.find((author) => author.id === parent.authorId);
    },
  },
  Author: {
    book(parent) {
      return books.filter((book) => book.authorId === parent.id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
