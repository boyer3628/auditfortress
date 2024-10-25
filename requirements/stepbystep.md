# Implementation Guide: Audit Platform

## Phase 1: Project Setup (Week 1)

### 1. Initial Setup
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest audit-platform --typescript --tailwind --eslint

# Install required dependencies
npm install @supabase/supabase-js lucide-react
```

### 2. Configure ShadCN
```bash
# Install and initialize ShadcnUI
npx shadcn-ui@latest init
```

### 3. Set Up Supabase
1. Create a new Supabase project
2. Create the Audits table:
```sql
CREATE TABLE audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  questions JSONB,
  photos TEXT[],
  signature TEXT
);
```

### 4. Environment Setup
Create `.env.local`:
```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Phase 2: Core Components (Week 2)

### 1. Create Base Components
1. Create `/components/Header.tsx`
2. Create `/components/AuditButton.tsx`
3. Create `/components/SearchBar.tsx`
4. Create `/components/FormFields.tsx`

### 2. Implement Home Page
1. Create home page layout with audit type selection
2. Implement search functionality
3. Add navigation to audit forms

## Phase 3: Audit Forms (Week 3)

### 1. Create Form Components
1. Create base form layout with common fields
2. Implement photo upload component
3. Create signature capture component
4. Add form validation

### 2. Implement Individual Audit Forms
1. Create fire extinguisher audit form
2. Create ladder audit form
3. Create custodial audit form
4. Create landscaping audit form

## Phase 4: Database Integration (Week 4)

### 1. Set Up Supabase Client
```typescript
// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 2. Implement API Routes
1. Create audit submission endpoint
2. Create audit retrieval endpoint
3. Implement search functionality

### 3. Connect Forms to API
1. Add form submission handlers
2. Implement error handling
3. Add loading states

## Phase 5: Testing and Refinement (Week 5)

### 1. Testing
1. Test form submissions
2. Test search functionality
3. Test photo uploads
4. Test signature capture
5. Test responsive design

### 2. Performance Optimization
1. Implement debounced search
2. Optimize image uploads
3. Add loading states and error boundaries

## Phase 6: Final Review and Launch (Week 6)

### 1. Final Testing
1. Cross-browser testing
2. Mobile responsiveness testing
3. Form validation testing
4. Database integrity testing

### 2. Documentation
1. Update API documentation
2. Create user guide
3. Document known issues and limitations

### 3. Deployment
1. Deploy to production
2. Monitor initial usage
3. Address any immediate issues

## Key Code Snippets

### 1. Basic Form Structure
```typescript
// components/FormFields.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const FormFields = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    date: new Date().toISOString()
  })

  return (
    <form className="space-y-4">
      <Input 
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          name: e.target.value
        }))}
      />
      {/* Add other fields */}
    </form>
  )
}
```

### 2. Photo Upload Component
```typescript
// components/PhotoUpload.tsx
export const PhotoUpload = () => {
  const uploadPhoto = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('audit-photos')
      .upload(`${Date.now()}-${file.name}`, file)
    
    if (error) {
      console.error('Error uploading photo:', error)
      return null
    }
    
    return data.path
  }

  return (
    <Input 
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) uploadPhoto(file)
      }}
    />
  )
}
```

### 3. Search Implementation
```typescript
// components/SearchBar.tsx
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'

export const SearchBar = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (debouncedSearch) {
      // Perform search
    }
  }, [debouncedSearch])

  return (
    <Input
      type="search"
      placeholder="Search audits..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  )
}
```

## Tips for Development

1. **Component Development**
   - Build and test components in isolation
   - Use Storybook if possible for component development
   - Ensure components are fully responsive

2. **Form Handling**
   - Implement proper validation before submission
   - Show clear error messages
   - Include loading states
   - Handle offline capabilities

3. **Data Management**
   - Implement proper error handling
   - Add retry logic for failed submissions
   - Cache relevant data for offline use
   - Implement proper data validation

4. **Testing**
   - Write unit tests for critical functions
   - Test form validation thoroughly
   - Test error scenarios
   - Test offline functionality