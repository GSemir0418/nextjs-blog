import { createConnection, getConnectionManager } from "typeorm";
import { Post } from "src/entity/Post";
import { User } from "src/entity/User";
import { Comment } from "src/entity/Comment";
import config from "ormconfig.json";
import "reflect-metadata";

const create = async () => {
  // @ts-ignore
  return createConnection({
    ...config,
    entities: [Post, User, Comment],
  });
};
const promise = (async function () {
  const manager = getConnectionManager();
  const current = manager.has("default") && manager.get("default");
  if (current) {
    await current.close();
  }
  return create();
})();

export async function getDatabaseConnection() {
  return promise;
}
