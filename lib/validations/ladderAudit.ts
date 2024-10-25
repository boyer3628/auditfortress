import { z } from "zod"

export const ladderAuditSchema = z.object({
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

  // Ladder Information
  ladderLocation: z.string().min(1, "Ladder location is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
  type: z.string({
    required_error: "Ladder type is required",
  }),
  length: z.string().min(1, "Length is required"),
  construction: z.string({
    required_error: "Construction type is required",
  }),
  class: z.string({
    required_error: "Class is required",
  }),

  // Inspection Results
  inspectionResults: z.object({
    freeDents: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    feetPads: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    rungLocks: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    sideRails: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    boltsRivets: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    rope: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    steps: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
    storage: z.boolean({
      required_error: "Please complete all inspection items",
    }).nullable(),
  }),
  otherDefects: z.string().optional(),
  defectPhoto: z.string().optional(),
  overallCondition: z.enum(["pass", "fail"]).nullable(),

  // Complete Audit
  observations: z.string().optional(),
  recommendations: z.string().min(1, "Recommendations are required"),
  signature: z.string({
    required_error: "Signature is required",
  }),
})

export type LadderAuditFormData = z.infer<typeof ladderAuditSchema>
