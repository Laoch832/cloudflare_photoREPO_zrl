const cache = new Map()

export async function fetchJsonCached(url, init) {
  if (cache.has(url)) return cache.get(url)
  const res = await fetch(url, init)
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  cache.set(url, data)
  return data
}
