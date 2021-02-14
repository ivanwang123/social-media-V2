import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import "semantic-ui-css/semantic.min.css";
import "./index.css";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: createHttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          postsPagination: {
            keyArgs: false,
            merge(existing, incoming, arg) {
              const merged = existing ? existing.slice(0) : [];
              const offset = arg.args?.offset ? arg.args.offset : 0;

              for (let i = 0; i < incoming.length; i++) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
        },
      },
    },
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
