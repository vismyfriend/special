<template>
  <div class="test-container">
    <h1>🧪 Тест specialAnswerCheck</h1>

    <!-- Настройки composable -->
    <div class="settings-panel">
      <h2>⚙️ Настройки composable</h2>
      <div class="settings-grid">
        <label>
          <span>maxTypos</span>
          <input type="number" v-model.number="settings.maxTypos" min="0" max="3" />
        </label>
        <label>
          <span>shortWordMaxLength</span>
          <input type="number" v-model.number="settings.shortWordMaxLength" min="1" max="10" />
        </label>
        <label>
          <span>fixCommonTypos</span>
          <input type="checkbox" v-model="settings.fixCommonTypos" />
        </label>
        <label>
          <span>log (в консоль)</span>
          <input type="checkbox" v-model="settings.log" />
        </label>
      </div>
      <div class="strict-words-block">
        <label>
          <span>strictWords (через запятую):</span>
          <textarea v-model="strictWordsRaw" rows="2"></textarea>
        </label>
      </div>
    </div>

    <!-- Таблица тестов -->
    <div class="table-wrapper">
      <table class="test-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Описание</th>
          <th>Ответ студента</th>
          <th>Правильный ответ</th>
          <th>strictCheck</th>
          <th>usualCheck</th>
          <th>lightCheck</th>
          <th>Лог</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(test, index) in testCases"
          :key="index"
          :class="{ 'row-alt': index % 2 === 1, 'row-highlight': test.highlight }"
        >
          <td>{{ index + 1 }}</td>
          <td class="description-cell">{{ test.description }}</td>
          <td>
            <input
              v-model="test.user"
              class="test-input"
              :class="getResultClass(test, 'user')"
            />
          </td>
          <td>
            <input
              v-model="test.correct"
              class="test-input"
              :class="getResultClass(test, 'correct')"
            />
          </td>
          <td class="result-cell" :class="getCellClass(test, 'strict')">
            {{ getResult(test, 'strict') ? '✅' : '❌' }}
          </td>
          <td class="result-cell" :class="getCellClass(test, 'usual')">
            {{ getResult(test, 'usual') ? '✅' : '❌' }}
          </td>
          <td class="result-cell" :class="getCellClass(test, 'light')">
            {{ getResult(test, 'light') ? '✅' : '❌' }}
          </td>
          <td class="log-cell">
            <button
              class="log-btn"
              @click="logTest(test, index)"
              title="Показать подробности в консоли"
            >
              📋
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопки -->
    <div class="button-wrapper">
      <button class="btn" @click="addTest">➕ Добавить тест</button>
      <button class="btn btn-danger" @click="resetTests">🔄 Сбросить</button>
      <button class="btn btn-success" @click="logAllTests">📋 Логировать все</button>
    </div>

    <!-- Результат по каждому тесту (подробно) -->
    <div class="details-wrapper">
      <h2>📊 Подробности</h2>
      <div
        v-for="(test, index) in testCases"
        :key="index"
        class="detail-card"
        :class="{ 'detail-highlight': test.highlight }"
      >
        <div class="detail-header">
          <strong>#{{ index + 1 }}</strong> — {{ test.description }}
        </div>
        <div class="detail-grid">
          <div class="detail-row">
            <span class="label">Студент:</span>
            <code>{{ test.user }}</code>
          </div>
          <div class="detail-row">
            <span class="label">Правильный:</span>
            <code>{{ test.correct }}</code>
          </div>
          <div class="detail-row">
            <span class="label">usualCheck (после expand):</span>
            <code>{{ expandContractions(test.user) }}</code>
            <code class="separator">vs</code>
            <code>{{ expandContractions(test.correct) }}</code>
          </div>
          <div class="detail-row">
            <span class="label">strictCheck:</span>
            <span :class="getResultClass(test, 'strict')">
              {{ getResult(test, 'strict') ? '✅ Совпадает' : '❌ Не совпадает' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="label">usualCheck:</span>
            <span :class="getResultClass(test, 'usual')">
              {{ getResult(test, 'usual') ? '✅ Совпадает' : '❌ Не совпадает' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="label">lightCheck:</span>
            <span :class="getResultClass(test, 'light')">
              {{ getResult(test, 'light') ? '✅ Совпадает' : '❌ Не совпадает' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSpellingCheck } from 'src/composables/specialSpellingCheck'

// ==================== НАСТРОЙКИ ====================
const settings = ref({
  maxTypos: 1,
  shortWordMaxLength: 3,
  fixCommonTypos: true,
  log: false,
})

const strictWordsRaw = ref(`he, his, she, her, you, your, we, our, it,
is, are, was, were, do, does, did,
have, has, had, who, why, what, when, where`)

// Разбираем strictWords из textarea
const strictWords = computed(() => {
  return strictWordsRaw.value
    .split(',')
    .map(w => w.trim().toLowerCase())
    .filter(Boolean)
})

// ==================== COMPOSABLE ====================
// Пересоздаём composable при изменении настроек
const check = computed(() => {
  return useSpellingCheck({
    strictWords: strictWords.value,
    shortWordMaxLength: settings.value.shortWordMaxLength,
    maxTypos: settings.value.maxTypos,
    fixCommonTypos: settings.value.fixCommonTypos,
    log: settings.value.log,
  })
})

// Обёртки для удобства
const strictCheck = (user, correct) => check.value.strictCheck(user, correct)
const usualCheck = (user, correct) => check.value.usualCheck(user, correct)
const lightCheck = (user, correct) => check.value.lightCheck(user, correct)
const expandContractions = (text) => check.value.expandContractions(text)

// ==================== ТЕСТОВЫЕ КЕЙСЫ ====================
const defaultTests = [
  // === 🔥 ГЛАВНЫЕ ТЕСТЫ (с которыми работаем в первую очередь) ===
  {
    description: '🔥 Главный: We are not stupid == We aren\'t stupid',
    user: 'We are not stupid',
    correct: "We aren't stupid",
    highlight: true,
  },
  {
    description: '🔥 Главный: We aren\'t stupid == We are not stupid',
    user: "We aren't stupid",
    correct: 'We are not stupid',
    highlight: true,
  },

  // === Точное совпадение ===
  { description: 'Точное совпадение', user: 'I am a student', correct: 'I am a student' },
  { description: 'Регистр не важен', user: 'i AM a student', correct: 'I am a student' },
  { description: 'Точка в конце (strict — ошибка)', user: 'I am a student.', correct: 'I am a student' },

  // === Сокращения с апострофом ===
  { description: "i'm → i am", user: "I'm a student", correct: 'I am a student' },
  { description: "don't → do not", user: "I don't know", correct: 'I do not know' },
  { description: "doesn't → does not", user: "He doesn't know", correct: 'He does not know' },
  { description: "aren't → are not", user: "We aren't good students", correct: 'We are not good students' },
  { description: "we're → we are", user: "We're good students", correct: 'We are good students' },
  { description: "it's → it is", user: "It's a cat", correct: 'It is a cat' },

  // === ❌ Опасные случаи (должны быть false) ===
  { description: '❌ were НЕ должны схлопываться в we are', user: 'were not good students', correct: 'we are not good students' },
  { description: '❌ its НЕ должны схлопываться в it is', user: 'its a cat', correct: "it's a cat" },
  { description: '❌ im без апострофа — НЕ засчитываем', user: 'im a student', correct: "I'm a student" },
  { description: '❌ youre без апострофа — НЕ засчитываем', user: 'youre a student', correct: "You're a student" },

  // === Опечатки в lightCheck ===
  { description: 'lightCheck: 1 опечатка (recieve)', user: 'recieve', correct: 'receive' },
  { description: 'lightCheck: 1 опечатка (studentt)', user: 'studentt', correct: 'student' },
  { description: 'lightCheck: строгое слово is → in', user: 'is', correct: 'in' },
  { description: 'lightCheck: строгое слово he → she', user: 'he', correct: 'she' },
  { description: 'lightCheck: короткое слово to → ta', user: 'ta', correct: 'to' },

  // === Пунктуация ===
  { description: 'Запятая в середине', user: 'Hello, my name is Vincent', correct: 'Hello my name is Vincent' },
  { description: 'Вопросительный знак', user: 'Are you a student?', correct: 'Are you a student' },

  // === Апострофы разных видов ===
  { description: 'Правая кавычка ’ вместо \'', user: "I’m a student", correct: "I'm a student" },
  { description: 'Левая кавычка ‘ вместо \'', user: "I‘m a student", correct: "I'm a student" },
  { description: 'Гравис ` вместо \'', user: 'I`m a student', correct: "I'm a student" },

  // === Множественные пробелы ===
  { description: 'Множественные пробелы', user: 'I    am   a   student', correct: 'I am a student' },
  // ==================== РАСШИРЕННЫЙ НАБОР ТЕСТОВ ====================

// === Апострофы в середине / начале — не должны ломаться ===
  { description: "o'clock — апостроф в середине", user: "It's 5 o'clock", correct: "It is 5 o'clock" },
  { description: "ma'am — апостроф в середине", user: "Yes, ma'am", correct: "Yes, ma'am" },
  { description: "rock'n'roll — два апострофа", user: "I love rock'n'roll", correct: "I love rock'n'roll" },
  { description: "'cause — апостроф в начале", user: "'cause I'm happy", correct: "'cause I am happy" },
  { description: "'em — апостроф в начале", user: "Give 'em to me", correct: "Give 'em to me" },
  { description: "'til — апостроф в начале", user: "Wait 'til tomorrow", correct: "Wait 'til tomorrow" },

// === h-вспомогательные ===
  { description: "haven't → have not", user: "I haven't seen it", correct: 'I have not seen it' },
  { description: "hasn't → has not", user: "She hasn't seen it", correct: 'She has not seen it' },
  { description: "hadn't → had not", user: "They hadn't seen it", correct: 'They had not seen it' },

// === Модальные вспомогательные ===
  { description: "wouldn't → would not", user: "I wouldn't do it", correct: 'I would not do it' },
  { description: "couldn't → could not", user: "I couldn't do it", correct: 'I could not do it' },
  { description: "shouldn't → should not", user: "I shouldn't do it", correct: 'I should not do it' },
  { description: "mightn't → might not", user: "I mightn't do it", correct: 'I might not do it' },
  { description: "mustn't → must not", user: "I mustn't do it", correct: 'I must not do it' },
  { description: "needn't → need not", user: "You needn't worry", correct: 'You need not worry' },
  { description: "daren't → dare not", user: "I daren't ask", correct: 'I dare not ask' },

// === Без апострофа (частые опечатки) ===
  { description: 'isnt (без апострофа)', user: 'He isnt here', correct: 'He is not here' },
  { description: 'arent (без апострофа)', user: 'We arent stupid', correct: "We aren't stupid" },
  { description: 'wasnt (без апострофа)', user: 'He wasnt here', correct: 'He was not here' },
  { description: 'werent (без апострофа)', user: 'They werent here', correct: 'They were not here' },
  { description: 'havent (без апострофа)', user: "I havent seen it", correct: 'I have not seen it' },
  { description: 'hasnt (без апострофа)', user: "She hasnt seen it", correct: 'She has not seen it' },
  { description: 'hadnt (без апострофа)', user: "They hadnt seen it", correct: 'They had not seen it' },
  { description: 'wouldnt (без апострофа)', user: "I wouldnt do it", correct: 'I would not do it' },
  { description: 'couldnt (без апострофа)', user: "I couldnt do it", correct: 'I could not do it' },
  { description: 'shouldnt (без апострофа)', user: "I shouldnt do it", correct: 'I should not do it' },
  { description: 'mustnt (без апострофа)', user: "I mustnt do it", correct: 'I must not do it' },

// === cannot — одно слово ===
  { description: 'cannot → can not', user: 'I cannot do it', correct: 'I can not do it' },
  { description: 'can not → cannot', user: 'I can not do it', correct: 'I cannot do it' },
  { description: 'cannot vs cant', user: "I can't do it", correct: 'I cannot do it' },

// === Цепочки сокращений ===
  { description: 'Цепочка: I\'m not sure he\'s right', user: "I'm not sure he's right", correct: 'I am not sure he is right' },
  { description: 'Цепочка: We\'re not sure they\'re ready', user: "We're not sure they're ready", correct: 'We are not sure they are ready' },
  { description: 'Цепочка: I\'ve been there, haven\'t you?', user: "I've been there, haven't you?", correct: 'I have been there, have not you' },
  { description: 'Цепочка: He\'d like to, wouldn\'t he?', user: "He'd like to, wouldn't he?", correct: 'He would like to, would not he' },

// === Заглавные буквы ===
  { description: "I'M — заглавные", user: "I'M A STUDENT", correct: "I'm a student" },
  { description: "DON'T — заглавные", user: "I DON'T KNOW", correct: "I don't know" },
  { description: "HE'S — заглавные", user: "HE'S A TEACHER", correct: "He's a teacher" },

// === Смешанные случаи ===
  { description: 'Сокращение + точка', user: "I don't know.", correct: 'I do not know' },
  { description: 'Сокращение + запятая', user: "I'm here, and he's there", correct: 'I am here and he is there' },
  { description: 'Сокращение + восклицание', user: "Don't do it!", correct: 'Do not do it' },
  { description: 'Сокращение + вопрос', user: "Isn't it nice?", correct: 'Is not it nice' },

  { description: "ain't = am not", user: "I ain't stupid", correct: 'I am not stupid' },
  { description: "ain't = is not", user: "She ain't stupid", correct: 'She is not stupid' },
  { description: "ain't = are not", user: "They ain't stupid", correct: 'They are not stupid' },
  { description: "ain't = has not", user: "She ain't got it", correct: 'She has not got it' },
  { description: "ain't = have not", user: "I ain't seen it", correct: 'I have not seen it' },
  { description: "aint без апострофа = is not", user: "He aint stupid", correct: 'He is not stupid' },

  { description: "wanna → want to", user: "I wanna sleep", correct: 'I want to sleep' },
  { description: "gonna → going to", user: "I'm gonna go", correct: 'I am going to go' },
  { description: "gotta → got to", user: "I gotta go", correct: 'I got to go' },
  { description: "gimme → give me", user: "Gimme that", correct: 'Give me that' },
  { description: "lemme → let me", user: "Lemme see", correct: 'Let me see' },
  { description: "dunno → do not know", user: "I dunno", correct: 'I do not know' },
  { description: "kinda → kind of", user: "Kinda cool", correct: 'Kind of cool' },
  { description: "sorta → sort of", user: "Sorta tired", correct: 'Sort of tired' },
  { description: "outta → out of", user: "Outta here", correct: 'Out of here' },
  { description: "hafta → have to", user: "I hafta go", correct: 'I have to go' },

  { description: "recieve в usual ❌, в light ✅", user: 'recieve', correct: 'receive' },
  { description: "definately в usual ❌, в light ✅", user: 'definately', correct: 'definitely' },
]

const testCases = ref(JSON.parse(JSON.stringify(defaultTests)))

// ==================== ФУНКЦИИ ====================
const getResult = (test, mode) => {
  if (mode === 'strict') return strictCheck(test.user, test.correct)
  if (mode === 'usual') return usualCheck(test.user, test.correct)
  if (mode === 'light') return lightCheck(test.user, test.correct)
  return false
}

const getResultClass = (test, mode) => {
  return getResult(test, mode) ? 'result-true' : 'result-false'
}

const getCellClass = (test, mode) => {
  return getResult(test, mode) ? 'cell-true' : 'cell-false'
}

const addTest = () => {
  testCases.value.push({
    description: 'Новый тест',
    user: '',
    correct: '',
  })
}

const resetTests = () => {
  testCases.value = JSON.parse(JSON.stringify(defaultTests))
}

// ==================== ЛОГ ОДНОГО ТЕСТА ====================
const logTest = (test, index) => {
  const userExpanded = expandContractions(test.user)
  const correctExpanded = expandContractions(test.correct)

  const strictResult = strictCheck(test.user, test.correct)
  const usualResult = usualCheck(test.user, test.correct)
  const lightResult = lightCheck(test.user, test.correct)

  // Заголовок
  console.group(
    `%c📋 Тест #${index + 1}: ${test.description}`,
    'background: #3498db; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
  )

  console.log('%c📝 Входные данные:', 'color: #3498db; font-weight: bold;')
  console.log('  Студент:    ', test.user)
  console.log('  Правильный: ', test.correct)

  console.log('%c🔧 После expandContractions:', 'color: #9b59b6; font-weight: bold;')
  console.log('  Студент:    ', userExpanded)
  console.log('  Правильный: ', correctExpanded)
  console.log('  Совпадают:  ', userExpanded === correctExpanded ? '✅ да' : '❌ нет')

  console.log('%c📊 Результаты проверок:', 'color: #e67e22; font-weight: bold;')
  console.log(`  strictCheck: ${strictResult ? '✅ true' : '❌ false'}`)
  console.log(`  usualCheck:  ${usualResult ? '✅ true' : '❌ false'}`)
  console.log(`  lightCheck:  ${lightResult ? '✅ true' : '❌ false'}`)

  // Если есть расхождение — показываем пословно
  if (userExpanded !== correctExpanded) {
    console.log('%c🔍 Разница пословно (после expand):', 'color: #e74c3c; font-weight: bold;')
    const userWords = userExpanded.split(' ')
    const correctWords = correctExpanded.split(' ')
    const maxLen = Math.max(userWords.length, correctWords.length)

    for (let i = 0; i < maxLen; i++) {
      const u = userWords[i] || '(нет)'
      const c = correctWords[i] || '(нет)'
      const match = u === c
      console.log(
        `  ${match ? '✅' : '❌'} [${i}] студент: "${u}" | правильный: "${c}"`
      )
    }
  } else {
    console.log('%c✅ После нормализации строки полностью совпадают', 'color: #27ae60; font-weight: bold;')
  }

  console.groupEnd()
}

// ==================== ЛОГ ВСЕХ ТЕСТОВ ====================
const logAllTests = () => {
  console.clear()
  console.log(
    '%c🧪 ЛОГ ВСЕХ ТЕСТОВ',
    'background: #2c3e50; color: white; padding: 8px 16px; border-radius: 6px; font-size: 16px; font-weight: bold;'
  )

  testCases.value.forEach((test, index) => {
    logTest(test, index)
  })
}

// ==================== WATCH ====================
watch(() => settings.value.log, (newVal) => {
  if (newVal) {
    console.log('🔊 Логирование включено в composable')
  }
})
</script>

<style lang="scss" scoped>
.test-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #34495e;
  font-size: 18px;
  margin-bottom: 12px;
}

/* Настройки */
.settings-panel {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    color: #555;

    span {
      font-weight: 600;
      color: #2c3e50;
    }

    input[type="number"],
    input[type="text"] {
      padding: 6px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}

.strict-words-block {
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;

    span {
      font-weight: 600;
      color: #2c3e50;
    }

    textarea {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      resize: vertical;
    }
  }
}

/* Таблица */
.table-wrapper {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  overflow-x: auto;
}

.test-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background: #34495e;
    color: white;

    th {
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      white-space: nowrap;
    }
  }

  tbody tr {
    border-bottom: 1px solid #ecf0f1;

    &.row-alt {
      background: #f9fbfd;
    }

    &.row-highlight {
      background: #fff8e1;
      border-left: 3px solid #ffc107;

      &:hover {
        background: #fff3cd;
      }
    }

    &:hover {
      background: #eef5ff;
    }

    td {
      padding: 8px;
      vertical-align: middle;
    }
  }
}

.description-cell {
  color: #555;
  font-size: 13px;
  max-width: 240px;
}

.test-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
  }

  &.result-true {
    background: #d4edda;
    border-color: #27ae60;
  }

  &.result-false {
    background: #f8d7da;
    border-color: #e74c3c;
  }
}

