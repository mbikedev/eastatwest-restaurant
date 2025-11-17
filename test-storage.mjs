// Test the storage utilities in a Node environment (should all return null/false)
import { safeGetItem, safeSetItem, isStorageAvailable } from './src/utils/storage.ts';

console.log('Testing storage utilities in Node.js (SSR simulation)...');
console.log('isStorageAvailable():', isStorageAvailable());
console.log('safeGetItem("test"):', safeGetItem("test"));
console.log('safeSetItem("test", "value"):', safeSetItem("test", "value"));
console.log('All tests passed - no errors thrown!');
