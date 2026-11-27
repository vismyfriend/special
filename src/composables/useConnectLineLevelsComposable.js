/**
 * ============================================================
 *  src/composables/useConnectLineLevelsComposable.js
 * ------------------------------------------------------------
 *  Загрузка/сохранение уровней ConnectLine через бэкенд.
 *  Формат ответа бэкенда → формат connectLineGames (как ждёт игра).
 *
 *  BASE_URL пока хардкод (localhost), позже — import.meta.env.VITE_API_URL.
 * ============================================================
 */

import { ref } from 'vue'
import { httpClient } from 'src/api/modules/httpClient'

const levelTimeout = 10000

// const BASE_URL = 'https://special-agents-backend.onrender.com'
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
// вот эта для локального доступа

// const baseURL = 'https://api.special-agents.ru' // прод Егорчика


export function loadConnectLineImage(src, { crossOrigin, signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const image = new Image()
    const finish = (callback, result) => {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', abort)
      image.onload = null
      image.onerror = null
      callback(result)
    }
    const cancel = (error) => {
      finish(reject, error)
      image.removeAttribute('src')
    }
    const abort = () => cancel(signal.reason)
    const timeout = setTimeout(() => cancel(new Error('Картинка не загрузилась вовремя.')), levelTimeout)
    signal?.addEventListener('abort', abort, { once: true })

    if (crossOrigin) image.crossOrigin = crossOrigin
    image.onload = () => finish(resolve, image)
    image.onerror = () => finish(reject, new Error('Не удалось загрузить картинку уровня.'))
    image.src = src
  })
}

/**
 * Преобразует запись из БД в формат, который ждёт setupBoard:
 * { title, instructions, imageWidth, imageHeight, crop, image, words }
 */
function backendToGameFormat(record) {
  const imagePath = record.image_url ||
    (record.image_filename ? `/uploads/${encodeURIComponent(record.image_filename)}` : null)
  return {
    title: record.visible_name,
    instructions: 'Протяни линию от названия к нужному месту на картинке',
    imageWidth: record.image_width,
    imageHeight: record.image_height,
    crop: record.crop || null,
    image: imagePath ? new URL(imagePath, httpClient.defaults.baseURL).href : null,
    words: (record.points || []).map((p) => ({ ...p })),
  }
}

export function useConnectLineLevelsComposable() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * GET /connect-line → список уровней (как есть, для выпадашки).
   */
  async function fetchLevels() {
    loading.value = true
    error.value = null
    try {
      const { data } = await httpClient.get('/connect-line', { timeout: levelTimeout })
      return Array.isArray(data) ? data : []
    } catch (e) {
      console.error('[useConnectLineLevels] fetchLevels:', e)
      error.value = e.message || 'Ошибка загрузки уровней'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * GET /connect-line/:levelName → один уровень в формате игры.
   */
  async function fetchLevel(levelName, { signal } = {}) {
    loading.value = true
    error.value = null
    try {
      const { data } = await httpClient.get(`/connect-line/${encodeURIComponent(levelName)}`, {
        timeout: levelTimeout,
        signal,
      })
      if (!data || !Array.isArray(data.points)) throw new Error('Unexpected ConnectLine response')
      return backendToGameFormat(data)
    } catch (e) {
      if (signal?.aborted) return null
      const status = e.response?.status
      if (status === 404) error.value = 'Уровень не найден.'
      else if (status === 401 || status === 403) error.value = 'Для этого уровня нужен доступ. Проверь вход.'
      else error.value = 'Не удалось загрузить уровень. Попробуй ещё раз.'
      return null
    } finally {
      if (!signal?.aborted) loading.value = false
    }
  }

  /**
   * POST /connect-line (новый) или PUT /connect-line/:levelName (существующий).
   * payload: { levelName, visibleName, points, crop, imageWidth, imageHeight, isPublic }
   * isNew=true → POST, иначе PUT.
   */
  async function saveLevel(payload, isNew = true) {
    loading.value = true
    error.value = null
    try {
      if (isNew) {
        const { data } = await httpClient.post('/connect-line', payload)
        return data
      } else {
        const { levelName, ...rest } = payload
        const { data } = await httpClient.put(
          `/connect-line/${encodeURIComponent(levelName)}`,
          rest
        )
        return data
      }
    } catch (e) {
      console.error('[useConnectLineLevels] saveLevel:', e)
      error.value = e.response?.data?.message || e.message || 'Ошибка сохранения'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * POST /connect-line/:levelName/image — загрузка картинки (multipart).
   * file — File из <input type="file">.
   */
  async function uploadImage(levelName, file) {
    loading.value = true
    error.value = null
    try {
      const form = new FormData()
      form.append('image', file)
      const { data } = await httpClient.post(
        `/connect-line/${encodeURIComponent(levelName)}/image`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    } catch (e) {
      console.error('[useConnectLineLevels] uploadImage:', e)
      error.value = e.response?.data?.message || e.message || 'Ошибка загрузки картинки'
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, fetchLevels, fetchLevel, saveLevel, uploadImage }
}
