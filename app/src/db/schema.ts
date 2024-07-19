import { serial ,pgTable, text, boolean ,integer } from "drizzle-orm/pg-core";

export const Users = pgTable('Users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
});

export const Folders = pgTable('Folders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  parentFolder: integer("parentFolder").references(() => Folders.id),
  ownerID: integer('ownerID').references(() => Users.id).notNull(),
});

export const Documents = pgTable('Documents', {
  id: serial('id').primaryKey(),
  name: text('name'),
  content: text("content"),
  parentFolder: integer('parentFolder').references(() => Folders.id),
  public: boolean('public'),
  ownerID: integer('ownerID').references(() => Users.id), // Changed from text to integer and added reference
});