import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertNoteSchema, insertNoteFileSchema, insertNoteRatingSchema, insertNoteCommentSchema, insertVendorSchema, insertVendorRatingSchema, insertSavedNoteSchema, insertAdvertisementSchema, insertAccommodationSchema, insertAccommodationRoomSchema, insertSavedAccommodationSchema, insertAccommodationVisitSchema, insertAccommodationBookingSchema } from "@shared/schema";
import fs from "fs/promises";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/markdown',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/zip',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log(`[DEBUG] Fetching user for ID: ${userId}, claims:`, req.user.claims);
      const user = await storage.getUser(userId);
      console.log(`[DEBUG] User fetched from database:`, user);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Notes routes
  app.get('/api/notes', async (req, res) => {
    try {
      const filters = {
        subject: req.query.subject as string,
        university: req.query.university as string,
        contentType: req.query.contentType as string,
        searchTerm: req.query.search as string,
        limit: parseInt(req.query.limit as string) || 20,
        offset: parseInt(req.query.offset as string) || 0,
        sortBy: req.query.sortBy as 'popular' | 'recent' | 'rating' || 'recent',
      };
      
      const result = await storage.getNotes(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get('/api/notes/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNoteWithDetails(id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      // Increment view count
      await storage.updateNoteViews(id);
      
      res.json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post('/api/notes', isAuthenticated, upload.array('files'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteData = insertNoteSchema.parse(req.body);
      
      // Create the note
      const note = await storage.createNote(noteData, userId);
      
      // Handle file uploads
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileData = {
            noteId: note.id,
            fileName: file.filename,
            originalName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            fileUrl: `/uploads/${file.filename}`,
          };
          
          await storage.addNoteFile(fileData);
        }
      }
      
      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.delete('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const success = await storage.deleteNote(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Note not found or unauthorized" });
      }
      
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  app.post('/api/notes/:id/download', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateNoteDownloads(id);
      res.json({ message: "Download recorded" });
    } catch (error) {
      console.error("Error recording download:", error);
      res.status(500).json({ message: "Failed to record download" });
    }
  });

  // Note ratings routes
  app.get('/api/notes/:id/ratings', async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const ratings = await storage.getNoteRatings(noteId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  app.post('/api/notes/:id/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const ratingData = insertNoteRatingSchema.parse({ ...req.body, noteId, userId });
      
      // Check if user already rated this note
      const existingRating = await storage.getUserNoteRating(noteId, userId);
      
      if (existingRating) {
        await storage.updateNoteRating(existingRating.id, ratingData.rating, ratingData.review || undefined);
        res.json({ message: "Rating updated successfully" });
      } else {
        const rating = await storage.addNoteRating(ratingData);
        res.status(201).json(rating);
      }
    } catch (error) {
      console.error("Error adding rating:", error);
      res.status(500).json({ message: "Failed to add rating" });
    }
  });

  // Note comments routes
  app.get('/api/notes/:id/comments', async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const comments = await storage.getNoteComments(noteId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/notes/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const commentData = insertNoteCommentSchema.parse({ ...req.body, noteId, userId });
      
      const comment = await storage.addNoteComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Saved notes routes
  app.get('/api/saved-notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedNotes = await storage.getUserSavedNotes(userId);
      res.json(savedNotes);
    } catch (error) {
      console.error("Error fetching saved notes:", error);
      res.status(500).json({ message: "Failed to fetch saved notes" });
    }
  });

  app.post('/api/notes/:id/save', isAuthenticated, async (req: any, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const savedNote = await storage.saveNote({ noteId, userId });
      res.status(201).json(savedNote);
    } catch (error) {
      console.error("Error saving note:", error);
      res.status(500).json({ message: "Failed to save note" });
    }
  });

  app.delete('/api/notes/:id/save', isAuthenticated, async (req: any, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.unsaveNote(noteId, userId);
      res.json({ message: "Note unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving note:", error);
      res.status(500).json({ message: "Failed to unsave note" });
    }
  });

  app.get('/api/notes/:id/saved', isAuthenticated, async (req: any, res) => {
    try {
      const noteId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const isSaved = await storage.isNoteSaved(noteId, userId);
      res.json({ isSaved });
    } catch (error) {
      console.error("Error checking saved status:", error);
      res.status(500).json({ message: "Failed to check saved status" });
    }
  });

  // Vendors routes
  app.get('/api/vendors', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        searchTerm: req.query.search as string,
        limit: parseInt(req.query.limit as string) || 20,
        offset: parseInt(req.query.offset as string) || 0,
      };
      
      const result = await storage.getVendors(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get('/api/vendors/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vendor = await storage.getVendorById(id);
      
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      
      res.json(vendor);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.post('/api/vendors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const vendorData = insertVendorSchema.parse(req.body);
      
      const vendor = await storage.createVendor(vendorData, userId);
      res.status(201).json(vendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  app.put('/api/vendors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const vendorData = insertVendorSchema.partial().parse(req.body);
      
      const success = await storage.updateVendor(id, vendorData, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Vendor not found or unauthorized" });
      }
      
      res.json({ message: "Vendor updated successfully" });
    } catch (error) {
      console.error("Error updating vendor:", error);
      res.status(500).json({ message: "Failed to update vendor" });
    }
  });

  // Vendor ratings routes
  app.get('/api/vendors/:id/ratings', async (req, res) => {
    try {
      const vendorId = parseInt(req.params.id);
      const ratings = await storage.getVendorRatings(vendorId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching vendor ratings:", error);
      res.status(500).json({ message: "Failed to fetch vendor ratings" });
    }
  });

  app.post('/api/vendors/:id/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const vendorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const ratingData = insertVendorRatingSchema.parse({ ...req.body, vendorId, userId });
      
      const rating = await storage.addVendorRating(ratingData);
      res.status(201).json(rating);
    } catch (error) {
      console.error("Error adding vendor rating:", error);
      res.status(500).json({ message: "Failed to add vendor rating" });
    }
  });

  // Accommodations routes
  app.get('/api/accommodations', async (req, res) => {
    try {
      const filters: {
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
      } = {
        college: req.query.college as string,
        distance: req.query.distance ? parseInt(req.query.distance as string) : undefined,
        accommodationType: req.query.accommodationType as string,
        genderPreference: req.query.genderPreference as string,
        roomType: req.query.roomType as string,
        rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
        searchTerm: req.query.search as string,
        limit: parseInt(req.query.limit as string) || 20,
        offset: parseInt(req.query.offset as string) || 0,
        sortBy: req.query.sortBy as string || 'recent',
      };

      // Parse amenities array
      if (req.query.amenities) {
        if (Array.isArray(req.query.amenities)) {
          filters.amenities = req.query.amenities as string[];
        } else {
          filters.amenities = [req.query.amenities as string];
        }
      }

      // Parse price range
      if (req.query.minPrice || req.query.maxPrice) {
        filters.priceRange = {};
        if (req.query.minPrice) {
          filters.priceRange.min = parseFloat(req.query.minPrice as string);
        }
        if (req.query.maxPrice) {
          filters.priceRange.max = parseFloat(req.query.maxPrice as string);
        }
      }

      const result = await storage.getAccommodations(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      res.status(500).json({ message: "Failed to fetch accommodations" });
    }
  });

  app.get('/api/accommodations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const accommodation = await storage.getAccommodationById(id);
      
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      
      res.json(accommodation);
    } catch (error) {
      console.error("Error fetching accommodation:", error);
      res.status(500).json({ message: "Failed to fetch accommodation" });
    }
  });

  app.post('/api/accommodations', isAuthenticated, async (req: any, res) => {
    try {
      const accommodationData = insertAccommodationSchema.parse(req.body);
      const accommodation = await storage.createAccommodation(accommodationData);
      res.status(201).json(accommodation);
    } catch (error) {
      console.error("Error creating accommodation:", error);
      res.status(500).json({ message: "Failed to create accommodation" });
    }
  });

  app.post('/api/accommodations/:id/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const accommodationId = parseInt(req.params.id);
      const roomData = insertAccommodationRoomSchema.parse({ ...req.body, accommodationId });
      const room = await storage.createAccommodationRoom(roomData);
      res.status(201).json(room);
    } catch (error) {
      console.error("Error creating accommodation room:", error);
      res.status(500).json({ message: "Failed to create accommodation room" });
    }
  });

  // Saved accommodations routes
  app.get('/api/saved-accommodations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedAccommodations = await storage.getUserSavedAccommodations(userId);
      res.json(savedAccommodations);
    } catch (error) {
      console.error("Error fetching saved accommodations:", error);
      res.status(500).json({ message: "Failed to fetch saved accommodations" });
    }
  });

  app.post('/api/accommodations/:id/save', isAuthenticated, async (req: any, res) => {
    try {
      const accommodationId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const savedAccommodation = await storage.saveAccommodation({ accommodationId, userId });
      res.status(201).json(savedAccommodation);
    } catch (error) {
      console.error("Error saving accommodation:", error);
      res.status(500).json({ message: "Failed to save accommodation" });
    }
  });

  app.delete('/api/accommodations/:id/save', isAuthenticated, async (req: any, res) => {
    try {
      const accommodationId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.unsaveAccommodation(accommodationId, userId);
      res.json({ message: "Accommodation unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving accommodation:", error);
      res.status(500).json({ message: "Failed to unsave accommodation" });
    }
  });

  // Accommodation visits and bookings routes
  app.post('/api/accommodations/visits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const visitData = insertAccommodationVisitSchema.parse({ ...req.body, userId });
      
      const visit = await storage.scheduleAccommodationVisit(visitData);
      res.status(201).json(visit);
    } catch (error) {
      console.error("Error scheduling accommodation visit:", error);
      res.status(500).json({ message: "Failed to schedule accommodation visit" });
    }
  });

  app.post('/api/accommodations/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertAccommodationBookingSchema.parse({ ...req.body, userId });
      
      const booking = await storage.bookAccommodation(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error booking accommodation:", error);
      res.status(500).json({ message: "Failed to book accommodation" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/trending', async (req, res) => {
    try {
      const trendingNotes = await storage.getTrendingNotes(10);
      res.json(trendingNotes);
    } catch (error) {
      console.error("Error fetching trending notes:", error);
      res.status(500).json({ message: "Failed to fetch trending notes" });
    }
  });

  app.get('/api/analytics/top-notes', async (req, res) => {
    try {
      const topNotes = await storage.getTopNotes(10);
      res.json(topNotes);
    } catch (error) {
      console.error("Error fetching top notes:", error);
      res.status(500).json({ message: "Failed to fetch top notes" });
    }
  });

  app.get('/api/analytics/recent', async (req, res) => {
    try {
      const recentNotes = await storage.getRecentNotes(10);
      res.json(recentNotes);
    } catch (error) {
      console.error("Error fetching recent notes:", error);
      res.status(500).json({ message: "Failed to fetch recent notes" });
    }
  });

  app.get('/api/analytics/subjects', async (req, res) => {
    try {
      const subjectStats = await storage.getSubjectStats();
      res.json(subjectStats);
    } catch (error) {
      console.error("Error fetching subject stats:", error);
      res.status(500).json({ message: "Failed to fetch subject stats" });
    }
  });

  // Admin routes
  app.get('/api/admin/advertisements', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const placement = req.query.placement as string;
      const ads = await storage.getAdvertisements(placement);
      res.json(ads);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });

  app.post('/api/admin/advertisements', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const adData = insertAdvertisementSchema.parse(req.body);
      const ad = await storage.createAdvertisement(adData, req.user.claims.sub);
      res.status(201).json(ad);
    } catch (error) {
      console.error("Error creating advertisement:", error);
      res.status(500).json({ message: "Failed to create advertisement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
