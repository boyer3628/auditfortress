import { z } from "zod";
import { ValidationError } from "../db"; // Import the error class

// Validation schemas for database operations
export const auditorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string()
    .email("Invalid email format")
    .endsWith("@amentum.com", "Must be a company email"),
});

export const locationSchema = z.object({
  name: z.string().min(2, "Location name must be at least 2 characters"),
});

export const baseAuditSchema = z.object({
  auditor_id: z.string().uuid(),
  location_id: z.string().uuid(),
  audit_type: z.enum(['fire', 'ladder', 'custodial', 'landscaping']),
  audit_date: z.date(),
  recommendations: z.string().min(1, "Recommendations are required"),
  observations: z.string().optional(),
  signature: z.string().nullable(),
});

// Validation functions
export function validateAuditorData(data: unknown) {
  try {
    return auditorSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw error;
  }
}

export function validateLocationData(data: unknown) {
  try {
    return locationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw error;
  }
}

export function validateBaseAuditData(data: unknown) {
  try {
    return baseAuditSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw error;
  }
}
