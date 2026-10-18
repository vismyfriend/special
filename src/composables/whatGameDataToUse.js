// src/composables/whatGameDataToUse.js
import { ref } from 'vue';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import shortWordsData from '../dataForGames/short-words-data';

// ============================================================
// КЕШ (чтобы не грузить одну и ту же таблицу дважды)
// ============================================================
const cache = new Map();

// ============================================================
// ПАРСИНГ missionName
// ============================================================
/**
 * Разбирает missionName на части:
 * - 'gsheet:ID'              → { type: 'gsheet', sheetId: 'ID', student: null }
 * - 'gsheet:ID?student=Sam'  → { type: 'gsheet', sheetId: 'ID', student: 'Sam' }
 * - 'halloween'              → { type: 'file', missionName: 'halloween' }
 */
const parseMissionName = (missionName) => {
  if (!missionName) {
    return { type: 'file', missionName: '' };
  }

  if (missionName.startsWith('gsheet:')) {
    const parts = missionName.replace('gsheet:', '').split('?');
    const sheetId = parts[0];
    const params = new URLSearchParams(parts[1] || '');
    const student = params.get('student');

    return { type: 'gsheet', sheetId, student };
  }

  return { type: 'file', missionName };
};

// ============================================================
// ЗАГРУЗКА ИЗ ФАЙЛА
// ============================================================
const loadFromFile = (missionName) => {
  if (!missionName) return [];

  // Прямое совпадение
  if (shortWordsData[missionName]) {
    return shortWordsData[missionName];
  }

  // Поиск по уровням (как было раньше)
  for (const level in shortWordsData) {
    if (shortWordsData[level] && shortWordsData[level][missionName]) {
      return shortWordsData[level][missionName];
    }
  }

  return [];
};

// ============================================================
// ЗАГРУЗКА ИЗ GOOGLE ТАБЛИЦЫ
// ============================================================
const loadFromGSheet = async (sheetId, studentFilter) => {
  // Проверяем кеш
  const cacheKey = `gsheet:${sheetId}:${studentFilter || 'all'}`;
  if (cache.has(cacheKey)) {
    console.log('[whatGameDataToUse] Из кеша:', cacheKey);
    return cache.get(cacheKey);
  }

  const parser = new PublicGoogleSheetsParser(sheetId);
  const data = await parser.parse();

  // Фильтр по студенту
  let filtered = data;
  if (studentFilter) {
    filtered = data.filter(row => {
      const name = row.student_name || row['student name'] || row['имя студента'] || '';
      return name.trim().toLowerCase() === studentFilter.trim().toLowerCase();
    });
  }

  // Приводим к единому формату
  const words = filtered.map((row, index) => ({
    id: index + 1,
    ru: row.translation || row['russian word'] || row.ru || row['перевод'] || '',
    eng: row.word || row['english word'] || row.eng || row['слово'] || '',
    transcription: row.transcription || row['транскрипция'] || '',
  }));

  // Сохраняем в кеш
  cache.set(cacheKey, words);
  console.log('[whatGameDataToUse] Загружено из gsheet:', words.length, 'слов');

  return words;
};

// ============================================================
// ОСНОВНОЙ COMPOSABLE
// ============================================================
export function whatGameDataToUse() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Универсальная загрузка слов.
   * @param {string} missionName — 'halloween' или 'gsheet:ID?student=Sam'
   * @returns {Promise<Array>} — массив { id, ru, eng, transcription }
   */
  const loadWords = async (missionName) => {
    loading.value = true;
    error.value = null;

    try {
      const parsed = parseMissionName(missionName);

      if (parsed.type === 'gsheet') {
        return await loadFromGSheet(parsed.sheetId, parsed.student);
      }

      return loadFromFile(parsed.missionName);
    } catch (e) {
      console.error('[whatGameDataToUse] Ошибка загрузки:', e);
      error.value = e.message || 'Не удалось загрузить данные';
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Сбросить кеш (полезно, если данные в таблице изменились).
   */
  const clearCache = () => {
    cache.clear();
    console.log('[whatGameDataToUse] Кеш очищен');
  };

  return {
    loading,
    error,
    loadWords,
    clearCache,
  };
}
