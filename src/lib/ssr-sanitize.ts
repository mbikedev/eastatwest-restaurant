/**
 * SSR Sanitizer for broken localStorage/sessionStorage polyfills
 *
 * Context:
 * - In some dev environments or test runners, a server-side polyfill sets
 *   global/local `localStorage` to an object without the standard methods.
 *   Example: Warning: `--localstorage-file` was provided without a valid path
 * - This leads to runtime TypeError: localStorage.getItem is not a function during SSR.
 *
 * What this does:
 * - On the server (when `window` is undefined), detect if `globalThis.localStorage`
 *   and/or `globalThis.sessionStorage` exist but are broken (missing standard methods
 *   or not actually usable).
 * - If broken, replace them with safe in-memory implementations that implement the
 *   standard Storage API shape. This prevents TypeErrors while keeping semantics harmless
 *   on the server (non-persistent).
 *
 * How to use:
 * - Import this module as early as possible in your app's server entry point.
 *   For Next.js (App Router), add near the top of src/app/layout.tsx:
 *
 *     import '@/lib/ssr-sanitize'
 *
 * - This module has side effects that sanitize the environment at import time.
 */

type StorageLike = {
  readonly length: number
  clear(): void
  getItem(key: string): string | null
  key(index: number): string | null
  removeItem(key: string): void
  setItem(key: string, value: string): void
}

const isDev =
  typeof process !== 'undefined' &&
  process &&
  (process.env?.NODE_ENV === 'development' || process.env?.NODE_ENV === 'test')

/**
 * Determine if a provided candidate behaves like the Web Storage API
 * and is actually usable (round trip set/get/remove).
 */
function isUsableStorage(candidate: unknown): candidate is StorageLike {
  try {
    if (!candidate || typeof candidate !== 'object') return false

    const obj = candidate as Record<string, unknown>

    const hasFns =
      typeof obj.getItem === 'function' &&
      typeof obj.setItem === 'function' &&
      typeof obj.removeItem === 'function' &&
      typeof obj.clear === 'function' &&
      typeof obj.key === 'function'

    if (!hasFns) return false

    // Round-trip test (some “polyfills” exist but throw or do nothing)
    const api = obj as unknown as StorageLike
    const testKey = '__ssr_storage_sanity_check__'
    api.setItem(testKey, 'ok')
    const got = api.getItem(testKey)
    api.removeItem(testKey)
    return got === 'ok'
  } catch {
    return false
  }
}

/**
 * Create a safe in-memory Storage-like object.
 * This behaves like browser localStorage but is ephemeral to the server process.
 */
function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>()

  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    key(index: number) {
      // Map preserves insertion order
      const keys = Array.from(store.keys())
      return index >= 0 && index < keys.length ? keys[index] : null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value))
    },
  }
}

/**
 * Replace a broken global storage with a safe in-memory implementation.
 */
function patchGlobalStorage(name: 'localStorage' | 'sessionStorage') {
  try {
    const current = (globalThis as any)[name]

    if (isUsableStorage(current)) {
      // Already good. Nothing to do.
      return
    }

    const memoryStorage = createMemoryStorage()

    // Define (or redefine) property to the memory storage
    Object.defineProperty(globalThis as any, name, {
      configurable: true,
      enumerable: false,
      writable: true, // allow other tooling to override if needed
      value: memoryStorage,
    })

    if (isDev) {
      // eslint-disable-next-line no-console
      console.warn(
        `[SSR Sanitize] Replaced broken global ${name} with in-memory implementation for server-side safety.`
      )
    }
  } catch {
    // Silently ignore; never throw in sanitizer
  }
}

/**
 * Main entry to sanitize SSR environment.
 * Only runs when `window` is undefined (server/SSR).
 */
export function sanitizeSSRStorage(): void {
  try {
    // Only act on the server; browsers have real storage
    if (typeof window !== 'undefined') return

    // Some environments define globalThis.localStorage as a plain object (broken)
    patchGlobalStorage('localStorage')
    patchGlobalStorage('sessionStorage')
  } catch {
    // Never let sanitizer crash SSR
  }
}

// Run immediately on import for convenience
sanitizeSSRStorage()

export default sanitizeSSRStorage
