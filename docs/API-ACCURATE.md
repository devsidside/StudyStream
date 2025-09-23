# StudyConnect API Documentation (Accurate)

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.repl.co/api
```

## Authentication

The application uses **Replit OAuth** for authentication with session-based security.

### Headers
```http
Cookie: connect.sid=<session-id>
```

---

## Authentication Endpoints

### Get Current User
```http
GET /api/auth/user
```

**Authentication Required:** Yes

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "email": "student@university.edu",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "university": "Example University",
  "course": "Computer Science",
  "year": "3",
  "createdAt": "2025-09-15T10:30:00Z",
  "updatedAt": "2025-09-15T10:30:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Failed to fetch user"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "message": "Failed to fetch user"
}
```

---

## Notes Management

### List Notes
```http
GET /api/notes
```

**Query Parameters:**
- `subject` (string): Subject filter (computer-science, mathematics, etc.)
- `university` (string): University name filter
- `contentType` (string): Content type (lecture-notes, study-guide, past-paper, etc.)
- `search` (string): Search term for title and description
- `limit` (number): Number of results (default: 20)
- `offset` (number): Offset for pagination (default: 0)
- `sortBy` (string): Sort order - 'popular', 'recent', 'rating' (default: 'recent')

**Example Request:**
```http
GET /api/notes?subject=computer-science&university=MIT&limit=10&sortBy=popular
```

**Response (200 OK):**
```json
{
  "notes": [
    {
      "id": 1,
      "title": "Data Structures and Algorithms",
      "description": "Comprehensive notes on DSA",
      "subject": "computer-science",
      "courseCode": "CS-301",
      "professor": "Dr. Smith",
      "university": "MIT",
      "academicYear": "2024-2025",
      "semester": "Fall",
      "contentType": "lecture-notes",
      "visibility": "public",
      "tags": ["algorithms", "data-structures"],
      "uploaderId": "user-uuid",
      "totalDownloads": 150,
      "totalViews": 500,
      "averageRating": "4.5",
      "totalRatings": 20,
      "allowDownloads": true,
      "allowComments": true,
      "allowRatings": true,
      "license": "cc-attribution",
      "createdAt": "2025-09-15T10:30:00Z",
      "updatedAt": "2025-09-15T10:30:00Z"
    }
  ],
  "total": 45
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "message": "Failed to fetch notes"
}
```

### Get Note Details
```http
GET /api/notes/:id
```

**Authentication Required:** No

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Data Structures and Algorithms",
  "description": "Comprehensive notes on DSA",
  "subject": "computer-science",
  "courseCode": "CS-301",
  "university": "MIT",
  "contentType": "lecture-notes",
  "uploader": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "files": [
    {
      "id": 1,
      "fileName": "dsa-notes-uuid.pdf",
      "originalName": "DSA Notes.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf",
      "fileUrl": "/uploads/dsa-notes-uuid.pdf",
      "uploadedAt": "2025-09-15T10:30:00Z"
    }
  ],
  "totalDownloads": 150,
  "totalViews": 501,
  "averageRating": "4.5",
  "totalRatings": 20,
  "createdAt": "2025-09-15T10:30:00Z",
  "updatedAt": "2025-09-15T10:30:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Note not found"
}
```

### Upload Note
```http
POST /api/notes
```

**Authentication Required:** Yes
**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (string): Note title
- `description` (string): Note description
- `subject` (string): Subject from enum (computer-science, mathematics, etc.)
- `courseCode` (string): Course code
- `professor` (string): Professor name
- `university` (string): University name
- `academicYear` (string): Academic year
- `semester` (string): Semester
- `contentType` (string): Content type from enum
- `visibility` (string): Visibility level (public, university, course, private)
- `tags` (array): Array of tags
- `files` (file[]): Array of files to upload

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Machine Learning Basics",
  "description": "Introduction to ML concepts",
  "subject": "computer-science",
  "contentType": "lecture-notes",
  "uploaderId": "user-uuid",
  "totalDownloads": 0,
  "totalViews": 0,
  "averageRating": "0",
  "totalRatings": 0,
  "createdAt": "2025-09-18T15:45:00Z",
  "updatedAt": "2025-09-18T15:45:00Z"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "message": "Failed to create note"
}
```

### Delete Note
```http
DELETE /api/notes/:id
```

**Authentication Required:** Yes (owner only)

**Response (200 OK):**
```json
{
  "message": "Note deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Note not found or unauthorized"
}
```

### Record Download
```http
POST /api/notes/:id/download
```

**Authentication Required:** No

**Response (200 OK):**
```json
{
  "message": "Download recorded"
}
```

---

## Note Ratings

### Get Note Ratings
```http
GET /api/notes/:id/ratings
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "noteId": 1,
    "userId": "user-uuid",
    "rating": 5,
    "review": "Excellent notes!",
    "createdAt": "2025-09-10T08:20:00Z"
  }
]
```

### Add/Update Note Rating
```http
POST /api/notes/:id/ratings
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent notes, very helpful!"
}
```

**Response (201 Created) - New Rating:**
```json
{
  "id": 2,
  "noteId": 1,
  "userId": "user-uuid",
  "rating": 5,
  "review": "Excellent notes, very helpful!",
  "createdAt": "2025-09-18T16:30:00Z"
}
```

**Response (200 OK) - Updated Rating:**
```json
{
  "message": "Rating updated successfully"
}
```

---

## Note Comments

