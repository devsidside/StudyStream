import {
  users,
  notes,
  noteFiles,
  noteRatings,
  noteComments,
  vendors,
  vendorRatings,
  savedNotes,
  advertisements,
  type User,
  type UpsertUser,
  type InsertNote,
  type Note,
  type InsertNoteFile,
  type NoteFile,
  type InsertNoteRating,
  type NoteRating,
  type InsertNoteComment,
  type NoteComment,
  type InsertVendor,
  type Vendor,
  type InsertVendorRating,
  type VendorRating,
  type InsertSavedNote,
  type SavedNote,
  type InsertAdvertisement,
  type Advertisement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, or, sql, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Notes operations
  createNote(note: InsertNote, uploaderId: string): Promise<Note>;
  getNotes(filters?: {
    subject?: string;
    university?: string;
    contentType?: string;
    searchTerm?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'popular' | 'recent' | 'rating';
  }): Promise<{ notes: Note[]; total: number }>;
  getNoteById(id: number): Promise<Note | undefined>;
  getNoteWithDetails(id: number): Promise<any>;
  updateNoteViews(id: number): Promise<void>;
  updateNoteDownloads(id: number): Promise<void>;
  deleteNote(id: number, userId: string): Promise<boolean>;

  // Note files operations
  addNoteFile(file: InsertNoteFile): Promise<NoteFile>;
  getNoteFiles(noteId: number): Promise<NoteFile[]>;
  deleteNoteFile(id: number): Promise<void>;

  // Rating operations
  addNoteRating(rating: InsertNoteRating): Promise<NoteRating>;
  getNoteRatings(noteId: number): Promise<NoteRating[]>;
  getUserNoteRating(noteId: number, userId: string): Promise<NoteRating | undefined>;
  updateNoteRating(id: number, rating: number, review?: string): Promise<void>;

  // Comment operations
  addNoteComment(comment: InsertNoteComment): Promise<NoteComment>;
  getNoteComments(noteId: number): Promise<NoteComment[]>;

  // Vendor operations
  createVendor(vendor: InsertVendor, ownerId: string): Promise<Vendor>;
  getVendors(filters?: {
    category?: string;
    searchTerm?: string;
    location?: { lat: number; lng: number; radius: number };
    limit?: number;
    offset?: number;
  }): Promise<{ vendors: Vendor[]; total: number }>;
  getVendorById(id: number): Promise<Vendor | undefined>;
  updateVendor(id: number, vendor: Partial<InsertVendor>, userId: string): Promise<boolean>;
  deleteVendor(id: number, userId: string): Promise<boolean>;

  // Vendor rating operations
  addVendorRating(rating: InsertVendorRating): Promise<VendorRating>;
  getVendorRatings(vendorId: number): Promise<VendorRating[]>;

  // Saved notes operations
  saveNote(savedNote: InsertSavedNote): Promise<SavedNote>;
  unsaveNote(noteId: number, userId: string): Promise<void>;
  getUserSavedNotes(userId: string): Promise<Note[]>;
  isNoteSaved(noteId: number, userId: string): Promise<boolean>;

  // Admin operations
  createAdvertisement(ad: InsertAdvertisement, createdBy: string): Promise<Advertisement>;
  getAdvertisements(placement?: string): Promise<Advertisement[]>;
  updateAdvertisement(id: number, ad: Partial<InsertAdvertisement>): Promise<void>;
  deleteAdvertisement(id: number): Promise<void>;
  
  // Analytics
  getTopNotes(limit?: number): Promise<Note[]>;
  getTrendingNotes(limit?: number): Promise<Note[]>;
  getRecentNotes(limit?: number): Promise<Note[]>;
  getSubjectStats(): Promise<{ subject: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Notes operations
  async createNote(note: InsertNote, uploaderId: string): Promise<Note> {
    const [newNote] = await db
      .insert(notes)
      .values({ ...note, uploaderId })
      .returning();
    return newNote;
  }

  async getNotes(filters?: {
    subject?: string;
    university?: string;
    contentType?: string;
    searchTerm?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'popular' | 'recent' | 'rating';
  }): Promise<{ notes: Note[]; total: number }> {
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;

    let query = db.select().from(notes);
    let countQuery = db.select({ count: count() }).from(notes);

    const conditions = [];
    
    if (filters?.subject) {
      conditions.push(eq(notes.subject, filters.subject as any));
    }
    
    if (filters?.university) {
      conditions.push(like(notes.university, `%${filters.university}%`));
    }
    
    if (filters?.contentType) {
      conditions.push(eq(notes.contentType, filters.contentType as any));
    }
    
    if (filters?.searchTerm) {
      conditions.push(
        or(
          like(notes.title, `%${filters.searchTerm}%`),
          like(notes.description, `%${filters.searchTerm}%`),
          sql`${notes.tags} && ARRAY[${filters.searchTerm}]`
        )
      );
    }

    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      query = query.where(whereCondition);
      countQuery = countQuery.where(whereCondition);
    }

    // Apply sorting
    if (filters?.sortBy === 'popular') {
      query = query.orderBy(desc(notes.totalDownloads));
    } else if (filters?.sortBy === 'rating') {
      query = query.orderBy(desc(notes.averageRating));
    } else {
      query = query.orderBy(desc(notes.createdAt));
    }

    const [notesResult, totalResult] = await Promise.all([
      query.limit(limit).offset(offset),
      countQuery
    ]);

    return {
      notes: notesResult,
      total: totalResult[0]?.count || 0
    };
  }

  async getNoteById(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async getNoteWithDetails(id: number): Promise<any> {
    const noteWithFiles = await db
      .select({
        note: notes,
        files: noteFiles,
        uploader: users,
      })
      .from(notes)
      .leftJoin(noteFiles, eq(notes.id, noteFiles.noteId))
      .leftJoin(users, eq(notes.uploaderId, users.id))
      .where(eq(notes.id, id));

    if (noteWithFiles.length === 0) return undefined;

    const note = noteWithFiles[0].note;
    const uploader = noteWithFiles[0].uploader;
    const files = noteWithFiles
      .filter(row => row.files)
      .map(row => row.files);

    return { ...note, uploader, files };
  }

  async updateNoteViews(id: number): Promise<void> {
    await db
      .update(notes)
      .set({ totalViews: sql`${notes.totalViews} + 1` })
      .where(eq(notes.id, id));
  }

  async updateNoteDownloads(id: number): Promise<void> {
    await db
      .update(notes)
      .set({ totalDownloads: sql`${notes.totalDownloads} + 1` })
      .where(eq(notes.id, id));
  }

  async deleteNote(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.uploaderId, userId)))
      .returning();
    return result.length > 0;
  }

  // Note files operations
  async addNoteFile(file: InsertNoteFile): Promise<NoteFile> {
    const [newFile] = await db.insert(noteFiles).values(file).returning();
    return newFile;
  }

  async getNoteFiles(noteId: number): Promise<NoteFile[]> {
    return await db.select().from(noteFiles).where(eq(noteFiles.noteId, noteId));
  }

  async deleteNoteFile(id: number): Promise<void> {
    await db.delete(noteFiles).where(eq(noteFiles.id, id));
  }

  // Rating operations
  async addNoteRating(rating: InsertNoteRating): Promise<NoteRating> {
    const [newRating] = await db.insert(noteRatings).values(rating).returning();
    
    // Update note's average rating
    await this.updateNoteAverageRating(rating.noteId);
    
    return newRating;
  }

  async getNoteRatings(noteId: number): Promise<NoteRating[]> {
    return await db
      .select({
        ...noteRatings,
        user: users,
      })
      .from(noteRatings)
      .leftJoin(users, eq(noteRatings.userId, users.id))
      .where(eq(noteRatings.noteId, noteId))
      .orderBy(desc(noteRatings.createdAt)) as any;
  }

  async getUserNoteRating(noteId: number, userId: string): Promise<NoteRating | undefined> {
    const [rating] = await db
      .select()
      .from(noteRatings)
      .where(and(eq(noteRatings.noteId, noteId), eq(noteRatings.userId, userId)));
    return rating;
  }

  async updateNoteRating(id: number, rating: number, review?: string): Promise<void> {
    const updateData: any = { rating };
    if (review !== undefined) updateData.review = review;
    
    await db.update(noteRatings).set(updateData).where(eq(noteRatings.id, id));
    
    // Get the note ID to update average rating
    const [ratingRecord] = await db.select().from(noteRatings).where(eq(noteRatings.id, id));
    if (ratingRecord) {
      await this.updateNoteAverageRating(ratingRecord.noteId);
    }
  }

  private async updateNoteAverageRating(noteId: number): Promise<void> {
    const [stats] = await db
      .select({
        avg: avg(noteRatings.rating),
        count: count(noteRatings.id),
      })
      .from(noteRatings)
      .where(eq(noteRatings.noteId, noteId));

    await db
      .update(notes)
      .set({
        averageRating: stats.avg ? stats.avg.toString() : "0",
        totalRatings: stats.count,
      })
      .where(eq(notes.id, noteId));
  }

  // Comment operations
  async addNoteComment(comment: InsertNoteComment): Promise<NoteComment> {
    const [newComment] = await db.insert(noteComments).values(comment).returning();
    return newComment;
  }

  async getNoteComments(noteId: number): Promise<NoteComment[]> {
    return await db
      .select({
        ...noteComments,
        user: users,
      })
      .from(noteComments)
      .leftJoin(users, eq(noteComments.userId, users.id))
      .where(eq(noteComments.noteId, noteId))
      .orderBy(asc(noteComments.createdAt)) as any;
  }

  // Vendor operations
  async createVendor(vendor: InsertVendor, ownerId: string): Promise<Vendor> {
    const [newVendor] = await db
      .insert(vendors)
      .values({ ...vendor, ownerId })
      .returning();
    return newVendor;
  }

  async getVendors(filters?: {
    category?: string;
    searchTerm?: string;
    location?: { lat: number; lng: number; radius: number };
    limit?: number;
    offset?: number;
  }): Promise<{ vendors: Vendor[]; total: number }> {
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;

    let query = db.select().from(vendors);
    let countQuery = db.select({ count: count() }).from(vendors);

    const conditions = [eq(vendors.isActive, true)];
    
    if (filters?.category) {
      conditions.push(eq(vendors.category, filters.category as any));
    }
    
    if (filters?.searchTerm) {
      conditions.push(
        or(
          like(vendors.name, `%${filters.searchTerm}%`),
          like(vendors.description, `%${filters.searchTerm}%`)
        )
      );
    }

    const whereCondition = and(...conditions);
    query = query.where(whereCondition);
    countQuery = countQuery.where(whereCondition);

    const [vendorsResult, totalResult] = await Promise.all([
      query.orderBy(desc(vendors.averageRating)).limit(limit).offset(offset),
      countQuery
    ]);

    return {
      vendors: vendorsResult,
      total: totalResult[0]?.count || 0
    };
  }

  async getVendorById(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }

  async updateVendor(id: number, vendor: Partial<InsertVendor>, userId: string): Promise<boolean> {
    const result = await db
      .update(vendors)
      .set(vendor)
      .where(and(eq(vendors.id, id), eq(vendors.ownerId, userId)))
      .returning();
    return result.length > 0;
  }

  async deleteVendor(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(vendors)
      .where(and(eq(vendors.id, id), eq(vendors.ownerId, userId)))
      .returning();
    return result.length > 0;
  }

  // Vendor rating operations
  async addVendorRating(rating: InsertVendorRating): Promise<VendorRating> {
    const [newRating] = await db.insert(vendorRatings).values(rating).returning();
    
    // Update vendor's average rating
    await this.updateVendorAverageRating(rating.vendorId);
    
    return newRating;
  }

  async getVendorRatings(vendorId: number): Promise<VendorRating[]> {
    return await db
      .select({
        ...vendorRatings,
        user: users,
      })
      .from(vendorRatings)
      .leftJoin(users, eq(vendorRatings.userId, users.id))
      .where(eq(vendorRatings.vendorId, vendorId))
      .orderBy(desc(vendorRatings.createdAt)) as any;
  }

  private async updateVendorAverageRating(vendorId: number): Promise<void> {
    const [stats] = await db
      .select({
        avg: avg(vendorRatings.rating),
        count: count(vendorRatings.id),
      })
      .from(vendorRatings)
      .where(eq(vendorRatings.vendorId, vendorId));

    await db
      .update(vendors)
      .set({
        averageRating: stats.avg ? stats.avg.toString() : "0",
        totalRatings: stats.count,
      })
      .where(eq(vendors.id, vendorId));
  }

  // Saved notes operations
  async saveNote(savedNote: InsertSavedNote): Promise<SavedNote> {
    const [newSavedNote] = await db.insert(savedNotes).values(savedNote).returning();
    return newSavedNote;
  }

  async unsaveNote(noteId: number, userId: string): Promise<void> {
    await db
      .delete(savedNotes)
      .where(and(eq(savedNotes.noteId, noteId), eq(savedNotes.userId, userId)));
  }

  async getUserSavedNotes(userId: string): Promise<Note[]> {
    const result = await db
      .select({ note: notes })
      .from(savedNotes)
      .leftJoin(notes, eq(savedNotes.noteId, notes.id))
      .where(eq(savedNotes.userId, userId))
      .orderBy(desc(savedNotes.savedAt));

    return result.map(row => row.note).filter(Boolean) as Note[];
  }

  async isNoteSaved(noteId: number, userId: string): Promise<boolean> {
    const [saved] = await db
      .select()
      .from(savedNotes)
      .where(and(eq(savedNotes.noteId, noteId), eq(savedNotes.userId, userId)));
    return !!saved;
  }

  // Admin operations
  async createAdvertisement(ad: InsertAdvertisement, createdBy: string): Promise<Advertisement> {
    const [newAd] = await db
      .insert(advertisements)
      .values({ ...ad, createdBy })
      .returning();
    return newAd;
  }

  async getAdvertisements(placement?: string): Promise<Advertisement[]> {
    let query = db.select().from(advertisements).where(eq(advertisements.isActive, true));
    
    if (placement) {
      query = query.where(and(eq(advertisements.isActive, true), eq(advertisements.placement, placement)));
    }
    
    return await query.orderBy(desc(advertisements.createdAt));
  }

  async updateAdvertisement(id: number, ad: Partial<InsertAdvertisement>): Promise<void> {
    await db.update(advertisements).set(ad).where(eq(advertisements.id, id));
  }

  async deleteAdvertisement(id: number): Promise<void> {
    await db.delete(advertisements).where(eq(advertisements.id, id));
  }

  // Analytics
  async getTopNotes(limit: number = 10): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .orderBy(desc(notes.totalDownloads))
      .limit(limit);
  }

  async getTrendingNotes(limit: number = 10): Promise<Note[]> {
    // Notes trending based on recent activity (views + downloads in last 7 days)
    return await db
      .select()
      .from(notes)
      .where(sql`${notes.createdAt} > NOW() - INTERVAL '7 days'`)
      .orderBy(desc(sql`${notes.totalViews} + ${notes.totalDownloads}`))
      .limit(limit);
  }

  async getRecentNotes(limit: number = 10): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .orderBy(desc(notes.createdAt))
      .limit(limit);
  }

  async getSubjectStats(): Promise<{ subject: string; count: number }[]> {
    return await db
      .select({
        subject: notes.subject,
        count: count(notes.id),
      })
      .from(notes)
      .groupBy(notes.subject)
      .orderBy(desc(count(notes.id)));
  }
}

export const storage = new DatabaseStorage();
