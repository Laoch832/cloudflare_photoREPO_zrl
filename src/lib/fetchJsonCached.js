const jsonPromiseCache = new Map()

export function fetchJsonCached(url, init) {
  if (jsonPromiseCache.has(url)) return jsonPromiseCache.get(url)

  const promise = fetch(url, init).then(async (res) => {
    if (!res.ok) {
      const err = new Error(`Request failed: ${res.status}`)
      err.status = res.status
      throw err
    }
    return res.json()
  })

  jsonPromiseCache.set(url, promise)
  promise.catch(() => {
    jsonPromiseCache.delete(url)
  })

  return promise
}

