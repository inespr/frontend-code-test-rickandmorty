import { createClient, cacheExchange, fetchExchange } from "urql";

export const client = createClient({
  url: "https://rickandmortyapi.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
});
