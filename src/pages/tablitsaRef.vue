<template>
  <div class="noir-container">
    <div class="desk-lamp"></div>

    <div class="case-file">
      <div class="file-label">S.P.E.C.I.A.L{{ caseId }}<br>{{ caseTitle }}</div>

      <div class="table-wrapper">
        <table class="noir-table">
        <tbody>
        <tr v-for="(row, rowIndex) in tableConfig.rows" :key="rowIndex">
          <td
            v-for="(cell, cellIndex) in row.cells"
            :key="cellIndex"
            :colspan="cell.colspan || 1"
            :rowspan="cell.rowspan || 1"
            :class="[...(Array.isArray(cell.classes) ? cell.classes : [cell.classes]),
          { 'blurred': cell.isBlurred }]"
            v-html="cell.content"
            @click="toggleBlur(rowIndex, cellIndex)"
          ></td>
        </tr>
        </tbody>
        </table>
      </div>

      <div class="stamps">
        <div
          v-for="(stamp, index) in stamps"
          :key="index"
          class="stamp"
          :class="stamp.type"
        >
          {{ stamp.text }}
        </div>
      </div>
    </div>

    <div class="noir-overlay"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Конфигурация таблицы
const caseId = ref('.');
const caseTitle = ref('--------------');

const tableConfig = ref({
  // Основной контейнер для всех строк таблицы
  rows: [
    // Первая строка таблицы
    {
      cells: [
        {
          content: 'Name',                     // Текст в ячейке
          classes: 'notes-label',              // CSS-классы для стилизации
          rowspan: 1                          // Ячейка занимает 1 строку (значение по умолчанию)
        },
        {
          content: 'PRESENT SIMPLE (настоящее простое)',
          classes: 'case-title',
          isBlurred: true, // Начальное состояние - размыто

          colspan: 2                          // Ячейка объединяет 2 колонки
        }
      ]
    },
    // Вторая строка таблицы
    {
      cells: [
        {
          content: 'Rule',
          classes: 'evidence-tag',
          rowspan: 1                          // Можно не указывать, 1 - значение по умолчанию
        },
        {
          content: `<div class="note-line">We use P.S. when we talk about everyday usual actions</div>`,
          classes: 'rules',
          isBlurred: true, // Начальное состояние - размыто

          colspan: 2                          // Объединение 2 колонок
        }
      ]
    },
    // Третья строка таблицы
    {
      cells: [
        {
          content: 'Who',
          classes: 'notes-label'
          // rowspan и colspan не указаны - значит = 1 (занимает одну ячейку)
        },
        {
          content: 'It, he, She',
          classes: 'blue-font',
          isBlurred: true, // Начальное состояние - размыто
        },
        {
          content: 'I, You, We, They',
          classes: 'blue-font',
          isBlurred: true, // Начальное состояние - размыто

        }
      ]
    },
    // Четвертая строка (начало блока с hints)
    {
      cells: [
        {
          content: 'hints',
          classes: 'suspect',

        },
        {
          content:
            'never, almost never, rarely, seldom, not often, often, usually, sometimes, from time to time, once a day, twice a week, three times a month, every year, always',
          classes: 'notes',
          colspan: 2,                              // Объединение 2 колонок
          isBlurred: true // Начальное состояние - размыто

        },

      ]
    },
    // Шестая строка (начало блока verbs)
    {
      cells: [
        {
          content: 'verbs',
          classes: 'suspect',
          rowspan: 4                          // Ячейка растягивается на 4 строки вниз
        }
      ]
    },
    // Седьмая строка (первая строка блока verbs)
    {
      cells: [
        // Первая ячейка "занята" rowspan из предыдущей строки
        {
          content: 'run<u>s</u>',
          classes: 'verb',
          isBlurred: true // Начальное состояние - размыто

        },
        {
          content: 'run',
          classes: 'verb-alias',
          isBlurred: true // Начальное состояние - размыто

        }
      ]
    },
    // Восьмая строка
    {
      cells: [
        {
          content: 'kiss<u>es</u>',
          classes: 'verb',
          isBlurred: true // Начальное состояние - размыто

        },
        {
          content: 'kiss',
          classes: 'verb-alias',
          isBlurred: true // Начальное состояние - размыто

        }
      ]
    },
    // Девятая строка
    {
      cells: [
        {
          content: 'watch<u>es</u>',
          classes: 'verb',
          isBlurred: true // Начальное состояние - размыто

        },
        {
          content: 'watch',
          classes: 'verb-alias',
          isBlurred: true // Начальное состояние - размыто

        }
      ]
    },
    // Десятая строка
    {
      cells: [
        {
          content: 'Remember',
          classes: ['notes-label','vertical-text']  // Вертикальный текст
        },
        {
          content: `
            <div class="note-line"> ⭐ (с ит хи щи S пиши)</div>
            <div class="note-line">Окончание S добавляется только в утверждениях :</div>
            <div class="note-line">&nbsp;</div>
            <div class="note-line">&nbsp;&nbsp;+ He writes. </div>
            <div class="note-line">&nbsp;&nbsp;- He doesn't write </div>
            <div class="note-line">&nbsp;&nbsp;+ Does he write? </div>
            <div class="note-line">&nbsp;o? What does he write? </div>
            <div class="note-line">• Subject-verb agreement critical</div>
          `,    // Многострочное содержимое с HTML-разметкой
          classes: 'notes',
          isBlurred: true, // Начальное состояние - размыто
          colspan: 2                              // Объединение 2 колонок
        }
      ]
    },
    {
      cells: [
        {
          content: 'I.V.',
          classes: 'evidence-tag green'
          // rowspan и colspan не указаны - значит = 1 (занимает одну ячейку)
        },
        {
          content: 'Does',
          classes: 'case-title',
        },
        {
          content: 'Do',
          classes: 'case-title',
        }
      ]
    },
    {
      cells: [
        {
          content: '...',
          classes: 'notes-label'
        },
        {
          content: ' . . . . . . . . . . . . . .',
          classes: ['notes','blurred'],
          colspan: 2                              // Объединение 2 колонок
        }
      ]
    },
  ]
});
const toggleBlur = (rowIndex, cellIndex) => {
  const cell = tableConfig.value.rows[rowIndex].cells[cellIndex];
  // Проверяем, есть ли вообще возможность размытия
  if (cell.classes?.includes('blurred') || cell.isBlurred !== undefined) {
    cell.isBlurred = !cell.isBlurred;
  }
};
const stamps = ref([
  { text: 'APPROVED!', type: 'approved' },
  { text: 'CONFIDENTIAL', type: 'confidential' }
]);

