// Simulate a broken localStorage polyfill (like what's happening on the server)
global.localStorage = {};  // Empty object with no methods

console.log('Testing with BROKEN localStorage polyfill...')
console.log('typeof localStorage:', typeof global.localStorage)
console.log('typeof localStorage.getItem:', typeof global.localStorage.getItem)

try {
  const storage = await import('./src/utils/storage.ts')
  console.log('\n✓ Module imported without error')
  
  const available = storage.isStorageAvailable()
  console.log('isStorageAvailable():', available)
  
  const value = storage.safeGetItem('test')
  console.log('safeGetItem("test"):', value)
  
  const setResult = storage.safeSetItem('test', 'hello')
  console.log('safeSetItem("test", "hello"):', setResult)
  
  console.log('\n✓ All operations completed without throwing errors!')
} catch (error) {
  console.error('\n✗ Error:', error.message)
}
