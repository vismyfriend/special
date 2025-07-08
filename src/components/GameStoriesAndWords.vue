<template>
  <div v-if="storiesData" class="stories-container">
    <div class="stories-header">
      <h2>{{ storiesData.mainDescription }}</h2>
      <div class="header-bottom">
        <p class="main-description">Fill in the gaps in these mysterious stories</p>
        <div class="task-counter">
          {{ currentStoryIndex + 1 }}/{{ storiesData.listOfStories.length }}
        </div>
      </div>
    </div>

    <div v-for="(story, index) in storiesData.listOfStories"
         :key="index"
         class="story-container"
         :style="{ display: index === currentStoryIndex ? 'block' : 'none' }"
    >
      <div v-if="story.usefulWords" class="useful-words-container">
        <div class="useful-words">
          <span class="useful-words-title">Useful words:</span>
          <div class="useful-words-content">
            <div v-for="(pair, i) in parseUsefulWords(story.usefulWords)"
                 :key="i"
                 class="word-pair">
              <span class="english-word">{{ pair.english }}</span>
              <span class="separator">-</span>
              <span class="translation">{{ pair.russian }}</span>
              <span v-if="i < parseUsefulWords(story.usefulWords).length - 1" class="comma">,</span>
            </div>
          </div>
        </div>
      </div>

      <h3 class="story-title">{{ story.storyTitle }}</h3>

      <div v-if="story.taskPicture" class="story-image-container">
        <img :src="story.taskPicture" :alt="'Image for story ' + (index + 1)" class="story-image">
      </div>

      <audio
        v-if="story.audio"
        controls
        class="audio-player"
        controlsList="nodownload"
        oncontextmenu="return false;"
      >
        <source :src="story.audio" type="audio/mp3" />
      </audio>

      <div class="story-text">
        <p v-for="(paragraph, pi) in splitStoryText(story.text)" :key="pi">
          <template v-for="(part, i) in paragraph" :key="i">
            <template v-if="part.type === 'gap'">
              <input
                type="text"
                class="story-input"
                :class="[
                  getInputClass(index, part.gapIndex, part.correctAnswer),
                  {
                    'input-small': part.gapLength === 1,
                    'input-medium': part.gapLength === 2,
                    'input-large': part.gapLength === 3,
                    'input-full': part.gapLength >= 4
                  }
                ]"
                v-model="answers[index][part.gapIndex]"
                @keyup.enter="focusNextInput(index, part.gapIndex)"
                :data-story="index"
                :data-gap="part.gapIndex"
                ref="inputFields"
              />
            </template>
            <template v-else>
              {{ part.text }}
            </template>
          </template>
        </p>
      </div>

      <div v-if="expandedScriptIndex === index" class="text-script-content">
        <p>{{ story.hintsOrFeedback }}</p>
      </div>

      <div class="story-footer">
        <div class="story-controls">
          <button
            v-if="story.hintsOrFeedback"
            class="toggle-script-btn"
            @click="toggleScript(index)"
          >
            {{ expandedScriptIndex === index ? 'Hide hints' : 'Show hints' }}
          </button>

          <div
            class="score-display"
            :class="[
              { 'score-visible': checkedStories[index] },
              checkedStories[index] ? getGrade(storyScores[index]).class : ''
            ]"
          >
            {{ checkedStories[index] ? `${storyScores[index]}% (${getGrade(storyScores[index]).letter})` : '' }}
          </div>

          <button
            class="check-button"
            @click="checkAnswers(index)"
          >
            Check
          </button>
        </div>

        <div class="story-navigation">
          <button
            class="nav-button prev-button"
            @click="goToPrevStory"
            :disabled="currentStoryIndex === 0"
          >
            ←
          </button>
          <button
            class="nav-button next-button"
            @click="goToNextStory"
            :disabled="currentStoryIndex === storiesData.listOfStories.length - 1"
          >
            →
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    Loading stories...
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import storiesAndWordsData from '../dataForGames/storiesData'

const route = useRoute()
const storiesData = ref(null)
const answers = ref([])
const checkedStories = ref([])
const expandedScriptIndex = ref(null)
const storyScores = ref([])
const currentStoryIndex = ref(0)
const inputFields = ref([])

onMounted(() => {
  const missionName = route.params.missionName
  storiesData.value = storiesAndWordsData[missionName] || null

  if (storiesData.value) {
    answers.value = storiesData.value.listOfStories.map(story => {
      const gapCount = splitStoryText(story.text).flat().filter(p => p.type === 'gap').length
      return Array(gapCount).fill('')
    })

    checkedStories.value = storiesData.value.listOfStories.map(() => false)
    storyScores.value = storiesData.value.listOfStories.map(() => null)
  }

  disableAudioDownload()
})

