import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"), // student, vendor, admin
  university: varchar("university"),
  courseYear: varchar("course_year"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subjects enum
export const subjectEnum = pgEnum("subject", [
  "computer-science",
  "mathematics", 
  "physics",
  "chemistry",
  "engineering",
  "business",
  "biology",
  "psychology",
  "economics",
  "literature",
  "history",
  "other"
]);

// Content type enum
export const contentTypeEnum = pgEnum("content_type", [
  "lecture-notes",
  "study-guide", 
  "past-paper",
  "project",
  "lab-report",
  "assignment",
  "reference-material"
]);

// Visibility enum
export const visibilityEnum = pgEnum("visibility", [
  "public",
  "university",
  "course",
  "private"
]);

// Notes and projects table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  subject: subjectEnum("subject").notNull(),
  courseCode: varchar("course_code"),
  professor: varchar("professor"),
  university: varchar("university").notNull(),
  academicYear: varchar("academic_year"),
  semester: varchar("semester"),
  contentType: contentTypeEnum("content_type").notNull(),
  visibility: visibilityEnum("visibility").default("public"),
  tags: text("tags").array(),
  uploaderId: varchar("uploader_id").references(() => users.id).notNull(),
  totalDownloads: integer("total_downloads").default(0),
  totalViews: integer("total_views").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  allowDownloads: boolean("allow_downloads").default(true),
  allowComments: boolean("allow_comments").default(true),
  allowRatings: boolean("allow_ratings").default(true),
  license: varchar("license").default("cc-attribution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_notes_subject").on(table.subject),
  index("idx_notes_university").on(table.university),
  index("idx_notes_uploader").on(table.uploaderId),
]);

// File attachments for notes
export const noteFiles = pgTable("note_files", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  fileUrl: varchar("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Ratings for notes
export const noteRatings = pgTable("note_ratings", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_note_ratings_note").on(table.noteId),
  index("idx_note_ratings_user").on(table.userId),
]);

// Comments on notes
export const noteComments = pgTable("note_comments", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id").references(() => noteComments.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_note_comments_note").on(table.noteId),
  index("idx_note_comments_user").on(table.userId),
]);

// Vendor categories
export const vendorCategoryEnum = pgEnum("vendor_category", [
  "accommodation",
  "food",
  "tutoring", 
  "transport",
  "entertainment",
  "services",
  "shopping"
]);

// Vendors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: vendorCategoryEnum("category").notNull(),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  website: varchar("website"),
  priceRange: varchar("price_range"), // budget, mid-range, premium
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_vendors_category").on(table.category),
  index("idx_vendors_owner").on(table.ownerId),
]);

// Vendor ratings
export const vendorRatings = pgTable("vendor_ratings", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_vendor_ratings_vendor").on(table.vendorId),
  index("idx_vendor_ratings_user").on(table.userId),
]);

// Saved/bookmarked content
export const savedNotes = pgTable("saved_notes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  noteId: integer("note_id").references(() => notes.id, { onDelete: "cascade" }).notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
}, (table) => [
  index("idx_saved_notes_user").on(table.userId),
]);

// Advertisements (admin-managed)
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  linkUrl: varchar("link_url"),
  targetAudience: varchar("target_audience"), // students, vendors, all
  placement: varchar("placement"), // header, sidebar, content
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  ratings: many(noteRatings),
  comments: many(noteComments),
  savedNotes: many(savedNotes),
  vendors: many(vendors),
  vendorRatings: many(vendorRatings),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  uploader: one(users, { fields: [notes.uploaderId], references: [users.id] }),
  files: many(noteFiles),
  ratings: many(noteRatings),
  comments: many(noteComments),
  savedBy: many(savedNotes),
}));

export const noteFilesRelations = relations(noteFiles, ({ one }) => ({
  note: one(notes, { fields: [noteFiles.noteId], references: [notes.id] }),
}));

export const noteRatingsRelations = relations(noteRatings, ({ one }) => ({
  note: one(notes, { fields: [noteRatings.noteId], references: [notes.id] }),
  user: one(users, { fields: [noteRatings.userId], references: [users.id] }),
}));

export const noteCommentsRelations = relations(noteComments, ({ one, many }) => ({
  note: one(notes, { fields: [noteComments.noteId], references: [notes.id] }),
  user: one(users, { fields: [noteComments.userId], references: [users.id] }),
  parent: one(noteComments, { fields: [noteComments.parentId], references: [noteComments.id] }),
  replies: many(noteComments),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  owner: one(users, { fields: [vendors.ownerId], references: [users.id] }),
  ratings: many(vendorRatings),
}));

export const vendorRatingsRelations = relations(vendorRatings, ({ one }) => ({
  vendor: one(vendors, { fields: [vendorRatings.vendorId], references: [vendors.id] }),
  user: one(users, { fields: [vendorRatings.userId], references: [users.id] }),
}));

export const savedNotesRelations = relations(savedNotes, ({ one }) => ({
  user: one(users, { fields: [savedNotes.userId], references: [users.id] }),
  note: one(notes, { fields: [savedNotes.noteId], references: [notes.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  uploaderId: true,
  totalDownloads: true,
  totalViews: true,
  averageRating: true,
  totalRatings: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteFileSchema = createInsertSchema(noteFiles).omit({
  id: true,
  uploadedAt: true,
});

export const insertNoteRatingSchema = createInsertSchema(noteRatings).omit({
  id: true,
  createdAt: true,
});

export const insertNoteCommentSchema = createInsertSchema(noteComments).omit({
  id: true,
  createdAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  ownerId: true,
  averageRating: true,
  totalRatings: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorRatingSchema = createInsertSchema(vendorRatings).omit({
  id: true,
  createdAt: true,
});

export const insertSavedNoteSchema = createInsertSchema(savedNotes).omit({
  id: true,
  savedAt: true,
});

export const insertAdvertisementSchema = createInsertSchema(advertisements).omit({
  id: true,
  createdBy: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNoteFile = z.infer<typeof insertNoteFileSchema>;
export type NoteFile = typeof noteFiles.$inferSelect;
export type InsertNoteRating = z.infer<typeof insertNoteRatingSchema>;
export type NoteRating = typeof noteRatings.$inferSelect;
export type InsertNoteComment = z.infer<typeof insertNoteCommentSchema>;
export type NoteComment = typeof noteComments.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendorRating = z.infer<typeof insertVendorRatingSchema>;
export type VendorRating = typeof vendorRatings.$inferSelect;
export type InsertSavedNote = z.infer<typeof insertSavedNoteSchema>;
export type SavedNote = typeof savedNotes.$inferSelect;
export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
export type Advertisement = typeof advertisements.$inferSelect;
