// Все грамматические таблицы в одном месте

export const grammarTables = {
  'to-be': {
    id: 'to-be',
    title: 'сдать на зачёт',
    description: 'Вспомогательный глагол',
    countdownTime: 55000,
    tableConfig: {
      rows: [
        {
          cells: [
            { content: 'Name', classes: 'notes-label', rowspan: 1 },
            { content: 'Невидимка<br>"Ар Эм Из"<br> Are Am Is', classes: 'case-title', isBlurred: true, colspan: 3 }
          ]
        },
        {
          cells: [
            { content: 'Rule', classes: 'evidence-tag', rowspan: 1 },
            { content: `<div class="note-line">Мы используем Are, am, is когда <u>нет обычного глагола</u> (когда нет повседневного действия, например: спать, есть, пить, улыбаться...)</div>`, classes: 'rules', isBlurred: true, colspan: 3 }
          ]
        },
        {
          cells: [
            { content: 'hints', classes: 'evidence-tag green' },
            { content: 'Их называют невидимки потому что в русском переводе их не видно <br><br>&nbsp&nbsp&nbsp&nbsp<u>they</u> are <u>invisible</u><br><br>&nbsp&nbsp&nbsp&nbsp&nbsp<u>они</u>&nbsp&nbsp<u>невидимые</u> ', classes: 'notes', colspan: 3, isBlurred: true }
          ]
        },

        {
          cells: [
            { content: 'who?', classes: 'suspect', isBlurred: true, rowspan: 4 }
          ]
        },
        {
          cells: [
            { content: 'I', classes: 'verb' },
            { content: 'AM', classes: 'verb-alias' },
            { content: 'invisible', classes: 'verb' },
          ]
        },
        {
          cells: [
            { content: 'You <br> We <br> They', classes: 'verb' },
            { content: 'ARE', classes: 'verb-alias' },
            { content: 'invisible', classes: 'verb' },
          ]
        },
        {
          cells: [
            { content: 'It <br> He <br> She', classes: 'verb' },
            { content: 'IS', classes: 'verb-alias' },
            { content: 'invisible', classes: 'verb' },

          ]
        },
        {
          cells: [
            { content: 'Remem <br>-ber', classes: ['notes-label', 'vertical-text'] },
            { content: `
              <div class="note-line">&nbsp;</div>
              <div class="note-line">&nbsp;Порядок слов в английском</div>
              <div class="note-line">&nbsp;</div>
              <div class="note-line">&nbsp; <u>кто</u> + <u>глагол</u> + <u>остальное</u> </div>

              <div class="note-line"> \u00A0</div>
            `, classes: 'notes', isBlurred: true, colspan: 3 }
          ]
        },

        {
          cells: [
            { content: 'E.g.', classes: 'notes-label' },
            { content: `
              <div class="note-line">/ эгзамплз / examples примеры</div>
              <div class="note-line"> Это круто. Умный я! Тупой он.</div>
            `, classes: ['verb-alias','notes-label'], isBlurred: true, colspan: 3 }
          ]
        }
      ]
    }
  },
  'present-simple': {
    id: 'present-simple',
    title: 'сдать на зачёт',
    description: 'Настоящее простое время',
    countdownTime: 77000,
    tableConfig: {
      rows: [
        {
          cells: [
            { content: 'Name', classes: 'notes-label', rowspan: 1 },
            { content: 'PRESENT SIMPLE (настоящее простое)', classes: 'case-title', isBlurred: true, colspan: 2 }
          ]
        },
        {
          cells: [
            { content: 'Rule', classes: 'evidence-tag', rowspan: 1 },
            { content: `<div class="note-line">We use P.S. when we talk about everyday usual actions</div>`, classes: 'rules', isBlurred: true, colspan: 2 }
          ]
        },
        {
          cells: [
            { content: 'hints', classes: 'evidence-tag green' },
            { content: 'never, almost never, rarely, seldom, not often, often, usually, sometimes, from time to time, once a day, twice a week, three times a month, every year, always', classes: 'notes', colspan: 2, isBlurred: true }
          ]
        },
        {
          cells: [
            { content: 'Who', classes: 'notes-label' },
            { content: 'It, he, She', classes: 'blue-font', isBlurred: true },
            { content: 'I, You, We, They', classes: 'blue-font', isBlurred: true }
          ]
        },
        {
          cells: [
            { content: 'verbs', classes: 'suspect', rowspan: 4 }
          ]
        },
        {
          cells: [
            { content: 'run<u>s</u>', classes: 'verb' },
            { content: 'run', classes: 'verb-alias' }
          ]
        },
        {
          cells: [
            { content: 'kiss<u>es</u>', classes: 'verb' },
            { content: 'kiss', classes: 'verb-alias' }
          ]
        },
        {
          cells: [
            { content: 'watch<u>es</u>', classes: 'verb' },
            { content: 'watch', classes: 'verb-alias' }
          ]
        },
        {
          cells: [
            { content: 'Remem <br>-ber', classes: ['notes-label', 'vertical-text'] },
            { content: `
              <div class="note-line"> ⭐ (с ит хи щи S пиши)</div>
              <div class="note-line">Окончание S добавляется только в утверждениях :</div>
              <div class="note-line">&nbsp;</div>
              <div class="note-line">&nbsp;&nbsp;+ He writes. </div>
              <div class="note-line">&nbsp;&nbsp;- He doesn't write </div>
              <div class="note-line">&nbsp;&nbsp;+ Does he write? </div>
              <div class="note-line">&nbsp;o? What does he write? </div>
              <div class="note-line"> \u00A0</div>
            `, classes: 'notes', isBlurred: true, colspan: 2 }
          ]
        },
        {
          cells: [
            { content: 'Неви- <br> димки', classes: 'evidence-tag green' },
            { content: 'Does', classes: 'case-title' },
            { content: 'Do', classes: 'case-title' }
          ]
        },
        {
          cells: [
            { content: '...', classes: 'notes-label' },
            { content: ' . . . . . . . . . . . . . .', classes: ['notes', 'blurred'], colspan: 2 }
          ]
        }
      ]
    }
  },
  'test-audio-and-pic': {
    id: 'dev',
    title: 'разработчик',
    description: 'Необязательно указывать',
    countdownTime: 77000,
    tableConfig: {
      rows: [
        {
          cells: [
            { content: 'Name', classes: 'notes-label', rowspan: 1 },
            { content: 'Пример имени<br>"name example"<br> таблица 112', classes: 'case-title', colspan: 3,
              // Можно добавить аудио для заголовка
              audio:   new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no.mp3', import.meta.url).href,
            }
          ]
        },
        {
          cells: [
            { content: 'Rule', classes: 'evidence-tag', rowspan: 1 },
            {
              content: `<div class="note-line">We use P.S. when we talk about everyday usual actions</div>`,
              classes: 'rules',
              isBlurred: true,
              colspan: 2,
              audio:   new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no1.mp3', import.meta.url).href,
            }
          ]
        },
        {
          cells: [
            { content: 'hints', classes: 'evidence-tag green' },
            {
              content: 'never, almost never, rarely, seldom, not often, often, usually, sometimes, from time to time, once a day, twice a week, three times a month, every year, always',
              classes: 'notes',
              colspan: 2,
              isBlurred: true
            }
          ]
        },
        {
          cells: [
            { content: 'Who', classes: 'notes-label' },
            {
              content: 'It, he, She',
              classes: 'blue-font',
              isBlurred: true,
              // Пример с картинкой
              image: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
              imageAlt: 'She'
            },
            {
              content: 'I, You, We, They',
              classes: 'blue-font',
              isBlurred: true,
              image: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
              imageAlt: 'They'
            }
          ]
        },
        {
          cells: [
            { content: 'verbs', classes: 'suspect', rowspan: 4 }
          ]
        },
        {
          cells: [
            {
              content: 'run<u>s</u>',
              classes: 'verb',
              audio:   new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no2.mp3', import.meta.url).href,
            },
            {
              content: 'run',
              classes: 'verb-alias',
              audio:   new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no3.mp3', import.meta.url).href,
            }
          ]
        },
        {
          cells: [
            {
              content: 'kiss<u>es</u>',
              classes: 'verb',
              audio:   new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no4.mp3', import.meta.url).href,
            },
            {
              content: 'kiss',
              classes: 'verb-alias',
            }
          ]
        },
        {
          cells: [
            {
              classes: 'blue-font',
              isBlurred: true,
              image: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
              imageAlt: 'confusedG',
              imagePosition: 'top',  // left | right | top | inline - можно удалить тогда автоматически будет inline встроено
            },
            {
              content: 'watch',
              classes: 'verb-alias',
              audio:   new URL('../assets/audio/SoundEffects/NoSoundsWrongAnswers/no.mp3', import.meta.url).href,

            }
          ]
        },
        {
          cells: [
            { content: 'Remem <br>-ber', classes: ['notes-label', 'vertical-text'],
              rowspan: 3, // ← объединяем 3 строки
            },
            {
              classes: 'notes',
              isBlurred: false,
              colspan: 2,

              // Пример с картинкой
              image: new URL("../assets/images/confusedGirl.png", import.meta.url).href,
              imageAlt: 'Grammar tip',
              imagePosition: 'fullCell', // left | right | top | fullCell | bottom
              style: 'height: 100px; min-height: 100px;', // ← добавляем

            }
          ]
        },

      ]
    }
  },

  'present-continuous': {
    id: 'present-continuous',
    title: 'PRESENT CONTINUOUS (настоящее длительное)',
    description: 'Настоящее длительное время',
    countdownTime: 77000,
    tableConfig: {
      rows: [
        {
          cells: [
            { content: 'Name', classes: 'notes-label', rowspan: 1 },
            { content: 'PRESENT CONTINUOUS (настоящее длительное)', classes: 'case-title', isBlurred: true, colspan: 2 }
          ]
        },
        {
          cells: [
            { content: 'Rule', classes: 'evidence-tag', rowspan: 1 },
            { content: `<div class="note-line">We use P.C. when we talk about actions happening now or around now</div>`, classes: 'rules', isBlurred: true, colspan: 2 }
          ]
        },
        // Добавьте остальные строки для Present Continuous
      ]
    }
  },

  'past-simple': {
    id: 'past-simple',
    title: 'PAST SIMPLE (прошедшее простое)',
    description: 'Прошедшее простое время',
    countdownTime: 77000,
    tableConfig: {
      rows: [
        {
          cells: [
            { content: 'Name', classes: 'notes-label', rowspan: 1 },
            { content: 'PAST SIMPLE (прошедшее простое)', classes: 'case-title', isBlurred: true, colspan: 2 }
          ]
        },
        {
          cells: [
            { content: 'Rule', classes: 'evidence-tag', rowspan: 1 },
            { content: `<div class="note-line">We use P.S. for completed actions in the past</div>`, classes: 'rules', isBlurred: true, colspan: 2 }
          ]
        },
        // Добавьте остальные строки для Past Simple
      ]
    }
  },

  // Добавляйте новые таблицы сюда:
  // 'present-perfect': { ... },
  // 'future-simple': { ... },
  // и так далее
};

// Экспортируем также список всех доступных таблиц для удобства
export const grammarTablesList = Object.keys(grammarTables).map(key => ({
  id: key,
  title: grammarTables[key].title,
  description: grammarTables[key].description
}));