const normalizeAnswer = (answer) => {
  if (!answer || typeof answer !== 'string') return ''
  return answer
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,!?;:…–—]+$/g, '')
    .replace(/[.,!?;:…–—]/g, ' ')
    .replace(/\s+/g, ' ')
}

const splitStoryText = (text) => {
  if (!text) return []

  const paragraphs = text.split('\n').filter(p => p.trim() !== '')

  return paragraphs.map(paragraph => {
    const parts = []
    let lastIndex = 0
    let gapIndex = 0

    const gapRegex = /(_+) \((.+?)\)/g
    let match

    while ((match = gapRegex.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          text: paragraph.substring(lastIndex, match.index)
        })
      }

      parts.push({
        type: 'gap',
        gapIndex: gapIndex++,
        gapLength: match[1].length,
        correctAnswer: match[2]
      })

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < paragraph.length) {
      parts.push({
        type: 'text',
        text: paragraph.substring(lastIndex)
      })
    }

    return parts
  })
}

const checkAnswers = (storyIndex) => {
  const story = storiesData.value.listOfStories[storyIndex]
  checkedStories.value[storyIndex] = true

  let correctCount = 0
  const gapParts = splitStoryText(story.text).flat().filter(p => p.type === 'gap')

  gapParts.forEach((gap, gi) => {
    const userAnswer = normalizeAnswer(answers.value[storyIndex][gi])
    const correctAnswer = normalizeAnswer(gap.correctAnswer)

    if (gap.correctAnswer.toLowerCase() === 'anyanswerisok' || userAnswer === correctAnswer) {
      correctCount++
    }
  })

  storyScores.value[storyIndex] = Math.round((correctCount / gapParts.length) * 100)
}

const getInputClass = (storyIndex, gapIndex, correctAnswer) => {
  if (!checkedStories.value[storyIndex]) return ''

  const userAnswer = normalizeAnswer(answers.value[storyIndex][gapIndex])
  const normalizedCorrect = normalizeAnswer(correctAnswer)

  if (correctAnswer.toLowerCase() === 'anyanswerisok') {
    return 'story-input-any'
  }

  return userAnswer === normalizedCorrect
    ? 'story-input-correct'
    : 'story-input-incorrect'
}

const goToNextStory = () => {
  if (currentStoryIndex.value < storiesData.value.listOfStories.length - 1) {
    currentStoryIndex.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPrevStory = () => {
  if (currentStoryIndex.value > 0) {
    currentStoryIndex.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getGrade = (percentage) => {
  if (percentage === 100) return { letter: 'A+', class: 'grade-Aplus' }
  if (percentage >= 85) return { letter: 'A', class: 'grade-A' }
  if (percentage >= 75) return { letter: 'B+', class: 'grade-Bplus' }
  if (percentage >= 60) return { letter: 'B-', class: 'grade-Bminus' }
  if (percentage >= 40) return { letter: 'C', class: 'grade-C' }
  if (percentage >= 20) return { letter: 'D', class: 'grade-D' }
  if (percentage >= 10) return { letter: 'E', class: 'grade-E' }
  return { letter: 'F', class: 'grade-F' }
}

const toggleScript = (index) => {
  expandedScriptIndex.value = expandedScriptIndex.value === index ? null : index
}

const parseUsefulWords = (wordsString) => {
  if (!wordsString) return []
  return wordsString.split(',').map(pair => {
    const [english, russian] = pair.split('-').map(s => s.trim())
    return { english, russian }
  })
}

const focusNextInput = (storyIndex, gapIndex) => {
  const nextIndex = gapIndex + 1
  if (nextIndex < answers.value[storyIndex].length) {
    nextTick(() => {
      const nextInput = inputFields.value.find(el =>
        Number(el.dataset.story) === storyIndex &&
        Number(el.dataset.gap) === nextIndex
      )
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
    })
  } else {
    nextTick(() => {
      const checkButton = document.querySelector(`.story-container[style*="block"] .check-button`)
      checkButton?.focus()
    })
  }
}

const disableAudioDownload = () => {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.classList.contains('audio-player')) {
      e.preventDefault()
      return false
    }
  })

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
    }
  })
}
</script>

<style scoped>
.stories-container {
  max-width: 56rem;
  margin: 2px auto;
  padding: 15px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  border-radius: 15px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  font-family: 'Courier New', monospace;
}

