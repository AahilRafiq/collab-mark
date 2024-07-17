import { serial ,pgTable, text, boolean ,integer, AnyPgColumn } from "drizzle-orm/pg-core";

export const Users = pgTable('Users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
});

export const Folders = pgTable('Folders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  parentFolder: integer('parentFolder').references(():AnyPgColumn => Folders.id),
  ownerID: integer('ownerID').references(()=>Users.id).notNull(),
});

export const Documents = pgTable('Documents', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  content:text('name'),
  parentFolder: integer('parentFolder').references(()=>Folders.id).notNull(),
  public: boolean('public').notNull(),
  ownerID: text('ownerID').notNull(),
});