### Get Note Comments
```http
GET /api/notes/:id/comments
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "noteId": 1,
    "userId": "user-uuid",
    "content": "Great notes! Thanks for sharing.",
    "parentId": null,
    "createdAt": "2025-09-10T08:20:00Z"
  }
]
```

### Add Note Comment
```http
POST /api/notes/:id/comments
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "content": "Great notes! Thanks for sharing.",
  "parentId": null
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "noteId": 1,
  "userId": "user-uuid",
  "content": "Great notes! Thanks for sharing.",
  "parentId": null,
  "createdAt": "2025-09-18T16:30:00Z"
}
```

---

## Saved Notes

### Get Saved Notes
```http
GET /api/saved-notes
```

**Authentication Required:** Yes

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Data Structures and Algorithms",
    "subject": "computer-science",
    "university": "MIT",
    "averageRating": "4.5",
    "createdAt": "2025-09-15T10:30:00Z"
  }
]
```

### Save Note
```http
POST /api/notes/:id/save
```

**Authentication Required:** Yes

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": "user-uuid",
  "noteId": 1,
  "savedAt": "2025-09-18T16:30:00Z"
}
```

### Unsave Note
```http
DELETE /api/notes/:id/save
```

**Authentication Required:** Yes

**Response (200 OK):**
```json
{
  "message": "Note unsaved successfully"
}
```

### Check Saved Status
```http
GET /api/notes/:id/saved
```

**Authentication Required:** Yes

**Response (200 OK):**
```json
{
  "isSaved": true
}
```

---

## Vendor Management

### List Vendors
```http
GET /api/vendors
```

**Query Parameters:**
- `category` (string): Category filter (accommodation, food, tutoring, transport, entertainment, services, shopping)
- `search` (string): Search term for name and description
- `limit` (number): Number of results (default: 20)
- `offset` (number): Offset for pagination (default: 0)

**Response (200 OK):**
```json
{
  "vendors": [
    {
      "id": 1,
      "name": "Campus Cafe",
      "description": "Fresh coffee and snacks",
      "category": "food",
      "ownerId": "user-uuid",
      "phone": "+1234567890",
      "email": "info@campuscafe.com",
      "address": "123 Campus Street",
      "latitude": "40.71280000",
      "longitude": "-74.00600000",
      "website": "https://campuscafe.com",
      "priceRange": "budget",
      "averageRating": "4.5",
      "totalRatings": 89,
      "isVerified": true,
      "isActive": true,
      "createdAt": "2025-08-01T09:00:00Z",
      "updatedAt": "2025-08-01T09:00:00Z"
    }
  ],
  "total": 25
}
```

### Get Vendor Details
```http
GET /api/vendors/:id
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Campus Cafe",
  "description": "Fresh coffee and snacks for students",
  "category": "food",
  "phone": "+1234567890",
  "email": "info@campuscafe.com",
  "address": "123 Campus Street",
  "latitude": "40.71280000",
  "longitude": "-74.00600000",
  "averageRating": "4.5",
  "totalRatings": 89,
  "isVerified": true,
  "createdAt": "2025-08-01T09:00:00Z"
}
```

### Create Vendor
```http
POST /api/vendors
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "New Tutoring Service",
  "description": "Professional tutoring for all subjects",
  "category": "tutoring",
  "phone": "+1234567890",
  "email": "contact@tutoring.com",
  "address": "456 Academic Avenue",
  "latitude": "40.71280000",
  "longitude": "-74.00600000",
  "website": "https://tutoring.com",
  "priceRange": "mid-range"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "New Tutoring Service",
  "category": "tutoring",
  "ownerId": "user-uuid",
  "averageRating": "0",
  "totalRatings": 0,
  "isVerified": false,
  "isActive": true,
  "createdAt": "2025-09-18T15:45:00Z",
  "updatedAt": "2025-09-18T15:45:00Z"
}
```

### Update Vendor
```http
PUT /api/vendors/:id
```

**Authentication Required:** Yes (owner only)

**Request Body:**
```json
{
  "name": "Updated Business Name",
  "description": "Updated description",
  "phone": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "message": "Vendor updated successfully"
}
```

---

## Vendor Ratings

### Get Vendor Ratings
```http
GET /api/vendors/:id/ratings
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "vendorId": 1,
    "userId": "user-uuid",
    "rating": 5,
    "review": "Great service!",
    "createdAt": "2025-09-10T08:20:00Z"
  }
]
```

### Add Vendor Rating
```http
POST /api/vendors/:id/ratings
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent service, highly recommended!"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "vendorId": 1,
  "userId": "user-uuid",
  "rating": 5,
  "review": "Excellent service, highly recommended!",
  "createdAt": "2025-09-18T16:30:00Z"
}
```

---

## File Serving

### Serve Uploaded Files
```http
GET /uploads/:filename
```

**Response:** File content with appropriate Content-Type headers

---

## Error Responses

### Standard Error Format
```json
{
  "message": "Human-readable error message"
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints may be rate-limited to ensure fair usage. Rate limit information is not currently exposed in response headers.

---

## Authentication Flow

### OAuth Login Process
1. User navigates to login
2. Redirected to Replit OAuth authorization
3. User grants permission on Replit
4. Redirected back with authorization code
5. Server exchanges code for tokens
6. Session created with HTTP-only cookies
7. User profile automatically created/updated

### Session Management
- Sessions stored in PostgreSQL
- 7-day expiration with automatic refresh
- HTTP-only cookies for security
- CSRF protection enabled