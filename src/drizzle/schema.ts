import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { USER_ROLES } from "./constants/user-role";
import { relations } from "drizzle-orm";

export const UserRole = pgEnum("userRole", Object.values(USER_ROLES) as [string, ...string[]]);

export const UserTable = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    role: UserRole("userRole").default(USER_ROLES.MEMBER).notNull(),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex("emailIndex").on(table.email),
      uniqueName: unique("uniqueName").on(table.name),
    };
  },
);

export const UserPreferenceTable = pgTable("userPreference", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailUpdates: boolean("emailUpdates").notNull().default(false),
  userId: uuid("userId")
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const PostTable = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  averageRating: real("averageRating").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  authorId: uuid("userId")
    .references(() => UserTable.id)
    .notNull(),
});

export const CategoryTable = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
});

export const PostCategoryTable = pgTable(
  "postCategory",
  {
    postId: uuid("postId")
      .references(() => PostTable.id)
      .notNull(),
    categoryId: uuid("categoryId")
      .references(() => CategoryTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.categoryId] }),
    };
  },
);

// #region RELATIONS

export const UserTableRelations = relations(UserTable, ({ one, many }) => {
  return {
    preference: one(UserPreferenceTable),
    posts: many(PostTable),
  };
});

export const UserPreferenceTableRelations = relations(UserPreferenceTable, ({ one }) => {
  return {
    user: one(UserTable, {
      fields: [UserPreferenceTable.userId],
      references: [UserTable.id],
    }),
  };
});

export const PostTableRelations = relations(PostTable, ({ one, many }) => {
  return {
    // user
  };
});

// #endregion
