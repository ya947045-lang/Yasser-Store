import { seedDatabase } from '../src/services/seed.js';

seedDatabase().then(() => {
  console.log('Seed completed');
  process.exit(0);
}).catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
