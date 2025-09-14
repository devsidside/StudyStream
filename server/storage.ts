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
  accommodations,
  accommodationRooms,
  savedAccommodations,
  accommodationVisits,
  accommodationBookings,
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
  type InsertAccommodation,
  type Accommodation,
  type InsertAccommodationRoom,
  type AccommodationRoom,
  type InsertSavedAccommodation,
  type SavedAccommodation,
  type InsertAccommodationVisit,
  type AccommodationVisit,
  type InsertAccommodationBooking,
  type AccommodationBooking,
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

  // Accommodation operations
  getAccommodations(filters?: {
    college?: string;
    distance?: number;
    accommodationType?: string;
    genderPreference?: string;
    amenities?: string[];
    priceRange?: { min?: number; max?: number };
    roomType?: string;
    rating?: number;
    searchTerm?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
  }): Promise<{ accommodations: any[]; total: number }>;
  getAccommodationById(id: number): Promise<any>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  createAccommodationRoom(room: InsertAccommodationRoom): Promise<AccommodationRoom>;
  
  // Accommodation booking operations
  saveAccommodation(savedAccommodation: InsertSavedAccommodation): Promise<SavedAccommodation>;
  unsaveAccommodation(accommodationId: number, userId: string): Promise<void>;
  getUserSavedAccommodations(userId: string): Promise<any[]>;
  scheduleAccommodationVisit(visit: InsertAccommodationVisit): Promise<AccommodationVisit>;
  bookAccommodation(booking: InsertAccommodationBooking): Promise<AccommodationBooking>;

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

