import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sanitizePlainText, validateContentSafety } from "./sanitizer";
import { insertNoteSchema, insertNoteFileSchema, insertNoteRatingSchema, insertNoteCommentSchema, insertVendorSchema, insertVendorRatingSchema, insertSavedNoteSchema, insertAdvertisementSchema, insertAccommodationSchema, insertAccommodationRoomSchema, insertSavedAccommodationSchema, insertAccommodationVisitSchema, insertAccommodationBookingSchema, insertTutorSchema, insertTutorRatingSchema, insertTutorSessionSchema, insertTutorAvailabilitySlotSchema, insertSavedTutorSchema, type TutorSearchFilters } from "@shared/schema";
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
      
      // Sanitize review content if provided
      const review = req.body.review;
      if (review && !validateContentSafety(review)) {
        return res.status(400).json({ message: "Review contains potentially dangerous elements" });
      }
      
      const sanitizedReview = review ? sanitizePlainText(review) : review;
      const ratingData = insertNoteRatingSchema.parse({ 
        ...req.body, 
        review: sanitizedReview,
        noteId, 
        userId 
      });
      
      // Check if user already rated this note
      const existingRating = await storage.getUserNoteRating(noteId, userId);
      
      if (existingRating) {
        await storage.updateNoteRating(existingRating.id, ratingData.rating, sanitizedReview || undefined);
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
      
      // Sanitize content before validation
      const content = req.body.content;
      if (content && !validateContentSafety(content)) {
        return res.status(400).json({ message: "Content contains potentially dangerous elements" });
      }
      
      const sanitizedContent = content ? sanitizePlainText(content) : content;
      const commentData = insertNoteCommentSchema.parse({ 
        ...req.body, 
        content: sanitizedContent,
        noteId, 
        userId 
      });
      
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
      
      // Sanitize review content if provided
      const review = req.body.review;
      if (review && !validateContentSafety(review)) {
        return res.status(400).json({ message: "Review contains potentially dangerous elements" });
      }
      
      const sanitizedReview = review ? sanitizePlainText(review) : review;
      const ratingData = insertVendorRatingSchema.parse({ 
        ...req.body, 
        review: sanitizedReview,
        vendorId, 
        userId 
      });
      
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

  // Tutors routes
  app.get('/api/tutors', async (req, res) => {
    try {
      const filters: TutorSearchFilters = {
        subjects: req.query.subjects ? (Array.isArray(req.query.subjects) ? req.query.subjects as string[] : [req.query.subjects as string]) : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        mode: req.query.mode ? (Array.isArray(req.query.mode) ? req.query.mode as any[] : [req.query.mode as any]) : undefined,
        availability: req.query.availability ? (Array.isArray(req.query.availability) ? req.query.availability as any[] : [req.query.availability as any]) : undefined,
        specializations: req.query.specializations ? (Array.isArray(req.query.specializations) ? req.query.specializations as any[] : [req.query.specializations as any]) : undefined,
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
        institutionType: req.query.institutionType ? (Array.isArray(req.query.institutionType) ? req.query.institutionType as any[] : [req.query.institutionType as any]) : undefined,
        languages: req.query.languages ? (Array.isArray(req.query.languages) ? req.query.languages as string[] : [req.query.languages as string]) : undefined,
        isVerified: req.query.isVerified === 'true',
        isFeatured: req.query.isFeatured === 'true',
        query: req.query.search as string,
        sortBy: req.query.sortBy as string || 'rating',
        limit: parseInt(req.query.limit as string) || 20,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const result = await storage.getTutors(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching tutors:", error);
      res.status(500).json({ message: "Failed to fetch tutors" });
    }
  });

  app.get('/api/tutors/categories', async (req, res) => {
    try {
      const categories = await storage.getTutorCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching tutor categories:", error);
      res.status(500).json({ message: "Failed to fetch tutor categories" });
    }
  });

  app.get('/api/tutors/featured', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const tutors = await storage.getFeaturedTutors(limit);
      res.json(tutors);
    } catch (error) {
      console.error("Error fetching featured tutors:", error);
      res.status(500).json({ message: "Failed to fetch featured tutors" });
    }
  });

  app.get('/api/tutors/top-rated', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const tutors = await storage.getTopRatedTutors(limit);
      res.json(tutors);
    } catch (error) {
      console.error("Error fetching top rated tutors:", error);
      res.status(500).json({ message: "Failed to fetch top rated tutors" });
    }
  });

  app.get('/api/tutors/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tutor = await storage.getTutorById(id);
      
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      res.json(tutor);
    } catch (error) {
      console.error("Error fetching tutor:", error);
      res.status(500).json({ message: "Failed to fetch tutor" });
    }
  });

  app.post('/api/tutors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tutorData = insertTutorSchema.parse({ ...req.body, userId });
      
      const tutor = await storage.createTutor(tutorData);
      res.status(201).json(tutor);
    } catch (error) {
      console.error("Error creating tutor:", error);
      res.status(500).json({ message: "Failed to create tutor" });
    }
  });

  app.put('/api/tutors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const tutorData = insertTutorSchema.partial().parse(req.body);
      
      const success = await storage.updateTutor(id, tutorData, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Tutor not found or unauthorized" });
      }
      
      res.json({ message: "Tutor updated successfully" });
    } catch (error) {
      console.error("Error updating tutor:", error);
      res.status(500).json({ message: "Failed to update tutor" });
    }
  });

  app.delete('/api/tutors/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const success = await storage.deleteTutor(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Tutor not found or unauthorized" });
      }
      
      res.json({ message: "Tutor deleted successfully" });
    } catch (error) {
      console.error("Error deleting tutor:", error);
      res.status(500).json({ message: "Failed to delete tutor" });
    }
  });

  // Tutor ratings routes
  app.get('/api/tutors/:id/ratings', async (req, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const ratings = await storage.getTutorRatings(tutorId);
      res.json(ratings);
    } catch (error) {
      console.error("Error fetching tutor ratings:", error);
      res.status(500).json({ message: "Failed to fetch tutor ratings" });
    }
  });

  app.post('/api/tutors/:id/ratings', isAuthenticated, async (req: any, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const ratingData = insertTutorRatingSchema.parse({ ...req.body, tutorId, userId });
      
      // Check if user already rated this tutor
      const existingRating = await storage.getUserTutorRating(tutorId, userId);
      
      if (existingRating) {
        await storage.updateTutorRating(existingRating.id, ratingData.rating, ratingData.review || undefined);
        res.json({ message: "Rating updated successfully" });
      } else {
        const rating = await storage.addTutorRating(ratingData);
        res.status(201).json(rating);
      }
    } catch (error) {
      console.error("Error adding tutor rating:", error);
      res.status(500).json({ message: "Failed to add tutor rating" });
    }
  });

  // Tutor availability slots routes
  app.get('/api/tutors/:id/availability', async (req, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const slots = await storage.getTutorAvailabilitySlots(tutorId);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching tutor availability:", error);
      res.status(500).json({ message: "Failed to fetch tutor availability" });
    }
  });

  app.post('/api/tutors/:id/availability', isAuthenticated, async (req: any, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns this tutor profile
      const tutorProfiles = await storage.getTutorsByUserId(userId);
      const ownsTutor = tutorProfiles.some(t => t.id === tutorId);
      
      if (!ownsTutor) {
        return res.status(403).json({ message: "Unauthorized to modify this tutor's availability" });
      }
      
      const slotData = insertTutorAvailabilitySlotSchema.parse({ ...req.body, tutorId });
      const slot = await storage.addTutorAvailabilitySlot(slotData);
      res.status(201).json(slot);
    } catch (error) {
      console.error("Error creating availability slot:", error);
      res.status(500).json({ message: "Failed to create availability slot" });
    }
  });

  app.put('/api/tutors/availability/:slotId', isAuthenticated, async (req: any, res) => {
    try {
      const slotId = parseInt(req.params.slotId);
      const userId = req.user.claims.sub;
      const slotData = insertTutorAvailabilitySlotSchema.partial().parse(req.body);
      
      const success = await storage.updateTutorAvailabilitySlot(slotId, slotData, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Availability slot not found or unauthorized" });
      }
      
      res.json({ message: "Availability slot updated successfully" });
    } catch (error) {
      console.error("Error updating availability slot:", error);
      res.status(500).json({ message: "Failed to update availability slot" });
    }
  });

  app.delete('/api/tutors/availability/:slotId', isAuthenticated, async (req: any, res) => {
    try {
      const slotId = parseInt(req.params.slotId);
      const userId = req.user.claims.sub;
      
      // We need the tutor ID for authorization - get it from the slot
      // This is a simplified approach; in production, you might want to verify ownership differently
      const success = await storage.deleteTutorAvailabilitySlot(slotId, 0, userId); // tutorId=0 as placeholder since method will verify ownership
      
      if (!success) {
        return res.status(404).json({ message: "Availability slot not found or unauthorized" });
      }
      
      res.json({ message: "Availability slot deleted successfully" });
    } catch (error) {
      console.error("Error deleting availability slot:", error);
      res.status(500).json({ message: "Failed to delete availability slot" });
    }
  });

  // Tutor sessions routes
  app.get('/api/tutor-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const filters = {
        tutorId: req.query.tutorId ? parseInt(req.query.tutorId as string) : undefined,
        studentId: req.query.studentId as string || userId, // Default to current user
        status: req.query.status as string,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };
      
      const sessions = await storage.getTutorSessions(filters);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching tutor sessions:", error);
      res.status(500).json({ message: "Failed to fetch tutor sessions" });
    }
  });

  app.get('/api/tutor-sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const session = await storage.getTutorSessionById(id);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Check if user is either the student or the tutor
      let isAuthorized = false;
      
      // Check if user is the student who booked the session
      if (session.studentId === userId) {
        isAuthorized = true;
      } else {
        // Check if user owns the tutor profile
        const tutorProfiles = await storage.getTutorsByUserId(userId);
        const ownsTutor = tutorProfiles.some(t => t.id === session.tutorId);
        if (ownsTutor) {
          isAuthorized = true;
        }
      }
      
      if (!isAuthorized) {
        return res.status(403).json({ message: "Unauthorized to view this session" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error fetching tutor session:", error);
      res.status(500).json({ message: "Failed to fetch tutor session" });
    }
  });

  app.post('/api/tutor-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertTutorSessionSchema.parse({ ...req.body, studentId: userId });
      
      const session = await storage.createTutorSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating tutor session:", error);
      res.status(500).json({ message: "Failed to create tutor session" });
    }
  });

  app.put('/api/tutor-sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const sessionData = insertTutorSessionSchema.partial().parse(req.body);
      
      // First get the session to verify authorization
      const session = await storage.getTutorSessionById(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Check if user is either the student or the tutor
      let isAuthorized = false;
      
      // Check if user is the student who booked the session
      if (session.studentId === userId) {
        isAuthorized = true;
      } else {
        // Check if user owns the tutor profile
        const tutorProfiles = await storage.getTutorsByUserId(userId);
        const ownsTutor = tutorProfiles.some(t => t.id === session.tutorId);
        if (ownsTutor) {
          isAuthorized = true;
        }
      }
      
      if (!isAuthorized) {
        return res.status(403).json({ message: "Unauthorized to modify this session" });
      }
      
      const success = await storage.updateTutorSession(id, sessionData);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to update session" });
      }
      
      res.json({ message: "Session updated successfully" });
    } catch (error) {
      console.error("Error updating tutor session:", error);
      res.status(500).json({ message: "Failed to update tutor session" });
    }
  });

  app.post('/api/tutor-sessions/:id/cancel', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const success = await storage.cancelTutorSession(id, userId);
      
      if (!success) {
        return res.status(404).json({ message: "Session not found or unauthorized" });
      }
      
      res.json({ message: "Session cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling tutor session:", error);
      res.status(500).json({ message: "Failed to cancel tutor session" });
    }
  });

  // Saved tutors routes
  app.get('/api/saved-tutors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedTutors = await storage.getUserSavedTutors(userId);
      res.json(savedTutors);
    } catch (error) {
      console.error("Error fetching saved tutors:", error);
      res.status(500).json({ message: "Failed to fetch saved tutors" });
    }
  });

  app.post('/api/tutors/:id/save', isAuthenticated, async (req: any, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const savedTutor = await storage.saveTutor({ tutorId, userId });
      res.status(201).json(savedTutor);
    } catch (error) {
      console.error("Error saving tutor:", error);
      res.status(500).json({ message: "Failed to save tutor" });
    }
  });

  app.delete('/api/tutors/:id/save', isAuthenticated, async (req: any, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      await storage.unsaveTutor(tutorId, userId);
      res.json({ message: "Tutor unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving tutor:", error);
      res.status(500).json({ message: "Failed to unsave tutor" });
    }
  });

  app.get('/api/tutors/:id/saved', isAuthenticated, async (req: any, res) => {
    try {
      const tutorId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const isSaved = await storage.isTutorSaved(tutorId, userId);
      res.json({ saved: isSaved });
    } catch (error) {
      console.error("Error checking if tutor is saved:", error);
      res.status(500).json({ message: "Failed to check saved status" });
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
