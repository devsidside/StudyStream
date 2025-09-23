# StudyConnect API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.repl.co/api
```

## Authentication

All protected endpoints require authentication. The API uses session-based authentication with HTTP-only cookies.

### Headers
```http
Content-Type: application/json
Cookie: connect.sid=<session-id>
```

---

## Authentication Endpoints

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "student@university.edu",
    "role": "student",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "university": "Example University"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "newuser@university.edu",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "student",
  "university": "Example University",
  "course": "Computer Science",
  "year": "3"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "uuid-string"
}
```

### Get Current User
```http
GET /api/auth/me
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "student@university.edu",
    "role": "student",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "university": "Example University",
      "course": "Computer Science",
      "year": "3",
      "profileImageUrl": "https://example.com/avatar.jpg"
    }
  }
}
```

### Logout User
```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Resource Management

### List Academic Resources
```http
GET /api/resources
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `subject` (string): Filter by subject
- `type` (string): Filter by resource type (pdf, code, note, project)
- `university` (string): Filter by university
- `search` (string): Search in title and description

**Example Request:**
```http
GET /api/resources?subject=Computer%20Science&type=pdf&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "resources": [
    {
      "id": "1",
      "title": "Data Structures and Algorithms Notes",
      "description": "Comprehensive notes covering all major data structures",
      "type": "pdf",
      "subject": "Computer Science",
      "university": "Example University",
      "course": "CS-301",
      "owner": {
        "id": "uuid-string",
        "firstName": "John",
        "lastName": "Doe"
      },
      "fileSize": 2048576,
      "downloadCount": 150,
      "rating": 4.8,
      "reviewCount": 24,
      "createdAt": "2025-09-15T10:30:00Z",
      "updatedAt": "2025-09-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Upload Resource
```http
POST /api/resources
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file): The resource file
- `title` (string): Resource title
- `description` (string): Resource description
- `type` (string): Resource type (pdf, code, note, project)
- `subject` (string): Academic subject
- `course` (string): Course code
- `tags` (string): Comma-separated tags

**Response (201 Created):**
```json
{
  "success": true,
  "resource": {
    "id": "2",
    "title": "Machine Learning Project",
    "description": "Final project implementing neural networks",
    "type": "project",
    "subject": "Computer Science",
    "course": "CS-401",
    "filePath": "/uploads/resources/ml-project-uuid.zip",
    "fileSize": 5242880,
    "ownerId": "uuid-string",
    "createdAt": "2025-09-18T15:45:00Z"
  }
}
```

### Get Resource Details
```http
GET /api/resources/:id
```

**Response (200 OK):**
```json
{
  "resource": {
    "id": "1",
    "title": "Data Structures and Algorithms Notes",
    "description": "Comprehensive notes covering all major data structures",
    "type": "pdf",
    "subject": "Computer Science",
    "university": "Example University",
    "course": "CS-301",
    "filePath": "/uploads/resources/dsa-notes-uuid.pdf",
    "fileSize": 2048576,
    "downloadCount": 150,
    "rating": 4.8,
    "reviewCount": 24,
    "owner": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Doe",
      "university": "Example University"
    },
    "tags": ["algorithms", "data-structures", "cs-301"],
    "reviews": [
      {
        "id": "review-1",
        "rating": 5,
        "comment": "Excellent notes, very detailed",
        "reviewer": {
          "firstName": "Alice",
          "lastName": "Johnson"
        },
        "createdAt": "2025-09-10T08:20:00Z"
      }
    ],
    "createdAt": "2025-09-15T10:30:00Z",
    "updatedAt": "2025-09-15T10:30:00Z"
  }
}
```

### Download Resource
```http
GET /api/resources/:id/download
```

**Response:** File download with appropriate Content-Type headers

### Update Resource
```http
PUT /api/resources/:id
```

**Request Body:**
```json
{
  "title": "Updated Resource Title",
  "description": "Updated description",
  "tags": ["updated", "tags"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "resource": {
    // Updated resource object
  }
}
```