// Category mapping for vendor categories
const mapCategory = (category?: string) => {
  const categoryMap = {
    'hostels': 'accommodation',
    'tutors': 'tutoring', 
    'events': 'entertainment',
    'books': 'shopping',
    'cafes': 'food',
    'fitness': 'services'
  } as const;
  return categoryMap[category?.toLowerCase() as keyof typeof categoryMap] || category;
};

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

    let query = db.select().from(notes) as any;
    let countQuery = db.select({ count: count(notes.id) }).from(notes) as any;

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
      query = query.where(whereCondition) as any;
      countQuery = countQuery.where(whereCondition) as any;
    }

    // Apply sorting
    if (filters?.sortBy === 'popular') {
      query = query.orderBy(desc(notes.totalDownloads)) as any;
    } else if (filters?.sortBy === 'rating') {
      query = query.orderBy(desc(notes.averageRating)) as any;
    } else {
      query = query.orderBy(desc(notes.createdAt)) as any;
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
      .select()
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
      .select()
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

    let query = db.select().from(vendors) as any;
    let countQuery = db.select({ count: count(vendors.id) }).from(vendors) as any;

    const conditions = [eq(vendors.isActive, true)];
    
    if (filters?.category) {
      const mappedCategory = mapCategory(filters.category);
      conditions.push(eq(vendors.category, mappedCategory as any));
    }
    
    if (filters?.searchTerm) {
      conditions.push(
        or(
          like(vendors.name, `%${filters.searchTerm}%`),
          like(vendors.description, `%${filters.searchTerm}%`)
        )!
      );
    }

    const whereCondition = and(...conditions);
    query = query.where(whereCondition) as any;
    countQuery = countQuery.where(whereCondition) as any;

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
      .select()
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
    let query = db.select().from(advertisements).where(eq(advertisements.isActive, true)) as any;
    
    if (placement) {
      query = query.where(and(eq(advertisements.isActive, true), eq(advertisements.placement, placement))) as any;
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

  // Accommodation operations
  async getAccommodations(filters?: {
    college?: string;
    distance?: number;
    accommodationType?: string;
    genderPreference?: string;
    amenities?: string[];
    priceRange?: { min?: number; max?: number };
    roomType?: string;
    rating?: number;
    searchTerm?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
  }): Promise<{ accommodations: any[]; total: number }> {
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;

    // Build base query with joins
    let query = db
      .select({
        accommodation: accommodations,
        vendor: vendors,
        rooms: accommodationRooms,
      })
      .from(accommodations)
      .leftJoin(vendors, eq(accommodations.vendorId, vendors.id))
      .leftJoin(accommodationRooms, eq(accommodations.id, accommodationRooms.accommodationId));

    let countQuery = db
      .select({ count: sql`count(distinct ${accommodations.id})`.as('count') })
      .from(accommodations)
      .leftJoin(vendors, eq(accommodations.vendorId, vendors.id))
      .leftJoin(accommodationRooms, eq(accommodations.id, accommodationRooms.accommodationId)) as any;

    const conditions = [eq(vendors.isActive, true)];

    // Apply filters
    if (filters?.college) {
      conditions.push(like(accommodations.collegeName, `%${filters.college}%`));
    }

    if (filters?.distance && typeof filters.distance === 'number') {
      conditions.push(sql`${accommodations.distanceFromCollege} <= ${filters.distance}`);
    }

    if (filters?.accommodationType) {
      conditions.push(eq(accommodations.accommodationType, filters.accommodationType as any));
    }

    if (filters?.genderPreference) {
      conditions.push(eq(accommodations.genderPreference, filters.genderPreference as any));
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      // Check if accommodation has all required amenities
      conditions.push(
        sql`${accommodations.amenities} @> ARRAY[${filters.amenities.join(',')}]`
      );
    }

    if (filters?.roomType) {
      conditions.push(eq(accommodationRooms.roomType, filters.roomType as any));
    }

    if (filters?.priceRange?.min || filters?.priceRange?.max) {
      if (filters.priceRange.min) {
        conditions.push(sql`${accommodationRooms.pricePerMonth} >= ${filters.priceRange.min}`);
      }
      if (filters.priceRange.max) {
        conditions.push(sql`${accommodationRooms.pricePerMonth} <= ${filters.priceRange.max}`);
      }
    }

    if (filters?.rating && typeof filters.rating === 'number') {
      conditions.push(sql`CAST(${vendors.averageRating} AS NUMERIC) >= ${filters.rating}`);
    }

    if (filters?.searchTerm) {
      conditions.push(
        or(
          like(vendors.name, `%${filters.searchTerm}%`),
          like(vendors.description, `%${filters.searchTerm}%`),
          like(accommodations.collegeName, `%${filters.searchTerm}%`)
        )!
      );
    }

    if (conditions.length > 0) {
      const whereCondition = and(...conditions);
      query = query.where(whereCondition) as any;
      countQuery = countQuery.where(whereCondition) as any;
    }

    // Apply sorting
    if (filters?.sortBy === 'price-low') {
      query = query.orderBy(asc(accommodationRooms.pricePerMonth)) as any;
    } else if (filters?.sortBy === 'price-high') {
      query = query.orderBy(desc(accommodationRooms.pricePerMonth)) as any;
    } else if (filters?.sortBy === 'rating') {
      query = query.orderBy(desc(vendors.averageRating)) as any;
    } else if (filters?.sortBy === 'distance') {
      query = query.orderBy(asc(accommodations.distanceFromCollege)) as any;
    } else {
      query = query.orderBy(desc(accommodations.createdAt)) as any;
    }

    const [accommodationsResult, totalResult] = await Promise.all([
      query.limit(limit).offset(offset),
      countQuery
    ]);

    // Group results by accommodation
    const accommodationMap = new Map();
    accommodationsResult.forEach(row => {
      if (!accommodationMap.has(row.accommodation.id)) {
        accommodationMap.set(row.accommodation.id, {
          ...row.accommodation,
          vendor: row.vendor,
          rooms: []
        });
      }
      if (row.rooms) {
        const accommodation = accommodationMap.get(row.accommodation.id);
        accommodation.rooms.push(row.rooms);
      }
    });

    return {
      accommodations: Array.from(accommodationMap.values()),
      total: totalResult[0]?.count || 0
    };
  }

  async getAccommodationById(id: number): Promise<any> {
    const result = await db
      .select({
        accommodation: accommodations,
        vendor: vendors,
        rooms: accommodationRooms,
      })
      .from(accommodations)
      .leftJoin(vendors, eq(accommodations.vendorId, vendors.id))
      .leftJoin(accommodationRooms, eq(accommodations.id, accommodationRooms.accommodationId))
      .where(eq(accommodations.id, id));

    if (result.length === 0) return undefined;

    const accommodation = result[0].accommodation;
    const vendor = result[0].vendor;
    const rooms = result
      .filter(row => row.rooms)
      .map(row => row.rooms);

    return { ...accommodation, vendor, rooms };
  }

  async createAccommodation(accommodationData: InsertAccommodation): Promise<Accommodation> {
    const [newAccommodation] = await db
      .insert(accommodations)
      .values(accommodationData)
      .returning();
    return newAccommodation;
  }

  async createAccommodationRoom(roomData: InsertAccommodationRoom): Promise<AccommodationRoom> {
    const [newRoom] = await db
      .insert(accommodationRooms)
      .values(roomData)
      .returning();
    return newRoom;
  }

  // Accommodation booking operations
  async saveAccommodation(savedAccommodationData: InsertSavedAccommodation): Promise<SavedAccommodation> {
    const [savedAccommodation] = await db
      .insert(savedAccommodations)
      .values(savedAccommodationData)
      .returning();
    return savedAccommodation;
  }

  async unsaveAccommodation(accommodationId: number, userId: string): Promise<void> {
    await db
      .delete(savedAccommodations)
      .where(and(
        eq(savedAccommodations.accommodationId, accommodationId),
        eq(savedAccommodations.userId, userId)
      ));
  }

  async getUserSavedAccommodations(userId: string): Promise<any[]> {
    const result = await db
      .select({
        accommodation: accommodations,
        vendor: vendors,
        rooms: accommodationRooms,
        savedAt: savedAccommodations.savedAt,
      })
      .from(savedAccommodations)
      .leftJoin(accommodations, eq(savedAccommodations.accommodationId, accommodations.id))
      .leftJoin(vendors, eq(accommodations.vendorId, vendors.id))
      .leftJoin(accommodationRooms, eq(accommodations.id, accommodationRooms.accommodationId))
      .where(eq(savedAccommodations.userId, userId))
      .orderBy(desc(savedAccommodations.savedAt));

    // Group results by accommodation
    const accommodationMap = new Map();
    result.forEach(row => {
      if (!accommodationMap.has(row.accommodation?.id)) {
        accommodationMap.set(row.accommodation?.id, {
          ...row.accommodation,
          vendor: row.vendor,
          savedAt: row.savedAt,
          rooms: []
        });
      }
      if (row.rooms) {
        const accommodation = accommodationMap.get(row.accommodation?.id);
        accommodation.rooms.push(row.rooms);
      }
    });

    return Array.from(accommodationMap.values()).filter(acc => acc.id);
  }

  async scheduleAccommodationVisit(visitData: InsertAccommodationVisit): Promise<AccommodationVisit> {
    const [visit] = await db
      .insert(accommodationVisits)
      .values(visitData)
      .returning();
    return visit;
  }

  async bookAccommodation(bookingData: InsertAccommodationBooking): Promise<AccommodationBooking> {
    const [booking] = await db
      .insert(accommodationBookings)
      .values(bookingData)
      .returning();
    
    // Update room availability
    await db
      .update(accommodationRooms)
      .set({
        availableRooms: sql`${accommodationRooms.availableRooms} - 1`
      })
      .where(eq(accommodationRooms.id, bookingData.accommodationRoomId));

    // Update accommodation availability
    await db
      .update(accommodations)
      .set({
        availableRooms: sql`${accommodations.availableRooms} - 1`
      })
      .where(eq(accommodations.id, bookingData.accommodationId));

    return booking;
  }
}

// In-memory storage with sample data for demo purposes
class MemStorage implements IStorage {
  private vendorData = [
    // NOTES
    {
      id: 1,
      name: "Data Structures Complete Notes",
      description: "Complete coverage: Arrays, Trees, Graphs with examples. Perfect for final exams and interview preparation.",
      category: "services",
      priceRange: "free",
      averageRating: "4.9",
      totalRatings: 156,
      isVerified: true,
      createdAt: new Date('2024-09-12'),
      updatedAt: new Date('2024-09-12')
    },
    {
      id: 2,
      name: "Complete Physics Notes Package",
      description: "JEE/NEET/Boards complete coverage. 500+ solved examples. Video explanations included.",
      category: "services",
      priceRange: "mid-range",
      averageRating: "4.7",
      totalRatings: 445,
      isVerified: true,
      createdAt: new Date('2024-09-10'),
      updatedAt: new Date('2024-09-14')
    },
    
    // HOSTELS
    {
      id: 3,
      name: "Green Valley Boys Hostel",
      description: "Single/Double rooms available. 24/7 security. Near campus facilities. Good food quality.",
      category: "accommodation",
      address: "500m from IIT Gate",
      priceRange: "budget",
      averageRating: "4.2",
      totalRatings: 89,
      isVerified: true,
      createdAt: new Date('2024-08-15'),
      updatedAt: new Date('2024-09-01')
    },
    {
      id: 4,
      name: "Campus Residences Premium PG",
      description: "Fully furnished AC rooms. WiFi included. Mess facilities. Study room available.",
      category: "accommodation",
      address: "Near NIT Campus",
      priceRange: "premium",
      averageRating: "4.6",
      totalRatings: 124,
      isVerified: true,
      createdAt: new Date('2024-07-20'),
      updatedAt: new Date('2024-09-05')
    },
    
    // TUTORS
    {
      id: 5,
      name: "Prof. Kumar - Mathematics Expert",
      description: "Specializes in JEE Advanced, Olympiads, College Math. 500+ students taught. 95% success rate.",
      category: "tutoring",
      priceRange: "mid-range",
      averageRating: "4.9",
      totalRatings: 234,
      isVerified: true,
      phone: "+91-9876543210",
      email: "prof.kumar@tutoring.com",
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-09-10')
    },
    {
      id: 6,
      name: "Dr. Priya - Computer Science Mentor",
      description: "FAANG experience. DSA, System Design, Interview Prep. Online and Offline classes.",
      category: "tutoring",
      priceRange: "premium",
      averageRating: "4.8",
      totalRatings: 178,
      isVerified: true,
      email: "dr.priya@techmentor.com",
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-09-08')
    },
    
    // EVENTS
    {
      id: 7,
      name: "Tech Workshop: AI & Machine Learning",
      description: "Build your first AI model. Industry expert speakers. Certificate provided. Networking opportunities.",
      category: "entertainment",
      address: "NIT Campus Auditorium",
      priceRange: "free",
      averageRating: "4.8",
      totalRatings: 67,
      isVerified: true,
      createdAt: new Date('2024-09-13'),
      updatedAt: new Date('2024-09-13')
    },
    {
      id: 8,
      name: "Annual Tech Fest - CodeMania 2024",
      description: "3-day coding competition. Hackathons, workshops, and networking sessions.",
      category: "entertainment",
      address: "IIT Delhi Convention Center",
      priceRange: "budget",
      averageRating: "4.7",
      totalRatings: 892,
      isVerified: true,
      website: "https://codemania2024.com",
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-09-01')
    },
    
    // CAFES
    {
      id: 9,
      name: "Campus Café & Study Space",
      description: "Great coffee & snacks. Quiet study environment. Power outlets at every table.",
      category: "food",
      address: "Main Campus Building",
      priceRange: "budget",
      averageRating: "4.3",
      totalRatings: 124,
      isVerified: true,
      phone: "+91-9876543211",
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-09-12')
    },
    {
      id: 10,
      name: "BookWorm Café",
      description: "Library café combo. Silent zones available. Free WiFi and charging points.",
      category: "food",
      address: "University Library Ground Floor",
      priceRange: "budget",
      averageRating: "4.1",
      totalRatings: 89,
      isVerified: true,
      createdAt: new Date('2024-06-15'),
      updatedAt: new Date('2024-09-05')
    },
    
    // FOOD
    {
      id: 11,
      name: "Healthy Bites Tiffin Service",
      description: "Home-cooked meals delivered fresh. Customizable meal plans. Hygienic preparation.",
      category: "food",
      priceRange: "budget",
      averageRating: "4.4",
      totalRatings: 167,
      isVerified: true,
      phone: "+91-9876543212",
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-09-10')
    },
    
    // TRANSPORT
    {
      id: 12,
      name: "Campus Shuttle Service",
      description: "Regular shuttle between hostels and campus. Safe and reliable transportation.",
      category: "transport",
      priceRange: "budget",
      averageRating: "4.0",
      totalRatings: 203,
      isVerified: true,
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-09-01')
    },
    
    // FITNESS
    {
      id: 13,
      name: "FitZone Campus Gym",
      description: "Modern equipment. Personal training available. Student discounts offered.",
      category: "services",
      address: "Campus Recreation Center",
      priceRange: "budget",
      averageRating: "4.2",
      totalRatings: 156,
      isVerified: true,
      phone: "+91-9876543213",
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2024-09-08')
    },
    
    // BOOKS
    {
      id: 14,
      name: "Academic Books Exchange",
      description: "Buy, sell, and rent textbooks. Wide collection of reference materials.",
      category: "shopping",
      address: "Near Main Gate",
      priceRange: "budget",
      averageRating: "4.3",
      totalRatings: 98,
      isVerified: true,
      email: "books@exchange.com",
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-09-12')
    }
  ];

  // Vendor operations
  async createVendor(vendor: InsertVendor, ownerId: string): Promise<Vendor> {
    const newVendor: Vendor = {
      id: this.vendorData.length + 1,
      ...vendor,
      ownerId,
      email: vendor.email || null,
      phone: vendor.phone || null,
      address: vendor.address || null,
      latitude: vendor.latitude || null,
      longitude: vendor.longitude || null,
      website: vendor.website || null,
      averageRating: vendor.averageRating || "0",
      totalRatings: vendor.totalRatings || 0,
      isVerified: vendor.isVerified || false,
      isActive: vendor.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.vendorData.push(newVendor);
    return newVendor;
  }

  async getVendors(filters?: {
    category?: string;
    searchTerm?: string;
    location?: { lat: number; lng: number; radius: number };
    limit?: number;
    offset?: number;
  }): Promise<{ vendors: Vendor[]; total: number }> {
    let filtered = [...this.vendorData];

    // Apply filters
    if (filters?.category) {
      filtered = filtered.filter(v => v.category === filters.category);
    }
    
    if (filters?.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(search) ||
        v.description?.toLowerCase().includes(search) ||
        v.category.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    
    // Apply pagination
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 20;
    const paginatedVendors = filtered.slice(offset, offset + limit);

    return { vendors: paginatedVendors, total };
  }

  async getVendorById(id: number): Promise<Vendor | undefined> {
    return this.vendorData.find(v => v.id === id);
  }

  async updateVendor(id: number, vendor: Partial<InsertVendor>, userId: string): Promise<boolean> {
    const index = this.vendorData.findIndex(v => v.id === id);
    if (index === -1) return false;
    
    this.vendorData[index] = { ...this.vendorData[index], ...vendor, updatedAt: new Date() };
    return true;
  }

  async deleteVendor(id: number, userId: string): Promise<boolean> {
    const index = this.vendorData.findIndex(v => v.id === id);
    if (index === -1) return false;
    
    this.vendorData.splice(index, 1);
    return true;
  }

  // Vendor rating operations
  async addVendorRating(rating: InsertVendorRating): Promise<VendorRating> {
    return {
      id: Math.floor(Math.random() * 10000),
      ...rating,
      createdAt: new Date(),
      updatedAt: new Date()
    } as VendorRating;
  }

  async getVendorRatings(vendorId: number): Promise<VendorRating[]> {
    return [];
  }

  // Accommodation operations - placeholder implementations for demo
  async getAccommodations(filters?: {
    college?: string;
    distance?: number;
    accommodationType?: string;
    genderPreference?: string;
    amenities?: string[];
    priceRange?: { min?: number; max?: number };
    roomType?: string;
    rating?: number;
    searchTerm?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
  }): Promise<{ accommodations: any[]; total: number }> {
    // Return empty for demo
    return { accommodations: [], total: 0 };
  }

  async getAccommodationById(id: number): Promise<any> {
    return undefined;
  }

  async createAccommodation(accommodationData: InsertAccommodation): Promise<Accommodation> {
    throw new Error('Not implemented in demo');
  }

  async createAccommodationRoom(roomData: InsertAccommodationRoom): Promise<AccommodationRoom> {
    throw new Error('Not implemented in demo');
  }

  async saveAccommodation(savedAccommodationData: InsertSavedAccommodation): Promise<SavedAccommodation> {
    throw new Error('Not implemented in demo');
  }

  async unsaveAccommodation(accommodationId: number, userId: string): Promise<void> {
    // No-op for demo
  }

  async getUserSavedAccommodations(userId: string): Promise<any[]> {
    return [];
  }

  async scheduleAccommodationVisit(visitData: InsertAccommodationVisit): Promise<AccommodationVisit> {
    throw new Error('Not implemented in demo');
  }

  async bookAccommodation(bookingData: InsertAccommodationBooking): Promise<AccommodationBooking> {
    throw new Error('Not implemented in demo');
  }

  // All other methods - placeholder implementations for demo
  async getUser(id: string): Promise<User | undefined> { return undefined; }
  async upsertUser(user: UpsertUser): Promise<User> { throw new Error('Not implemented in demo'); }
  async createNote(note: InsertNote, uploaderId: string): Promise<Note> { throw new Error('Not implemented in demo'); }
  async getNotes(filters?: {
    subject?: string;
    university?: string;
    contentType?: string;
    searchTerm?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'popular' | 'recent' | 'rating';
  }): Promise<{ notes: Note[]; total: number }> { return { notes: [], total: 0 }; }
  async getNoteById(id: number): Promise<Note | undefined> { return undefined; }
  async getNoteWithDetails(id: number): Promise<any> { return null; }
  async updateNoteViews(id: number): Promise<void> {}
  async updateNoteDownloads(id: number): Promise<void> {}
  async deleteNote(id: number, userId: string): Promise<boolean> { return false; }
  async addNoteFile(file: InsertNoteFile): Promise<NoteFile> { throw new Error('Not implemented in demo'); }
  async getNoteFiles(noteId: number): Promise<NoteFile[]> { return []; }
  async deleteNoteFile(id: number): Promise<void> {}
  async addNoteRating(rating: InsertNoteRating): Promise<NoteRating> { throw new Error('Not implemented in demo'); }
  async getNoteRatings(noteId: number): Promise<NoteRating[]> { return []; }
  async getUserNoteRating(noteId: number, userId: string): Promise<NoteRating | undefined> { return undefined; }
  async updateNoteRating(id: number, rating: number, review?: string): Promise<void> {}
  async addNoteComment(comment: InsertNoteComment): Promise<NoteComment> { throw new Error('Not implemented in demo'); }
  async getNoteComments(noteId: number): Promise<NoteComment[]> { return []; }
  async saveNote(savedNote: InsertSavedNote): Promise<SavedNote> { throw new Error('Not implemented in demo'); }
  async unsaveNote(noteId: number, userId: string): Promise<void> {}
  async getUserSavedNotes(userId: string): Promise<Note[]> { return []; }
  async isNoteSaved(noteId: number, userId: string): Promise<boolean> { return false; }
  async createAdvertisement(ad: InsertAdvertisement, createdBy: string): Promise<Advertisement> { throw new Error('Not implemented in demo'); }
  async getAdvertisements(placement?: string): Promise<Advertisement[]> { return []; }
  async updateAdvertisement(id: number, ad: Partial<InsertAdvertisement>): Promise<void> {}
  async deleteAdvertisement(id: number): Promise<void> {}
  async getTopNotes(limit?: number): Promise<Note[]> { return []; }
  async getTrendingNotes(limit?: number): Promise<Note[]> { return []; }
  async getRecentNotes(limit?: number): Promise<Note[]> { return []; }
  async getSubjectStats(): Promise<{ subject: string; count: number }[]> { return []; }
}

// Use MemStorage for demo when database is not available
let storageInstance: IStorage;
try {
  storageInstance = new DatabaseStorage();
} catch (error) {
  console.log('Database not available, using MemStorage for demo');
  storageInstance = new MemStorage();
}

export const storage = new MemStorage();