// Метод для обновления конфигурации
const updateTable = (newConfig) => {
  tableConfig.value = { ...tableConfig.value, ...newConfig };
};
</script>

<style lang="scss" scoped>
.noir-container {
  position: relative;
  padding: 40px;
  background: #111;
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  user-select: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
    z-index: 1;
  }
}

.desk-lamp {
  position: absolute;
  top: -50px;
  right: 100px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;

  &::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 10px;
    height: 150px;
    background: linear-gradient(to bottom, #333, #111);
    transform: translateX(-50%);
  }
}

.case-file {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: #1a1a1a;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  padding: 30px;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="%23333" stroke-width="0.5"/></svg>');
    opacity: 0.1;
    pointer-events: none;
  }
}

.file-label {
  position: absolute;
  top: -15px;
  left: 20px;
  background: #8B0000;
  color: #FFD700;
  padding: 5px 15px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 2px solid #333;
  transform: rotate(-2deg);
}

.noir-table {
  width: 100%;
  border-collapse: collapse;
  color: #e0e0e0;
  font-size: 16px;
  margin: 20px 0;
  line-height: 20px;

  td {
    padding: 10px;
    border: 1px solid #333;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3));
      pointer-events: none;
    }
  }

  .evidence-tag {
    background: #8B0000;
    color: #FFD700;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 14px;
    text-align: center;
    width: 120px;
  }

  .green {
    background: #42dd2785;
  }
  .case-title {
    background: #222;
    color: #FFD700;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
  }


  .suspect {
    background: #1e1e1e;
    color: #b8860b;
    font-weight: bold;
    writing-mode: vertical-rl;
    text-orientation: upright;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
  }

  .verb {
    color: #add8e6;
    font-style: italic;
  }

  .blue-font {
    color: #10e3ff;
    font-style: italic;
  }
  .verb-alias {
    color: #98fb98;
    font-style: italic;
  }
  .blurred {
    filter: blur(3px);
    user-select: none;
    transition: filter 0.2s ease;
  }
  .vertical-text {
    writing-mode: vertical-rl; /* вертикальное написание справа налево */
    text-orientation: upright;
    white-space: nowrap;
  }
  .notes-label {
    background: #1e1e1e;
    color: #b8860b;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
    width: 150px;
  }

  .notes {
    background: #0f0f0f;
    color: #d3d3d3;
    line-height: 18px;


    .note-line {
      margin-bottom: 8px;
      position: relative;
      padding-left: 20px;


      &::before {
        content: "•";
        position: absolute;
        left: 5px;
        color: #8B0000;
      }
    }

  }
  .rules {
    color: white;
    line-height: 17px;

  }
}

.stamps {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;

  .stamp {
    padding: 5px 15px;
    border: 2px solid;
    font-family: 'Times New Roman', serif;
    font-weight: bold;
    transform: rotate(5deg);
    opacity: 0.8;

    &.approved {
      border-color: #006400;
      color: #006400;
      background: rgba(0,100,0,0.1);
    }

    &.confidential {
      border-color: #8B0000;
      color: #8B0000;
      background: rgba(139,0,0,0.1);
    }
  }
}

.noir-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 20%, transparent 60%, rgba(0,0,0,0.7));
  pointer-events: none;
  z-index: 1;
}

/* Анимация мерцания лампы */
@keyframes flicker {
  0%, 100% { opacity: 0.8; }
  25% { opacity: 0.6; }
  50% { opacity: 0.9; }
  75% { opacity: 0.7; }
}

.desk-lamp {
  animation: flicker 5s infinite;
}

/* Добавляем медиа-запросы для мобильных */
@media (max-width: 768px) {
  .noir-container {
    padding: 20px 10px;

    &::before {
      height: 60px;
    }
  }

  .desk-lamp {
    right: 30px;
    width: 120px;
    height: 120px;

    &::after {
      height: 100px;
    }
  }

  .case-file {
    padding: 20px 15px;
    margin: 0 10px;
  }

  .file-label {
    font-size: 12px;
    padding: 3px 10px;
    left: 10px;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -15px;
    padding: 0 15px;
  }

  .noir-table {
    font-size: 14px;
    min-width: 250px; /* Минимальная ширина для сохранения структуры */

    td {
      padding: 6px 5px;

      &.evidence-tag,
      &.notes-label {
        width: auto;
        font-size: 12px;

      }

      &.case-title {
        font-size: 16px;
      }

      &.suspect {

        padding: 8px;
        font-size: 14px;
      }
    }
  }

  .stamps {
    gap: 10px;

    .stamp {
      padding: 3px 10px;
      font-size: 12px;
    }
  }
}
</style>
<script setup lang="ts">
</script>