.result-cell {
  text-align: center;
  font-size: 18px;
  font-weight: bold;

  &.cell-true {
    background: rgba(46, 204, 113, 0.15);
    color: #27ae60;
  }

  &.cell-false {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }
}

/* Колонка с логом */
.log-cell {
  text-align: center;
  width: 60px;
}

.log-btn {
  background: transparent;
  border: 1px solid #3498db;
  color: #3498db;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3498db;
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* Кнопки */
.button-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &.btn-danger {
    background: #e74c3c;

    &:hover {
      background: #c0392b;
    }
  }

  &.btn-success {
    background: #27ae60;

    &:hover {
      background: #219a52;
    }
  }
}

/* Подробности */
.details-wrapper {
  margin-top: 30px;
}

.detail-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

  &.detail-highlight {
    border-left: 4px solid #ffc107;
    background: #fffdf5;
  }
}

.detail-header {
  font-size: 15px;
  color: #2c3e50;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ecf0f1;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;

  .label {
    min-width: 200px;
    color: #7f8c8d;
    font-weight: 600;
  }

  code {
    background: #f0f4f8;
    padding: 3px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    color: #2c3e50;

    &.separator {
      background: transparent;
      color: #95a5a6;
      font-weight: bold;
    }
  }

  .result-true {
    color: #27ae60;
    font-weight: 600;
  }

  .result-false {
    color: #e74c3c;
    font-weight: 600;
  }
}

/* Адаптив */
@media (max-width: 768px) {
  .test-container {
    padding: 10px;
  }

  .test-table {
    font-size: 12px;

    th, td {
      padding: 6px 4px;
    }
  }

  .description-cell {
    max-width: 120px;
    font-size: 11px;
  }

  .test-input {
    font-size: 11px;
    padding: 4px 6px;
  }

  .detail-row .label {
    min-width: 100%;
  }
}
</style>
