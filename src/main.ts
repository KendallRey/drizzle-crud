import "dotenv/config";
import { db } from "./drizzle/db";
import { UserPreferenceTable, UserTable } from "./drizzle/schema";
import { asc, count, eq, gt, sql } from "drizzle-orm";

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

const sampleUpdate = async () => {
  const user = await db
    .update(UserTable)
    .set({
      age: 30,
    })
    .where(eq(UserTable.age, 26))
    .returning({
      id: UserTable.id,
      name: UserTable.name,
    });
};

const sampleDelete = async () => {
  const user = await db.delete(UserTable).where(eq(UserTable.age, 30)).returning({
    id: UserTable.id,
    name: UserTable.name,
  });
};

async function main() {
  // sampleInsert();
  // sampleUpdate();
  // sampleDelete();

  // await db.insert(UserPreferenceTable).values({
  //   emailUpdates: true,
  //   userId: '25fcfa19-a90b-434f-9090-b25d49442161'
  // })

  const usersSelectSql = await db
    .select({
      name: UserTable.name,
      count: count(UserTable.age),
    })
    .from(UserTable)
    .groupBy(UserTable.name)
    .having((columns) => gt(columns.count, 0));

  const usersSql = await db
    .select({
      id: UserTable.id,
      age: UserTable.age,
      emailUpdates: UserPreferenceTable.emailUpdates,
    })
    .from(UserTable)
    .where(eq(UserTable.age, 26))
    .leftJoin(UserPreferenceTable, eq(UserPreferenceTable.userId, UserTable.id));

  const users = await db.query.UserTable.findMany({
    columns: { email: false },
    extras: { lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName") },
    with: { preference: true, posts: true },
    // orderBy: asc(UserTable.age)
    orderBy: (table, { asc }) => asc(table.name),
    where: (table, func) => func.gt(table.age, 24),
    // where: (table, func) => func.between(table.age, 24, 26),
  });

  // const usersWithPreferencesEmail = await db.query.UserTable.findMany({
  //   columns: { email: false },
  //   extras: { lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName") },
  //   limit: 1,
  //   offset: 1,
  //   with: { preference: {
  //     columns: {
  //       emailUpdates: true
  //     }
  //   } },
  // });
  console.log(users);
}

main();
