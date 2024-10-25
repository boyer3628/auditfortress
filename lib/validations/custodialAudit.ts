import { z } from "zod"

// Create a type for the inspection areas
const inspectionAreas = [
  "Break / kitchenette",
  "Cafeteria",
  "Coffee stations",
  "Cold Rooms",
  "Conference Rooms",
  "Copy / fax areas",
  "Elevators",
  "Fitness rooms / center",
  "GAP space",
  "Grey space",
  "Hallway / corridor",
  "Janitor closets",
  "Labs",
  "LAR",
  "Loading docks",
  "Lobby / atriums",
  "Mail and copy centers",
  "Manufacturing",
  "Office",
  "Penthouse Mez",
  "Restroom",
  "Shops",
  "Stairwell",
  "Stockroom",
  "Trash",
  "Warehouse",
  "Other",
  // Garage section
  "Garage - Handrails",
  "Garage - Elevator",
  "Garage - Glass",
  "Garage - Trash Collection",
  "Garage - Litter Removal"
] as const;

export const custodialAuditSchema = z.object({
  // Auditor Details
  name: z.string().min(1, "Name is required"),
  email: z.string()
    .email("Invalid email address")
    .refine(
      (email) => email.endsWith("@amentum.com"), 
      "Must use company email address (@amentum.com)"
    ),
  location: z.string().min(1, "Location is required"),
  
  // Audit Metadata
  auditDate: z.date({
    required_error: "Audit date is required",
  }),

  // Inspection Results
  inspectionResults: z.record(
    z.enum([...inspectionAreas] as [string, ...string[]]),
    z.number().nullable()
  ),

  // Comments
  comments: z.string().optional(),

  // Complete Audit
  observations: z.string().optional(),
  recommendations: z.string().min(1, "Recommendations are required"),
  signature: z.string().nullable(),
})

export type CustodialAuditFormData = z.infer<typeof custodialAuditSchema>
