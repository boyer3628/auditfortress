import { supabase } from './supabase';
import { FireAuditFormData } from './validations/fireAudit';
import { LadderAuditFormData } from './validations/ladderAudit';
import { CustodialAuditFormData } from './validations/custodialAudit';
import { LandscapingAuditFormData } from './validations/landscapingAudit';
import { uploadImage } from './storage';
import { validateAuditorData, validateLocationData, validateBaseAuditData } from './validations/databaseValidation';

// Error classes
export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Validation helper
const validateInspectionResults = (results: Record<string, any>) => {
  const hasAnswers = Object.values(results).some(value => value !== null);
  if (!hasAnswers) {
    throw new ValidationError('At least one inspection item must be completed');
  }
};

// Main audit insertion function
export async function insertAudit(
  auditType: 'fire' | 'ladder' | 'custodial' | 'landscaping',
  formData: FireAuditFormData | LadderAuditFormData | CustodialAuditFormData | LandscapingAuditFormData
) {
  try {
    console.log('Starting audit insertion:', formData);

    // First, ensure the auditor exists or create them
    const { data: auditor, error: auditorError } = await supabase
      .from('auditors')
      .upsert({
        email: formData.email,
        name: formData.name,
      })
      .select('id')
      .single();

    if (auditorError) {
      console.error('Auditor creation failed:', auditorError);
      throw new DatabaseError('Failed to create/update auditor', auditorError.code);
    }
    console.log('Auditor created/updated:', auditor);

    // Then, ensure the location exists or create it
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .upsert({
        name: formData.location,
      })
      .select('id')
      .single();

    if (locationError) {
      console.error('Location creation failed:', locationError);
      throw locationError;
    }
    console.log('Location created/updated:', location);

    // Create base audit record
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .insert({
        auditor_id: auditor.id,
        location_id: location.id,
        audit_type: auditType,
        audit_date: formData.auditDate,
        recommendations: formData.recommendations,
        observations: formData.observations,
        signature: formData.signature,
      })
      .select('id')
      .single();

    if (auditError) {
      console.error('Base audit creation failed:', auditError);
      throw auditError;
    }
    console.log('Base audit created:', audit);

    // Insert specific audit details based on type
    let result;
    try {
      switch (auditType) {
        case 'landscaping':
          result = await insertLandscapingAudit(audit.id, formData as LandscapingAuditFormData);
          break;
        case 'fire':
          result = await insertFireAudit(audit.id, formData as FireAuditFormData);
          break;
        case 'ladder':
          result = await insertLadderAudit(audit.id, formData as LadderAuditFormData);
          break;
        case 'custodial':
          result = await insertCustodialAudit(audit.id, formData as CustodialAuditFormData);
          break;
      }
      console.log('Specific audit details inserted:', result);
    } catch (error) {
      console.error('Failed to insert specific audit details:', error);
      throw error;
    }

    return audit.id;
  } catch (error) {
    console.error('Audit insertion failed:', error);
    throw error;
  }
}

async function insertFireAudit(auditId: string, formData: FireAuditFormData) {
  // Upload maintenance tag photo if exists
  let maintenanceTagPhotoUrl = null;
  if (formData.maintenanceTagPhoto) {
    maintenanceTagPhotoUrl = await uploadImage(
      formData.maintenanceTagPhoto,
      'fire',
      `maintenance-tag-${auditId}`
    );
  }

  const { error } = await supabase
    .from('fire_extinguisher_audits')
    .insert({
      audit_id: auditId,
      extinguisher_location: formData.extinguisherLocation,
      serial_number: formData.serialNumber,
      manufacture_date: `${formData.manufactureDate.year}-${formData.manufactureDate.month}-01`,
      expiry_date: `${formData.expiryDate.year}-${formData.expiryDate.month}-01`,
      type: formData.type,
      size: formData.size,
      rating: formData.rating,
      inspection_results: formData.inspectionResults,
      maintenance_tag_photo: maintenanceTagPhotoUrl,
      overall_condition: formData.overallCondition,
    });

  if (error) throw error;
  return auditId;
}

async function insertLadderAudit(auditId: string, formData: LadderAuditFormData) {
  // Upload defect photo if exists
  let defectPhotoUrl = null;
  if (formData.defectPhoto) {
    defectPhotoUrl = await uploadImage(
      formData.defectPhoto,
      'ladder',
      `defect-${auditId}`
    );
  }

  const { error } = await supabase
    .from('ladder_details')
    .insert({
      audit_id: auditId,
      ladder_location: formData.ladderLocation,
      reference_number: formData.referenceNumber,
      type: formData.type,
      length: formData.length,
      construction: formData.construction,
      class: formData.class,
      defect_photo: defectPhotoUrl,
      overall_condition: formData.overallCondition,
    });

  if (error) throw error;

  // Insert inspection answers
  const answers = Object.entries(formData.inspectionResults).map(([question_id, answer]) => ({
    audit_id: auditId,
    question_id,
    question_text: question_id, // You might want to store the actual question text
    answer
  }));

  const { error: answersError } = await supabase
    .from('ladder_answers')
    .insert(answers);

  if (answersError) throw answersError;
  return auditId;
}

async function insertCustodialAudit(auditId: string, formData: CustodialAuditFormData) {
  // Insert inspection answers
  const answers = Object.entries(formData.inspectionResults).map(([area_name, rating]) => ({
    audit_id: auditId,
    area_name,
    rating
  }));

  const { error } = await supabase
    .from('custodial_answers')
    .insert(answers);

  if (error) throw error;
  return auditId;
}

async function insertLandscapingAudit(auditId: string, formData: LandscapingAuditFormData) {
  console.log('Inserting landscaping audit answers:', {
    auditId,
    answers: formData.inspectionResults
  });
  
  // Insert inspection answers
  const answers = Object.entries(formData.inspectionResults).map(([area_name, rating]) => ({
    audit_id: auditId,
    area_name,
    rating,
    created_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('landscaping_answers')
    .insert(answers)
    .select();

  if (error) {
    console.error('Error inserting landscaping answers:', error);
    throw new DatabaseError('Failed to insert landscaping answers', error.code);
  }

  console.log('Landscaping answers inserted:', data);
  return data;
}

export async function searchAudits(searchTerm: string) {
  const { data, error } = await supabase
    .from('audits')
    .select(`
      id,
      audit_type,
      audit_date,
      auditors (
        name,
        email
      ),
      locations (
        name
      )
    `)
    .or(`
      auditors.name.ilike.%${searchTerm}%,
      auditors.email.ilike.%${searchTerm}%,
      locations.name.ilike.%${searchTerm}%
    `)
    .order('audit_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAuditWithImages(auditId: string, auditType: string) {
  const { data, error } = await supabase
    .from(`${auditType}_audits`)
    .select(`
      *,
      audit:audits (
        auditor:auditors (name, email),
        location:locations (name),
        audit_date
      )
    `)
    .eq('audit_id', auditId)
    .single();

  if (error) throw error;
  return data;
}

// Add this function to test the connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      return false;
    }

    console.log('Connection successful:', data);
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    return false;
  }
}

// Add this test function
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }

    console.log('Connection test successful:', data);
    return true;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
}

// Add connection test function
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('auditors')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      throw new DatabaseConnectionError('Failed to connect to database');
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
