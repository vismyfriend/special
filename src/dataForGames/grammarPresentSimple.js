export default {
  id: 'present-simple',
  title: 'сдать на зачёт',
  description: 'Настоящее простое время',
  countdownTime: 77000, // 77 секунд
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
};
