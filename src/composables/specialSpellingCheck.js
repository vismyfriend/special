// src/composables/specialSpellingCheck.js
import { ref } from 'vue'

/**
 * Composable для проверки ответов студентов.
 *
 * ТРИ РЕЖИМА:
 * - strictCheck — точное совпадение (символ в символ, кроме регистра)
 * - usualCheck — допускает сокращения (формальные и разговорные) и вариации апострофов/пунктуации
 * - lightCheck — допускает 1 опечатку на слово (кроме строгих слов) + автозамена частых опечаток
 *
 * ОСОБЕННОСТИ:
 * - ain't = am not / is not / are not / have not / has not (универсальное отрицание)
 * - gonna, wanna, gotta, gimme, lemme, dunno, kinda, sorta, outta, hafta, 'em, ya — разговорные сокращения
 * - don't, doesn't, didn't, won't, can't, couldn't, haven't, isn't, aren't и т.д.
 * - were ≠ we are, its ≠ it's, im ≠ I'm (грамотность важна)
 * - fixCommonTypos работает ТОЛЬКО в lightCheck (в strict и usual — нет)
 *
 * Настройки можно задавать при создании:
 *   useSpellingCheck({
 *     strictWords: [...],
 *     shortWordMaxLength: 3,
 *     maxTypos: 1,
 *     fixCommonTypos: true,
 *   })
 */
