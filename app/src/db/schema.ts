import { serial ,pgTable, text, boolean ,integer, AnyPgColumn } from "drizzle-orm/pg-core";

export const Users = pgTable('Users', {
  id: serial('id').primaryKey(),
  username: text('username'),
  email: text('email'),
  password: text('password'),
});

export const Folders = pgTable('Folders', {
  id: serial('id').primaryKey(),
  name: text('name'),
  parentFolder: integer('parentFolder').references(():AnyPgColumn => Folders.id),
  ownerID: integer('ownerID').references(()=>Users.id),
});

export const Documents = pgTable('Documents', {
  id: serial('id').primaryKey(),
  name: text('name'),
  content:text('name'),
  parentFolder: integer('parentFolder').references(()=>Folders.id),
  public: boolean('public'),
  ownerID: text('ownerID'),
});