### Delete Resource
```http
DELETE /api/resources/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

---

## Vendor Management

### List Vendors
```http
GET /api/vendors
```

**Query Parameters:**
- `category` (string): Filter by category (hostel, mess, cafe, tuition, service)
- `location` (string): Filter by location
- `verified` (boolean): Filter by verification status
- `rating` (number): Minimum rating filter

**Response (200 OK):**
```json
{
  "vendors": [
    {
      "id": "vendor-uuid",
      "businessName": "Campus Cafe",
      "category": "cafe",
      "description": "Fresh coffee and snacks for students",
      "contactInfo": {
        "phone": "+1234567890",
        "email": "info@campuscafe.com",
        "address": "123 Campus Street"
      },
      "verified": true,
      "rating": 4.5,
      "reviewCount": 89,
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "address": "123 Campus Street, City"
      },
      "services": [
        {
          "name": "Coffee & Beverages",
          "price": "$2-8",
          "description": "Fresh brewed coffee and specialty drinks"
        }
      ],
      "owner": {
        "firstName": "Business",
        "lastName": "Owner"
      },
      "createdAt": "2025-08-01T09:00:00Z"
    }
  ]
}
```

### Register as Vendor
```http
POST /api/vendors
```

**Request Body:**
```json
{
  "businessName": "New Campus Service",
  "category": "tuition",
  "description": "Professional tutoring services for all subjects",
  "contactInfo": {
    "phone": "+1234567890",
    "email": "contact@tutoring.com",
    "address": "456 Academic Avenue"
  },
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "456 Academic Avenue, City"
  },
  "services": [
    {
      "name": "Mathematics Tutoring",
      "price": "$25/hour",
      "description": "Expert help with calculus, algebra, and statistics"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "vendor": {
    "id": "new-vendor-uuid",
    "businessName": "New Campus Service",
    "category": "tuition",
    "verified": false,
    // ... other vendor details
  }
}
```

### Get Vendor Details
```http
GET /api/vendors/:id
```

**Response (200 OK):**
```json
{
  "vendor": {
    // Complete vendor object with services and reviews
  }
}
```

---

## Search Endpoints

### Search Resources
```http
GET /api/search/resources
```

**Query Parameters:**
- `q` (string): Search query
- `subject` (string): Subject filter
- `type` (string): Resource type filter
- `university` (string): University filter
- `minRating` (number): Minimum rating
- `sortBy` (string): Sort field (date, rating, downloads, title)
- `sortOrder` (string): Sort order (asc, desc)

**Response (200 OK):**
```json
{
  "results": [
    // Array of matching resources
  ],
  "facets": {
    "subjects": [
      { "name": "Computer Science", "count": 45 },
      { "name": "Mathematics", "count": 32 }
    ],
    "types": [
      { "name": "pdf", "count": 67 },
      { "name": "code", "count": 23 }
    ],
    "universities": [
      { "name": "Example University", "count": 89 }
    ]
  },
  "total": 156
}
```

### Search Vendors
```http
GET /api/search/vendors
```

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Category filter
- `location` (string): Location filter
- `radius` (number): Search radius in kilometers
- `lat` (number): Latitude for location-based search
- `lng` (number): Longitude for location-based search

---

## File Upload

### Upload Files
```http
POST /api/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `files` (file[]): Array of files to upload
- `category` (string): Upload category (resource, profile, vendor)

**Response (200 OK):**
```json
{
  "success": true,
  "files": [
    {
      "filename": "document-uuid.pdf",
      "originalName": "document.pdf",
      "size": 1024768,
      "mimeType": "application/pdf",
      "url": "/api/files/document-uuid.pdf"
    }
  ]
}
```

### Serve Files
```http
GET /api/files/:filename
```

**Response:** File content with appropriate headers

---

## Rating and Review System

### Add Review
```http
POST /api/resources/:id/reviews
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent resource, very helpful for my studies"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "review": {
    "id": "review-uuid",
    "rating": 5,
    "comment": "Excellent resource, very helpful for my studies",
    "reviewer": {
      "firstName": "Student",
      "lastName": "Name"
    },
    "createdAt": "2025-09-18T16:30:00Z"
  }
}
```

### Get Reviews
```http
GET /api/resources/:id/reviews
```

**Response (200 OK):**
```json
{
  "reviews": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "Excellent resource",
      "reviewer": {
        "firstName": "Student",
        "lastName": "Name"
      },
      "createdAt": "2025-09-18T16:30:00Z"
    }
  ],
  "summary": {
    "averageRating": 4.7,
    "totalReviews": 23,
    "ratingDistribution": {
      "5": 15,
      "4": 6,
      "3": 2,
      "2": 0,
      "1": 0
    }
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    // Additional error context
  },
  "timestamp": "2025-09-18T16:30:00Z"
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | UNPROCESSABLE_ENTITY | Validation failed |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute per IP
- **Search endpoints**: 60 requests per minute per user
- **Upload endpoints**: 10 requests per minute per user
- **General endpoints**: 100 requests per minute per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1695660000
```

---

## WebSocket Events

### Real-time Notifications
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5000/ws');

// Listen for events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Event types
{
  "type": "NEW_RESOURCE",
  "data": {
    "resourceId": "uuid",
    "title": "New Resource Title",
    "subject": "Computer Science"
  }
}

{
  "type": "NEW_REVIEW",
  "data": {
    "resourceId": "uuid",
    "rating": 5,
    "reviewerName": "John Doe"
  }
}

{
  "type": "VENDOR_UPDATE",
  "data": {
    "vendorId": "uuid",
    "businessName": "Updated Business Name"
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript Client
```typescript
class StudyConnectAPI {
  private baseURL = 'http://localhost:5000/api';
  
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
  
  async getResources(filters: ResourceFilters) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/resources?${params}`, {
      credentials: 'include'
    });
    return response.json();
  }
  
  async uploadResource(file: File, metadata: ResourceMetadata) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    const response = await fetch(`${this.baseURL}/resources`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    return response.json();
  }
}
```

### React Hook Example
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function useResources(filters: ResourceFilters) {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: () => api.getResources(filters)
  });
}

function useUploadResource() {
  return useMutation({
    mutationFn: ({ file, metadata }: UploadParams) => 
      api.uploadResource(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    }
  });
}
```