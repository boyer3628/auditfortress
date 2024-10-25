import { z } from "zod"

// Create a type for the inspection areas
const inspectionAreas = [
  "Hedges have been properly trimmed",
  "The grass has cut to the appropriate height",
  "The sidewalks & curbs are properly edged",
  "The grass around the light poles is cut",
  "The grass around the signs is cut",
  "The grass around the trees is cut",
  "The grass around the fire hydrants is cut",
  "The irrigation are scheduled at the appropriate times",
  "The sprinklers are correctly aligned",
  "Mulch needs have been properly filled",
  "Mulch has been removed from the grass",
  "There is proper distance between the mulch & the grass",
  "There is proper clearance between the mulch & surrounding buildings",
  "Dead trees are removed correctly",
  "All trees have been correctly pruned",
  "All dead trees have been removed",
  "All dead limbs have been removed",
  "All dead shrubs have been removed",
  "All dead flowers have been removed",
  "All dead grass has been removed",
  "All weeds have been removed",
  "All trash has been removed",
  "All debris has been removed",
  "All tools have been properly stored",
  "All equipment has been properly stored",
  "All materials have been properly stored",
  "All chemicals have been properly stored",
  "All containers have been properly stored",
  "All trash cans have been properly stored",
  "All debris has been properly disposed",
  "All tools have been properly cleaned",
  "All equipment has been properly cleaned",
  "All materials have been properly cleaned",
  "All chemicals have been properly stored & sealed",
  "All containers have been properly cleaned",
  "All trash cans have been properly cleaned",
  "All debris has been properly disposed",
] as const;

export const landscapingAuditSchema = z.object({
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
    z.number().nullable() // Changed from boolean to number
  ),

  // Comments
  comments: z.string().optional(),

  // Complete Audit
  observations: z.string().optional(),
  recommendations: z.string().min(1, "Recommendations are required"),
  signature: z.string().nullable(),
})

export type LandscapingAuditFormData = z.infer<typeof landscapingAuditSchema>
