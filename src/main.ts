import "dotenv/config";
import { db } from "./drizzle/db";
import { UserTable } from "./drizzle/schema";

async function main() {
  // await db.insert(UserTable).values({
  //   name: "Ken",
  // });

  // const user = await db.query.UserTable.findFirst();
  // console.log(user);

  await db.delete(UserTable);
}

main();
