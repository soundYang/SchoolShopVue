export function safeArray(val) {
  if (Array.isArray(val)) return val

  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}
