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

// const BASE_URL = 'http://localhost:3001'


// const BASE_URL = 'https://special-agents-backend.onrender.com'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
// вот эта для локального доступа

/**
 * Преобразует запись из БД в формат, который ждёт setupBoard:
 * { title, instructions, imageWidth, imageHeight, crop, image, words }
 */
function backendToGameFormat(record) {
  return {
    title: record.visible_name,
    instructions: 'Протяни линию от названия к нужному месту на картинке',
    imageWidth: record.image_width,
    imageHeight: record.image_height,
    crop: record.crop || null,
    image: record.image_filename
      ? `${BASE_URL}/uploads/${record.image_filename}`
      : null,
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
      const { data } = await httpClient.get('/connect-line')
      return data
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
  async function fetchLevel(levelName) {
    loading.value = true
    error.value = null
    try {
      const { data } = await httpClient.get(`/connect-line/${encodeURIComponent(levelName)}`)
      return backendToGameFormat(data)
    } catch (e) {
      console.error('[useConnectLineLevels] fetchLevel:', e)
      error.value = e.message || 'Ошибка загрузки уровня'
      return null
    } finally {
      loading.value = false
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
