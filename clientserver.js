const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");

const baseUrl = "https://covid19-api.org/api/";
function getByUrl(relativeURL) {
  return fetch(`${baseUrl}${relativeURL}`).then((res) => res.json());
}

const typeDefs = gql(`
type Country {
    name: String,
    alpha2: ID!,
    covid: Covid,
    prediction: [Prediction]
}
type Covid {
    country: Country, 
    last_update: String,
    cases: Int,
    deaths: Int, 
    recovered: Int,
}
type Prediction {
    country: Country,
    date: String
    cases : Int
}
type Query {
    covid: [Covid]
    countries: [Country]
    prediction(country: String):[Prediction]
    country(alpha2: String) : Country
}
`);

const resolvers = {
  Query: {
    countries() {
      return getByUrl("countries");
    },
    covid() {
      return getByUrl("status");
    },
    country(parent, args, context, info) {
      return getByUrl(`country/${args.alpha2}`);
    },
    prediction(parent, args, context, info) {
      console.log(args);
      return getByUrl(`prediction/${args.country}`);
    },
  },
  Country: {
    covid(parent) {
      return getByUrl(`status/${parent.alpha2}`);
    },
    prediction(parent) {
      return getByUrl(`prediction/${parent.alpha2}`);
    },
  },
  Covid: {
    country(parent) {
      return getByUrl(`country/${parent.country}`);
    },
  },
  Prediction: {
    country(parent) {
      return getByUrl(`country/${parent.country}`);
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
