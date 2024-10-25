import { z } from "zod"

export const fireAuditSchema = z.object({
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

  // Fire Extinguisher Information
  extinguisherLocation: z.string().min(1, "Extinguisher location is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  manufactureDate: z.object({
    month: z.string().min(1, "Month is required"),
    year: z.string().min(4, "Valid year is required"),
  }),
  expiryDate: z.object({
    month: z.string().min(1, "Month is required"),
    year: z.string().min(4, "Valid year is required"),
  }),
  type: z.string().nullable(),  // Allow null
  size: z.string().min(1, "Size is required"),
  rating: z.string().nullable(), // Allow null

  // Inspection Results
  inspectionResults: z.object({
    maintenanceTag: z.boolean().nullable(),
    mounting: z.boolean().nullable(),
    safetyPin: z.boolean().nullable(),
    label: z.boolean().nullable(),
    handle: z.boolean().nullable(),
    pressureGauge: z.boolean().nullable(),
    nozzle: z.boolean().nullable(),
    invertTest: z.boolean().nullable(),
    location: z.boolean().nullable(),
    cleaned: z.boolean().nullable(),
    tagSigned: z.boolean().nullable(),
  }),

  // Photo requirement
  maintenanceTagPhoto: z.string().nullable(),

  // Overall condition
  overallCondition: z.enum(["pass", "fail"]).nullable(),

  // Complete Audit
  observations: z.string().optional(),
  recommendations: z.string().min(1, "Recommendations are required"),
  signature: z.string().nullable(),
})

export type FireAuditFormData = z.infer<typeof fireAuditSchema>