export function useSpellingCheck(options = {}) {
  const {
    // Слова, которые должны совпадать ТОЧНО (без опечаток, без сокращений)
    strictWords = [
      'he', 'his', 'she', 'her', 'you', 'your', 'we', 'our', 'it',
      'is', 'are', 'was', 'were', 'do', 'does', 'did',
      'have', 'has', 'had', 'who', 'why', 'what', 'when', 'where'
    ],
    // Слова короче или равные этой длине НЕ допускают опечаток
    shortWordMaxLength = 3,
    // Максимум опечаток на слово в lightCheck
    maxTypos = 1,
    // Исправлять ли частые опечатки (recieve → receive) — ТОЛЬКО в lightCheck
    fixCommonTypos = true,
    // Логировать ли в консоль (для отладки)
    log = false,
  } = options

  // ==================== БАЗОВАЯ НОРМАЛИЗАЦИЯ ====================
  const normalizeAnswer = (answer) => {
    if (!answer || typeof answer !== 'string') return ''

    let result = answer
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.,!?;:…–—]+$/g, '')
      .replace(/[.,!?;:…–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[`'‘’´]/g, "'")
      .replace(/\s+/g, ' ')
      .trim()


    // === Снимаем обрамляющие скобки и кавычки для транскрипций ===
    // /кот/ → кот, [ кот ] → кот, (кот) → кот, {кот} → кот, «кот» → кот, "кот" → кот, 'кот' → кот
    result = result
      .replace(/^[\s/\\[\](){}«»""''`]+/g, '')
      .replace(/[\s/\\[\](){}«»""''`]+$/g, '')
      .trim()

    // === Внутренняя шутка: Verbs = Vincent = V ===
    // Приводим к единому токену, чтобы все три режима считали их равными.
    result = result
      .replace(/\bverb\b/g, 'vincent')
      .replace(/\bvincent\b/g, 'vincent')
      .replace(/\bv\b/g, 'vincent')

    return result
  }

  // ==================== ИСПРАВЛЕНИЕ ЧАСТЫХ ОПЕЧАТОК ====================
  /**
   * Заменяет известные опечатки на правильные слова.
   * Используется ТОЛЬКО в lightCheck.
   */
  const fixTypos = (text) => {
    if (!text || typeof text !== 'string') return ''
    if (!fixCommonTypos) return text

    return text
      .replace(/\brecieve\b/g, 'receive')
      .replace(/\bdefinately\b/g, 'definitely')
      .replace(/\bseperate\b/g, 'separate')
      .replace(/\boccured\b/g, 'occurred')
  }

  // ==================== РАЗВОРАЧИВАНИЕ СОКРАЩЕНИЙ ====================
  const expandContractions = (text) => {
    if (!text || typeof text !== 'string') return ''

    let result = normalizeAnswer(text)

    result = result
      // === DO / DOES / DID ===
      .replace(/\bdon't\b/g, 'do not')
      .replace(/\bdoesn't\b/g, 'does not')
      .replace(/\bdidn't\b/g, 'did not')
      .replace(/\b(?:dont|doesnt|didnt)\b/g, (m) => ({
        dont: 'do not',
        doesnt: 'does not',
        didnt: 'did not',
      }[m]))

      // === WILL / WOULD / SHALL ===
      .replace(/\bwon't\b/g, 'will not')
      .replace(/\bwouldn't\b/g, 'would not')
      .replace(/\bshan't\b/g, 'shall not')
      .replace(/\b(?:wont|wouldnt|shant)\b/g, (m) => ({
        wont: 'will not',
        wouldnt: 'would not',
        shant: 'shall not',
      }[m]))

      // === CAN / CANNOT ===
      .replace(/\bcannot\b/g, 'can not')
      .replace(/\bcan't\b/g, 'can not')
      .replace(/\bcant\b/g, 'can not')

      // === COULD / MIGHT / MUST / SHOULD / NEED / DARE ===
      .replace(/\bcouldn't\b/g, 'could not')
      .replace(/\bmightn't\b/g, 'might not')
      .replace(/\bmustn't\b/g, 'must not')
      .replace(/\bshouldn't\b/g, 'should not')
      .replace(/\bneedn't\b/g, 'need not')
      .replace(/\bdaren't\b/g, 'dare not')
      .replace(/\b(?:couldnt|mightnt|mustnt|shouldnt|neednt|darent)\b/g, (m) => ({
        couldnt: 'could not',
        mightnt: 'might not',
        mustnt: 'must not',
        shouldnt: 'should not',
        neednt: 'need not',
        darent: 'dare not',
      }[m]))

      // === HAVE / HAS / HAD ===
      .replace(/\bhaven't\b/g, 'have not')
      .replace(/\bhasn't\b/g, 'has not')
      .replace(/\bhadn't\b/g, 'had not')
      .replace(/\b(?:havent|hasnt|hadnt)\b/g, (m) => ({
        havent: 'have not',
        hasnt: 'has not',
        hadnt: 'had not',
      }[m]))

      // === TO BE: отрицания (с апострофом и без) ===
      .replace(/\bisn't\b/g, 'is not')
      .replace(/\baren't\b/g, 'are not')
      .replace(/\bwasn't\b/g, 'was not')
      .replace(/\bweren't\b/g, 'were not')
      .replace(/\b(?:isnt|arent|wasnt|werent)\b/g, (m) => ({
        isnt: 'is not',
        arent: 'are not',
        wasnt: 'was not',
        werent: 'were not',
      }[m]))

      // === TO BE: утверждения — только с обязательным апострофом ===
      .replace(/\bi'm\b/g, 'i am')
      .replace(/\byou're\b/g, 'you are')
      .replace(/\bwe're\b/g, 'we are')
      .replace(/\bthey're\b/g, 'they are')
      .replace(/\bhe's\b/g, 'he is')
      .replace(/\bshe's\b/g, 'she is')
      .replace(/\bit's\b/g, 'it is')

      // === WILL / WOULD — только с обязательным апострофом ===
      .replace(/\b([a-z]+)'ll\b/gi, '$1 will')
      .replace(/\b(i|you|he|she|we|they|it)'d\b/g, '$1 would')

      // === HAS / HAVE — только с обязательным апострофом ===
      .replace(/\b([a-z]+)'ve\b/gi, '$1 have')

      // === РАЗГОВОРНЫЕ СОКРАЩЕНИЯ ===
      // ain't → am not (базовый вариант, но usualCheck/lightCheck умеют сравнивать с любой формой)
      .replace(/\bain't\b/g, 'am not')
      .replace(/\baint\b/g, 'am not')

      // gonna → going to
      .replace(/\bgonna\b/g, 'going to')

      // wanna → want to
      .replace(/\bwanna\b/g, 'want to')

      // gotta → got to
      .replace(/\bgotta\b/g, 'got to')

      // gimme → give me
      .replace(/\bgimme\b/g, 'give me')

      // lemme → let me
      .replace(/\blemme\b/g, 'let me')

      // dunno → do not know
      .replace(/\bdunno\b/g, 'do not know')

      // kinda → kind of
      .replace(/\bkinda\b/g, 'kind of')

      // sorta → sort of
      .replace(/\bsorta\b/g, 'sort of')

      // outta → out of
      .replace(/\boutta\b/g, 'out of')

      // hafta → have to
      .replace(/\bhafta\b/g, 'have to')

      // 'em → them (без \b слева — апостроф сам отделяет слово)
      .replace(/'em\b/g, 'them')

      // ya → you
      .replace(/\bya\b/g, 'you')

    return result.replace(/\s+/g, ' ').trim()
  }

  // ==================== ОСОБАЯ ОБРАБОТКА ain't ====================
  const isAintMatch = (userExpanded, correctExpanded) => {
    if (!/\bam not\b/.test(userExpanded)) return false

    const variants = [
      userExpanded.replace(/\bam not\b/g, 'is not'),
      userExpanded.replace(/\bam not\b/g, 'are not'),
      userExpanded.replace(/\bam not\b/g, 'have not'),
      userExpanded.replace(/\bam not\b/g, 'has not'),
    ]

    return variants.some(v => v === correctExpanded)
  }

  // ==================== РАССТОЯНИЕ ЛЕВЕНШТЕЙНА ====================
  const levenshteinDistance = (a, b) => {
    if (a === b) return 0
    if (!a) return b.length
    if (!b) return a.length

    const matrix = []
    for (let i = 0; i <= b.length; i++) matrix[i] = [i]
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    return matrix[b.length][a.length]
  }

  // ==================== ПРОВЕРКА ОДНОГО СЛОВА ====================
  const isWordCloseEnough = (userWord, correctWord) => {
    if (userWord === correctWord) return true

    const isStrict = strictWords.includes(correctWord)
    const isShort = correctWord.length <= shortWordMaxLength

    if (isStrict || isShort) return false

    const distance = levenshteinDistance(userWord, correctWord)
    return distance <= maxTypos
  }

  // ==================== ПРОВЕРКА ПРЕДЛОЖЕНИЯ ====================
  const isSentenceCloseEnough = (userSentence, correctSentence) => {
    const userWords = userSentence.split(' ').filter(Boolean)
    const correctWords = correctSentence.split(' ').filter(Boolean)

    if (userWords.length !== correctWords.length) return false

    for (let i = 0; i < correctWords.length; i++) {
      if (!isWordCloseEnough(userWords[i], correctWords[i])) {
        return false
      }
    }

    return true
  }

  // ==================== ТРИ РЕЖИМА ПРОВЕРКИ ====================

  /**
   * 🔒 STRICT CHECK — точное совпадение (только регистр игнорируется).
   */
  const strictCheck = (userAnswer, correctAnswers) => {
    const cleanUser = (userAnswer || '').toLowerCase().trim()
    const correctList = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]

    const result = correctList.some(correct =>
      (correct || '').toLowerCase().trim() === cleanUser
    )

    if (log) console.log('[strictCheck]', { userAnswer, correctAnswers, result })
    return result
  }

  /**
   * 🟢 USUAL CHECK — допускает:
   * - формальные сокращения (don't = do not, I'm = I am)
   * - разговорные сокращения (gonna = going to, wanna = want to)
   * - ain't = любая форма отрицания (am not / is not / are not / have not / has not)
   * - вариации апострофов (` ' ’ ´)
   * - пунктуацию (точки, запятые)
   * - регистр
   *
   * НЕ допускает: were = we are, its = it's, im = I'm, опечатки.
   */
  const usualCheck = (userAnswer, correctAnswers) => {
    const expandedUser = expandContractions(userAnswer)
    const correctList = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]

    const result = correctList.some(correct => {
      const expandedCorrect = expandContractions(correct)

      // 1. Обычное сравнение
      if (expandedUser === expandedCorrect) return true

      // 2. Особая обработка ain't
      if (isAintMatch(expandedUser, expandedCorrect)) return true

      return false
    })

    if (log) console.log('[usualCheck]', { userAnswer, correctAnswers, expandedUser, result })
    return result
  }

  /**
   * 🔵 LIGHT CHECK — всё из usualCheck + 1 опечатка на слово + автозамена частых опечаток.
   * НО: строгие слова и короткие слова (≤3 букв) должны совпадать точно.
   */
  const lightCheck = (userAnswer, correctAnswers) => {
    // Автозамена частых опечаток ТОЛЬКО в lightCheck
    const fixedUser = fixTypos(expandContractions(userAnswer))
    const correctList = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers]

    const result = correctList.some(correct => {
      const expandedCorrect = fixTypos(expandContractions(correct))

      // 1. Точное совпадение
      if (fixedUser === expandedCorrect) return true

      // 2. Особая обработка ain't
      if (isAintMatch(fixedUser, expandedCorrect)) return true

      // 3. С опечатками
      return isSentenceCloseEnough(fixedUser, expandedCorrect)
    })

    if (log) console.log('[lightCheck]', { userAnswer, correctAnswers, expandedUser: fixedUser, result })
    return result
  }

  // ==================== УТИЛИТЫ ====================

  const checkWord = (userWord, correctWord, options = {}) => {
    const { allowTypos = false } = options
    const cleanUser = normalizeAnswer(userWord)
    const cleanCorrect = normalizeAnswer(correctWord)

    if (cleanUser === cleanCorrect) return true
    if (allowTypos) return isWordCloseEnough(cleanUser, cleanCorrect)
    return false
  }

  const getSimilarity = (userAnswer, correctAnswer) => {
    const a = expandContractions(userAnswer)
    const b = expandContractions(correctAnswer)
    const maxLen = Math.max(a.length, b.length)
    if (maxLen === 0) return 100
    const distance = levenshteinDistance(a, b)
    return Math.round((1 - distance / maxLen) * 100)
  }

  const getDiff = (userAnswer, correctAnswer) => {
    const a = expandContractions(userAnswer).split(' ')
    const b = expandContractions(correctAnswer).split(' ')
    const diff = []
    const maxLen = Math.max(a.length, b.length)

    for (let i = 0; i < maxLen; i++) {
      if (a[i] !== b[i]) {
        diff.push({ index: i, user: a[i] || null, correct: b[i] || null })
      }
    }

    return diff
  }

  // ==================== ПУБЛИЧНЫЙ API ====================
  return {
    // Три режима проверки
    strictCheck,
    usualCheck,
    lightCheck,

    // Утилиты
    normalizeAnswer,
    expandContractions,
    fixTypos,
    isAintMatch,
    isWordCloseEnough,
    isSentenceCloseEnough,
    levenshteinDistance,
    checkWord,
    getSimilarity,
    getDiff,
  }
}
