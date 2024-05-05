import database from "../.tina/database";
import { queries } from "../.tina/__generated__/types";
import { resolve } from "@tinacms/graphql";
import type { Database } from "@tinacms/graphql";
import type { TinaClient } from "tinacms/dist/client";

export async function databaseRequest({ query, variables, database }) {
  const config = {
    useRelativeMedia: true,
  } as any;

  const result = await resolve({
    config,
    database,
    query,
    variables,
    verbose: true,
  });

  return result;
}

export function getDatabaseConnection<GenQueries = Record<string, unknown>>({
  database,
  queries,
}: {
  database: Database;
  queries: (client: {
    request: TinaClient<GenQueries>["request"];
  }) => GenQueries;
}) {
  const request = async ({ query, variables }) => {
    const data = await databaseRequest({ query, variables, database });
    return { data: data.data as any, query, variables, errors: data.errors };
  };
  const q = queries({
    request,
  });
  return { queries: q, request };
}

export const dbConnection = getDatabaseConnection({ database, queries });

const foo = async () => {
  const { data } = await dbConnection.queries.author({
    relativePath: "foo.md",
  });
};
