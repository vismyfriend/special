<template>
  <div class="examples-container">
    <!-- Пример 1: Базовая тетрадь -->
    <div class="example-section">
      <h2>1. Базовая тетрадь</h2>
      <NotebookComponent class="notebook-example">
        <div class="exercise-content">
          <h3>English Assignment</h3>
          <p>Complete the following sentences:</p>
          <ol>
            <li>I ________ to school every day. (go)</li>
            <li>She ________ English very well. (speak)</li>
            <li>They ________ football on weekends. (play)</li>
          </ol>
        </div>
      </NotebookComponent>
    </div>

    <!-- Пример 2: Тетрадь с датой -->
    <div class="example-section">
      <h2>2. Тетрадь с датой</h2>
      <NotebookComponent
        :show-date="true"
        date-placeholder="DD/MM/YYYY"
        date-position="top-left"
        class="notebook-example"
      >
        <div class="exercise-content">
          <h3>Mathematics Homework</h3>
          <p>Solve the equations:</p>
          <div class="math-problems">
            <p>1. 2x + 5 = 15</p>
            <p>2. 3(x - 4) = 21</p>
            <p>3. x² - 9 = 0</p>
          </div>
        </div>
      </NotebookComponent>
    </div>

    <!-- Пример 3: Маленькая тетрадь -->
    <div class="example-section">
      <h2>3. Маленькая тетрадь для заметок</h2>
      <NotebookComponent
        width="400"
        height="300"
        grid-size="15"
        :show-date="true"
        date-position="top-center"
        cover-color="linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)"
        class="notebook-example small"
      >
        <div class="notes-content">
          <h4>Quick Notes</h4>
          <ul>
            <li>Buy groceries</li>
            <li>Call John at 5 PM</li>
            <li>Finish report</li>
            <li>Meeting tomorrow 10 AM</li>
          </ul>
        </div>
      </NotebookComponent>
    </div>

    <!-- Пример 4: Зеленая тетрадь -->
    <div class="example-section">
      <h2>4. Зеленая тетрадь</h2>
      <NotebookComponent
        width="700"
        height="500"
        cover-color="linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)"
        grid-color="#d5f4e6"
        :show-date="true"
        date-placeholder="Today's date"
        class="notebook-example"
      >
        <div class="science-content">
          <h3>Science Experiment</h3>
          <p><strong>Hypothesis:</strong> Plants grow better with sunlight.</p>
          <p><strong>Materials:</strong></p>
          <ul>
            <li>2 identical plants</li>
            <li>Sunny window</li>
            <li>Dark closet</li>
            <li>Water</li>
          </ul>
          <p><strong>Procedure:</strong> Place one plant in sunlight, one in darkness. Water equally daily.</p>
        </div>
      </NotebookComponent>
    </div>
  </div>
</template>

<script setup>
import NotebookComponent from './NotebookComponent.vue'
</script>

<style scoped>
.examples-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.example-section {
  margin-bottom: 40px;
}

.example-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-family: Arial, sans-serif;
}

.notebook-example {
  margin: 0 auto;
}

.notebook-example.small {
  max-width: 400px;
}

.exercise-content,
.notes-content,
.science-content {
  padding: 10px;
}

.exercise-content h3,
.notes-content h4,
.science-content h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.exercise-content ol,
.exercise-content ul,
.science-content ul {
  margin-left: 20px;
}

.exercise-content li,
.notes-content li,
.science-content li {
  margin-bottom: 8px;
  line-height: 1.4;
}

.math-problems p {
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
  border-left: 3px solid #e74c3c;
}

.notes-content ul {
  list-style-type: none;
  padding-left: 0;
}

.notes-content li {
  padding: 5px 0;
  border-bottom: 1px dashed #ecf0f1;
}

.notes-content li:before {
  content: "• ";
  color: #e74c3c;
  font-weight: bold;
}

.science-content p {
  margin-bottom: 12px;
  line-height: 1.5;
}

.science-content strong {
  color: #27ae60;
}
</style>
