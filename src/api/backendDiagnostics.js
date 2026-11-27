import axios from 'axios'

export function createBackendDiagnostics(address, signal) {
  const url = new URL(address.trim())
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Укажи адрес API, начиная с https:// или http://, без логина и параметров.')
  }

  // Public diagnostics must never send the app token to a manually entered host.
  const client = axios.create({
    baseURL: url.href.replace(/\/+$/, ''),
    timeout: 10000,
    signal,
  })

  return {
    async check(path) {
      const startedAt = performance.now()
      try {
        const { status, data } = await client.get(path)
        const isHtml = typeof data === 'string' && /^\s*</.test(data)
        const isSnapshot = Array.isArray(data?.users) && Array.isArray(data?.scores)
        const valid = path === '/db' ? isSnapshot : typeof data === 'string' && data.trim() && !isHtml
        return {
          state: valid ? 'ok' : 'unexpected',
          status,
          duration: Math.round(performance.now() - startedAt),
          snapshot: path === '/db' && valid ? data : null,
        }
      } catch (error) {
        const status = error.response?.status
        const timedOut = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
        return {
          state: status ? 'http-error' : timedOut ? 'timeout' : 'network-error',
          status,
          duration: Math.round(performance.now() - startedAt),
        }
      }
    },
  }
}
