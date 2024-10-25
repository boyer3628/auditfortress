import { runDatabaseTests } from '../lib/tests/db.test';

async function main() {
  try {
    await runDatabaseTests();
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Tests failed:', error);
    process.exit(1);
  }
}

main();