.stories-header {
  margin-bottom: 10px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.stories-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.main-description {
  font-size: 1.125rem;
  color: #aaa;
  font-style: italic;
}

.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.task-counter {
  font-size: 0.9rem;
  color: #d4af37;
  font-weight: 500;
  padding: 4px 10px;
  background-color: #333;
  border-radius: 12px;
  border: 1px solid #444;
  min-width: 50px;
  text-align: center;
}

.story-container {
  padding: 5px;
  margin-bottom: 2.5rem;
}

.story-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 6px;
  border-bottom: 1px dashed #444;
  padding-bottom: 5px;
}

.story-text {
  line-height: 1.8;
  margin: 15px 0;
  font-size: 1.1rem;
}

.story-text p {
  margin-bottom: 15px;
  line-height: 1.4;

}

.useful-words-container {
  margin: 15px 0;
  width: 100%;
}

.useful-words {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 15px;
  background-color: #333;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #444;
}

.useful-words-title {
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 5px;
}

.useful-words-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.word-pair {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}

.english-word {
  font-style: italic;
  color: #d4af37;
  font-weight: 500;
}

.translation {
  color: #aaa;
}

.separator {
  color: #666;
}

.comma {
  display: none;
}

.story-image-container {
  margin: 10px 0;
  text-align: center;
}

.story-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
}

.audio-player {
  width: 100%;
  border-radius: 0.5rem;
  background-color: #333;
  margin: 10px 0;
}

.text-script-content {
  margin-top: 10px;
  padding: 10px;
  background-color: #333;
  border-left: 4px solid #d4af37;
  border-radius: 6px;
  white-space: pre-line;
  font-size: 1rem;
  color: #aaa;
}

.story-footer {
  margin-top: 20px;
  border-top: 1px solid #333;
  padding-top: 15px;
}

.story-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.score-display {
  font-size: 1rem;
  color: #666;
  padding: 0 10px;
  transition: all 0.3s ease;
}

.score-visible {
  color: #e0e0e0;
  font-weight: bold;
  animation: fadeIn 0.5s ease;
}

.grade-Aplus { color: #4caf50 !important; }
.grade-A { color: #4caf50 !important; }
.grade-Bplus { color: #8bc34a !important; }
.grade-Bminus { color: #ffc107 !important; }
.grade-C { color: #ff9800 !important; }
.grade-D { color: #ff5722 !important; }
.grade-E { color: #f44336 !important; }
.grade-F { color: #d32f2f !important; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.check-button {
  padding: 8px 16px;
  background-color: #d4af37;
  color: #1a1a1a;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.check-button:hover {
  background-color: #c9a227;
}

.toggle-script-btn {
  background-color: #333;
  border: 1px solid #444;
  color: #aaa;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.9rem;
  white-space: nowrap;
  border-radius: 6px;
}

.toggle-script-btn:hover {
  color: #d4af37;
  border-color: #d4af37;
}

.story-navigation {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #444;
  background: #333;
  color: #d4af37;
  font-size: 1.1rem;
}

.nav-button:not(:disabled):hover {
  background-color: #444;
  border-color: #d4af37;
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  color: #666;
}

.story-input {
  padding: 1px 2px;
  border: 1px solid #444;
  border-radius: 4px;
  transition: all 0.2s;
  text-align: center;
  color: #e0e0e0;
  background-color: #333;
  margin: 2px 3px;
  font-family: inherit;
  font-size: inherit;
}

.input-small {
  width: 40px;
  min-width: 40px;
}

.input-medium {
  width: 80px;
  min-width: 80px;
}

.input-large {
  width: 160px;
  min-width: 160px;
}

.input-full {
  width: 100%;
  min-width: 200px;
  text-align: left;
  display: block;
  margin: 1px 0;
}

.story-input-correct {
  border-color: #91fb2a;
  background-color: rgba(77, 234, 150, 0.38);
  color: #91fb2a;
}

.story-input-incorrect {
  border-color: #f44336;
  background-color: #3a2d2d;
  color: #f44336;
}

.story-input-any {

  border-color: #4caf50;
  background-color: #2d3a2d;
  color: #4caf50;
}

.loading-container {
  text-align: center;
  padding: 20px;
  color: #aaa;
}

@media (max-width: 768px) {
  .story-controls {
    flex-wrap: wrap;
  }

  .score-display {
    order: 1;
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }

  .story-text {
    font-size: 1rem;
  }

}
</style>
