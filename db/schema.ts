import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccountType } from "next-auth/adapters"

const client = createClient({
  url: process.env.DB_URL!,
  authToken: process.env.DB_TOKEN!,
})
export const db = drizzle(client)

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const models = sqliteTable("models", {
  id: text("id").primaryKey(),
  name: text('name').notNull().unique(),
  downloadUrl: text("downloadUrl").notNull(),
  public: integer("public", {
    mode: "boolean"
  }).default(false).notNull(),
  owner: text("owner")
    .references(() => users.id, { onDelete: "cascade" }),
})

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  displayName: text('displayName')
    .unique()
    .notNull(),
  gameId: text("gameId")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  userId: text("userId")
    .references(() => users.id),
  playerScore: integer("playerScore")
    .notNull()
    .default(0),
  modelScore: integer("modelScore")
    .notNull()
    .default(0),
  grading: integer("grading")
    .notNull()
    .default(0)
})

export const games = sqliteTable('games', {
  id: text("id").primaryKey(),
  name: text('name'),
  owner: text("owner")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  state: text("state"),
  model: text("model")
    .notNull()
    .references(() => models.id),
  modelName: text("modelName").notNull()
})