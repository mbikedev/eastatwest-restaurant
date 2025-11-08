'use client'

import { useEffect, useState } from 'react'
import { safeGetItem, safeSetItem, isStorageAvailable } from '@/utils/storage'

export default function TestStoragePage() {
  const [status, setStatus] = useState<string>('Testing...')
  
  useEffect(() => {
    try {
      const available = isStorageAvailable()
      const testValue = safeGetItem('test')
      const setResult = safeSetItem('test', 'hello')
      
      setStatus(`
        Storage Available: ${available}
        Get Item: ${testValue}
        Set Item: ${setResult}
      `)
    } catch (error) {
      setStatus(`Error: ${error}`)
    }
  }, [])
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Storage Test</h1>
      <pre>{status}</pre>
    </div>
  )
}
