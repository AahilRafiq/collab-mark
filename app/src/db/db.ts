import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.POSTGRES_URI || 'postgres://postgres:icode247@localhost:5432/codemasters'
export const connection = postgres(connectionString,{prepare:false})
export const db = drizzle(connection, { schema });