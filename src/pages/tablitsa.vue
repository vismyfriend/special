<template>
  <div class="noir-container">
    <!-- Детективная лампа -->
    <div class="desk-lamp"></div>

    <div class="case-file">
      <div class="file-label">CASE #4271<br>ENGLISH VERBS</div>

      <table class="noir-table">
        <tbody>
        <!-- Первая строка с объединением B и C -->
        <tr>
          <td rowspan="1" class="evidence-tag">EVIDENCE</td>
          <td colspan="2" class="case-title">PRESENT SIMPLE CASE</td>
        </tr>

        <!-- Вторая строка -->
        <tr>
          <td rowspan="4" class="suspect">SUSPECTS</td>
          <td>I, You, We, They</td>
          <td>It, he, She</td>
        </tr>

        <!-- Третья строка (verbs) -->
        <tr>
          <td class="verb">run</td>
          <td class="verb-alias">runs</td>
        </tr>

        <!-- Четвертая строка -->
        <tr>
          <td class="verb">do</td>
          <td class="verb-alias">does</td>
        </tr>

        <!-- Пятая строка -->
        <tr>
          <td class="verb">swim</td>
          <td class="verb-alias">swims</td>
        </tr>

        <!-- Шестая строка с объединением B и C -->
        <tr>
          <td class="notes-label">DETECTIVE'S NOTES</td>
          <td colspan="2" class="notes">
            <div class="note-line">• Irregular forms confirmed</div>
            <div class="note-line">• Third person singular marked</div>
            <div class="note-line">• Subject-verb agreement critical</div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="stamps">
        <div class="stamp approved">APPROVED</div>
        <div class="stamp confidential">CONFIDENTIAL</div>
      </div>
    </div>

    <div class="noir-overlay"></div>
  </div>
</template>

<style lang="scss" scoped>
.noir-container {
  position: relative;
  padding: 40px;
  background: #111;
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  overflow: hidden;

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

  td {
    padding: 15px;
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
    text-orientation: mixed;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
  }

  .verb {
    color: #add8e6;
    font-style: italic;
  }

  .verb-alias {
    color: #98fb98;
    font-style: italic;
  }

  .notes-label {
    background: #1e1e1e;
    color: #b8860b;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: 150px;
  }

  .notes {
    background: #0f0f0f;
    color: #d3d3d3;

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
</style>
