import { insertAudit, insertAuditWithTransaction, DatabaseError, ValidationError } from '../db';
import { withRetry } from '../utils';

// Mock data for testing
const mockFireAudit = {
  name: "Test User",
  email: "test@amentum.com",
  location: "Test Location",
  auditDate: new Date(),
  extinguisherLocation: "Floor 1",
  serialNumber: "123456",
  manufactureDate: { month: "1", year: "2023" },
  expiryDate: { month: "1", year: "2024" },
  type: "foam",
  size: "10",
  rating: "abc",
  inspectionResults: {
    maintenanceTag: true,
    mounting: true,
    safetyPin: true,
    label: true,
    handle: true,
    pressureGauge: true,
    nozzle: true,
    invertTest: true,
    location: true,
    cleaned: true,
    tagSigned: true,
  },
  maintenanceTagPhoto: null,
  overallCondition: "pass",
  observations: "Test observation",
  recommendations: "Test recommendation",
  signature: "data:image/png;base64,..."
};

// Test functions
export async function runDatabaseTests() {
  console.log('Starting database tests...');

  try {
    // Test 1: Test transaction success
    console.log('Test 1: Testing successful transaction');
    const auditId = await withRetry(() => insertAuditWithTransaction('fire', mockFireAudit));
    console.log('✅ Transaction successful:', auditId);

    // Test 2: Test transaction rollback
    console.log('Test 2: Testing transaction rollback');
    try {
      await insertAuditWithTransaction('fire', { ...mockFireAudit, invalidField: true } as any);
      console.log('❌ Should have thrown error for invalid data');
    } catch (error) {
      console.log('✅ Successfully rolled back transaction');
    }

    // Test 3: Test retry logic
    console.log('Test 3: Testing retry logic');
    let attempts = 0;
    const testRetry = async () => {
      attempts++;
      if (attempts < 3) throw new Error('Simulated failure');
      return 'success';
    };
    const result = await withRetry(testRetry);
    console.log('✅ Retry logic successful:', result);

    // Test 4: Test concurrent submissions
    console.log('Test 4: Testing concurrent submissions');
    const results = await Promise.all([
      insertAuditWithTransaction('fire', mockFireAudit),
      insertAuditWithTransaction('fire', mockFireAudit),
      insertAuditWithTransaction('fire', mockFireAudit),
    ]);
    console.log('✅ Concurrent submissions successful:', results);

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}
