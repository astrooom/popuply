import { Many, relations } from "drizzle-orm";
import {
  timestamp,
  text,
  pgTable,
  serial,
  uuid,
  pgEnum,
  bigint,
  integer,
  varchar,
  boolean,
  json,
} from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 320 }).unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  githubId: integer("github_id"), // Optional for GitHub oauth Users.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  allowedSites: integer("allowed_sites").default(0).notNull(),
});
export const userRelations = relations(users, ({ many }) => ({
  sites: many(sites)
}));

export const orderStatusEnum = pgEnum("order_status", ["created", "paid", "cancelled"]);
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey(),
  pricingId: text("pricing_id").notNull(),
  sessionId: text("session_id"),
  status: orderStatusEnum("status").notNull().default("created"),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: 'set null' }) // Nullable foreign key
})
export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  })
}));



export const emailVerificationCodes = pgTable("email_verification_code", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 320 }).notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});


export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})


export const orderModeEnum = pgEnum('order_mode', ['ordered', 'randomized']);
export const pageRuleTypeEnum = pgEnum('page_rule_type', ['whitelist', 'blacklist']);
export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  domain: varchar("domain", { length: 2048 }).notNull(),
  faviconUrl: varchar("favicon_url", { length: 2048 }),
  orderMode: orderModeEnum("order_mode").notNull().default('ordered'),
  startAfter: bigint("start_after", { mode: 'number' }).notNull().default(500), // Start popups after x ms (initially)
  hideAfter: bigint("hide_after ", { mode: 'number' }).notNull().default(1000), // Hide popup after x ms
  frequency: bigint("frequency", { mode: 'number' }).notNull().default(1000), // Send popup every x ms
  visitors: bigint("visitors", { mode: 'number' }).notNull().default(0), // Total number of visitors. Incremented on each API hit.
  enableWebhook: boolean("enable_webhook").notNull().default(false), // Enable webhook capabilities for site
  pageRuleType: pageRuleTypeEnum("page_rule_type").notNull().default('blacklist'),
  pageRulePatterns: json("page_rule_patterns").notNull().default([]), // Store as JSON array
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isShowcase: boolean("is_showcase").notNull().default(false), // This is only used to query the showcase site consistenly for the landing page. Is ALWAYS false for all other sites.
});

export const siteRelations = relations(sites, ({ one, many }) => ({
  user: one(users, {
    fields: [sites.userId],
    references: [users.id],
  }),
  popups: many(popups),
  webhookToken: one(webhookTokens, {
    fields: [sites.id],
    references: [webhookTokens.siteId],
  }),
}));


export const webhookTokens = pgTable("webhook_tokens", {
  siteId: uuid("site_id")
    .primaryKey()
    .references(() => sites.id, { onDelete: "cascade" }),
  token: uuid("token").notNull().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const webhookTokenRelations = relations(webhookTokens, ({ one }) => ({
  site: one(sites, {
    fields: [webhookTokens.siteId],
    references: [sites.id],
  }),
}));


export const themeEnum = pgEnum('theme', ['light', 'dark']);
export const popups = pgTable("popups", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 2048 }),
  content: varchar("content", { length: 2048 }),
  link_url: varchar("link_url", { length: 2048 }),
  icon_url: varchar("icon_url", { length: 2048 }),
  theme: themeEnum("theme").notNull().default('light'),
  timestamp: varchar("timestamp", { length: 255 }), // Top-right text on the popup
  order: integer("order").notNull().default(0), // Needs to be adjusted manually on creation or updates of other popups orders.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const popupRelations = relations(popups, ({ one }) => ({
  site: one(sites, {
    fields: [popups.siteId],
    references: [sites.id],
  }),
}))

/**
 * TYPES
 *
 * You can create and export types from your schema to use in your application.
 * This is useful when you need to know the shape of the data you are working with
 * in a component or function.
 */
export type User = typeof users.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type WebhookToken = typeof webhookTokens.$inferSelect;
export type Popup = typeof popups.$inferSelect;

export type PopupUpdate = { id: Popup['id'] } & Partial<Omit<Popup, 'id' | 'siteId' | 'createdAt' | 'updatedAt'>>;
export type PopupsReorder = {
  id: string;
  order: number;
}[];