import "dotenv/config";
import { db } from "./drizzle/db";
import { UserPreferenceTable, UserTable } from "./drizzle/schema";
import { sql } from "drizzle-orm";

const sampleInsert = async () => {
  // await db.delete(UserTable);
  const user = await db
    .insert(UserTable)
    .values([
      {
        name: "Ken",
        age: 24,
        email: "sample@email.com",
      },
      {
        name: "Rey",
        age: 25,
        email: "sample2@email.com",
      },
      {
        name: "Mozo",
        age: 26,
        email: "sample3@email.com",
      },
    ])
    .returning({
      id: UserTable.id,
      name: UserTable.name,
    });
  // .onConflictDoUpdate({
  //   target: UserTable.email,
  //   set: { name: 'Updated Name'}
  // });

  console.log(user);
};

async function main() {
  // sampleInsert();

  // await db.insert(UserPreferenceTable).values({
  //   emailUpdates: true,
  //   userId: '25fcfa19-a90b-434f-9090-b25d49442161'
  // })

  const users = await db.query.UserTable.findMany({
    columns: { email: false },
    extras: { lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName") },
    // limit: 1,
    // offset: 1,
    with: { preference: true },
  });
  console.log(users);
}

main();
