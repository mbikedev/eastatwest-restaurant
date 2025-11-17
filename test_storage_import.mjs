console.log('Testing storage module import in project context...')
try {
  const storage = await import('./src/utils/storage.ts')
  console.log('✓ Storage module imported')
  console.log('  Exports:', Object.keys(storage))
  console.log('  safeGetItem:', typeof storage.safeGetItem)
  console.log('  Test result:', storage.safeGetItem('test'))
  console.log('\n✓ All checks passed - no errors!')
} catch (error) {
  console.error('✗ Import failed:', error.message)
  console.error(error.stack)
}
