// src/composables/whatGameDataToUse.js
import { ref } from 'vue';
import PublicGoogleSheetsParser from 'public-google-sheets-parser';
import shortWordsData from '../dataForGames/short-words-data';
import { allGamesAndSetsOfWordsList } from '../dataForGames/allGamesAndSetsOfWordsList';
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
// ИСТОЧНИК МИССИИ (для роутинга)
// ============================================================
/**
 * Возвращает описание источника миссии или null.
 * - gsheet: { kind: 'gsheet', sheetId, student, canonical }
 * - file:   { kind: 'file', name, canonical }
 */
export function parseMissionSource(missionName) {
  if (!missionName) return null;

  if (missionName.startsWith('gsheet:')) {
    const rest = missionName.slice('gsheet:'.length);
    const [sheetId, queryStr = ''] = rest.split('?');
    const params = new URLSearchParams(queryStr);
    return {
      kind: 'gsheet',
      sheetId,
      student: params.get('student') || null,
      canonical: missionName,
    };
  }

  return {
    kind: 'file',
    name: missionName,
    canonical: missionName,
  };
}

/**
 * Собирает URL к see-all-sets-of-words для данного missionName.
 * Кодирует missionName целиком как один сегмент пути,
 * чтобы '?' и ':' не ломали URL.
 */
export function missionToAllSetsRoute(missionName, basePath = '/see-all-sets-of-words') {
  const src = parseMissionSource(missionName);
  if (!src) return basePath;
  return `${basePath}/${encodeURIComponent(src.canonical)}`;
}

// ============================================================
// ЗАГРУЗКА ИЗ ФАЙЛА
// ============================================================
const loadFromFile = (missionName) => {
  if (!missionName) return [];

  // Прямое совпадение по ключу в shortWordsData
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
    hint: row.hint ||
      row['транскрипция'] ||
      row.pronunciation ||
      row['произношение'] ||
      row.transcription || '',
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
   * @returns {Promise<Array>} — массив { id, ru, eng, hint }
   */
  const loadWords = async (missionName) => {
    loading.value = true;
    error.value = null;

    try {
      const parsed = parseMissionName(missionName);

      if (parsed.type === 'gsheet') {
        return await loadFromGSheet(parsed.sheetId, parsed.student);
      }

      // 1️⃣ Пробуем как обычно — файл или ключ в shortWordsData
      const fromFile = loadFromFile(parsed.missionName);
      if (fromFile && fromFile.length > 0) {
        return fromFile;
      }

      // 2️⃣ Fallback: ищем в списке миссий по missionVisibleName
      //    (это нужно, когда в URL пришло короткое имя gsheet-миссии)
      const missionEntry = allGamesAndSetsOfWordsList.find(
        m => m.missionVisibleName === parsed.missionName
      );

      if (missionEntry && missionEntry.missionName?.startsWith('gsheet:')) {
        const gParsed = parseMissionName(missionEntry.missionName);
        if (gParsed.type === 'gsheet') {
          console.log('[whatGameDataToUse] Fallback: нашли gsheet по missionVisibleName:', missionEntry.missionName);
          return await loadFromGSheet(gParsed.sheetId, gParsed.student);
        }
      }

      return [];
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
