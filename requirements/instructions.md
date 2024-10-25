# Product Requirements Document (PRD) for Audit Platform

## Project Overview
The Audit Platform is a web-based application where users can perform various audits to track safety aspects of elements across multiple locations. Users will enter text fields, select dates, capture and upload photos, and record digital signatures. The data will be stored in a Supabase database, allowing users to view and search past audits performed at specific locations.

The platform will be developed using **Next.js 14**, **ShadCN**, **Tailwind CSS**, **Lucide Icons**, and **Supabase**.

## Goals and Objectives
- Provide a seamless user experience for submitting and tracking audits
- Ensure data integrity by integrating with Supabase for storage and retrieval
- Enable users to perform audits offline with automatic sync when online (future enhancement)
- Provide a responsive UI across devices
- Ensure clear navigation with distinct types of audits, robust search functionality, and accessible past audits

## Core Features

### 1. Home Screen
- Title and subtitle displayed at the top
- Four image buttons to select the type of audit
- A search bar to look up previous audits by auditor name or location

### 2. Audit Forms
- Each audit form includes **common fields**: Name, Email, Date, and Location
- Additional fields will vary based on the selected audit type
- Support for text input, date pickers, photo capture/upload, radio buttons, and digital signatures

### 3. Search Functionality
- Allows users to filter previous audits based on auditor name or location
- Results are displayed in a list with key details like audit type, date, and location

### 4. Past Audit View
- Users can access and view details of previous audits, including uploaded photos

## Platform Stack & Tools

### Frontend
- **Next.js 14**: Framework for building the web app
- **Tailwind CSS**: For styling the UI
- **ShadCN**: Component library for consistent UI
- **Lucide Icons**: Icon set for UI elements

### Backend & Database
- **Supabase**: For data storage and authentication

## File Structure
```
/project-root
│
├── /public                # Static assets (icons, images, etc.)
│   ├── /icons
│   ├── /images
│   └── favicon.ico
│
├── /src                   # Main source code folder
│   ├── /components        # Reusable components
│   │   ├── AuditButton.tsx  # Audit type selection buttons
│   │   ├── FormFields.tsx   # Common fields for audit forms
│   │   ├── SearchBar.tsx    # Search bar component
│   │   └── Header.tsx       # Header with title and subtitle
│   │
│   ├── /pages             # Next.js pages (route handlers)
│   │   ├── index.tsx        # Home screen
│   │   ├── /audit
│   │   │   ├── fire.tsx     # Fire extinguisher audit form
│   │   │   ├── ladder.tsx   # Ladder audit form
│   │   │   ├── custodial.tsx # Custodial audit form
│   │   │   └── landscaping.tsx # Landscaping audit form
│   │   └── /audit-view      # Page to view past audits
│   │
│   ├── /styles            # Global and component-specific styles
│   │   └── globals.css      # Tailwind CSS setup
│   │
│   ├── /utils             # Utility functions (Supabase integration, validations)
│   │   ├── supabaseClient.ts # Supabase configuration and client
│   │   └── validators.ts     # Form validations
│   │
│   └── /api               # Backend logic and API routes (Next.js API routes)
│       └── /audits          # API routes for CRUD operations with Supabase
│           ├── create.ts     # Create a new audit
│           ├── get.ts        # Retrieve previous audits
│           └── update.ts     # Update an existing audit
│
└── .env                   # Environment variables (Supabase keys, etc.)
└── package.json           # Project dependencies
└── tailwind.config.js     # Tailwind CSS configuration
└── next.config.js         # Next.js configuration
```

## Documentation

### 1. Component Documentation
Each component will include:
- **Description**: Purpose of the component
- **Props**: Expected inputs and types
- **Usage Example**: How to integrate it within pages

Example:
```typescript
// AuditButton.tsx
import { Button } from 'shadcn/components';
import { IconFireExtinguisher } from 'lucide-react';

type Props = {
  label: string;
  onClick: () => void;
};

const AuditButton: React.FC<Props> = ({ label, onClick }) => (
  <Button icon={<IconFireExtinguisher />} onClick={onClick}>
    {label}
  </Button>
);

export default AuditButton;
```

### 2. API Documentation
Endpoints for CRUD operations on audits:

#### Create Audit
**POST** `/api/audits/create`

**Request Payload**:
```json
{
  "type": "fire_extinguisher",
  "name": "John Doe",
  "email": "john@example.com",
  "location": "Warehouse 1",
  "questions": {
    "q1": true,
    "q2": false
  }
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Audit created successfully"
}
```

#### Retrieve Audits
**GET** `/api/audits/get?auditor=John Doe`

**Response**:
```json
[
  {
    "id": 1,
    "type": "fire_extinguisher",
    "name": "John Doe",
    "location": "Warehouse 1",
    "date": "2024-10-01"
  }
]
```

## Supabase Database Structure

### Table: Audits
Fields:
- `id` (Primary Key, UUID)
- `audit_type` (String)
- `name` (String)
- `email` (String)
- `location` (String)
- `date` (Date)
- `questions` (JSONB) – Stores responses to questions
- `photos` (Array of URLs) – Stores image URLs
- `signature` (URL) – Stores the URL of the signature image

## Implementation Details

### 1. Authentication
Users will authenticate using Supabase's built-in authentication service (email/password).

### 2. Data Storage and Retrieval
Audits will be stored in the **Audits** table in Supabase, with relevant data (questions, photos, and signature) being stored as JSON.

### 3. Image Uploads
Users can upload photos directly from their devices. The images will be uploaded to Supabase's storage and the URLs saved in the database.

### 4. Search Feature
Implement client-side filtering with debounce on the search bar to enhance performance.

## UI Guidelines

### 1. Responsive Design
Use Tailwind CSS to ensure a consistent experience across devices.

### 2. Icons
Use **Lucide Icons** to visually represent each audit type (e.g., fire extinguisher icon for Fire Extinguisher Audit).

## Developer Responsibilities

### 1. Frontend Team
- Implement all pages and components using **Next.js** and **Tailwind CSS**
- Integrate with **ShadCN** components for a consistent UI

### 2. Backend Team
- Set up **Supabase** for authentication and data storage
- Develop API routes for creating, retrieving, and updating audits

### 3. Testing
- Perform unit tests on components and API routes
- Conduct integration testing for Supabase connectivity

## Timeline and Milestones

| Milestone | Expected Completion |
|-----------|-------------------|
| Project Setup | Week 1 |
| Home Screen Development | Week 2 |
| Audit Forms Implementation | Week 3 |
| API and Database Setup | Week 4 |
| Testing and Bug Fixing | Week 5 |
| Final Review & Launch | Week 6 |

## Conclusion
This PRD provides a clear roadmap for developing the Audit Platform. The modular structure ensures smooth collaboration between frontend and backend teams. With the provided details on file structure, documentation, and database schema, developers can efficiently align their efforts toward building a robust and scalable audit platform.