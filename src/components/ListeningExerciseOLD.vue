<template>
  <div class="space-y-8 px-6 py-8 bg-white rounded-3xl shadow-2xl max-w-4xl mx-auto">
    <div>
      <h2 class="text-3xl font-bold text-gray-900 mb-1">S.P.E.C.i.A.L.</h2>
      <p class="text-lg text-gray-600">These people have to go somewhere. <br> How will each person get there? <br>Listen and choose (✓) the correct answer.</p>
    </div>

    <div class="w-full">
      <audio
        controls
        controlsList="nodownload"
        @contextmenu.prevent
        class="w-full rounded-lg shadow-md"
      >
        <source src="../assets/audio/Without Me Audio.mp3" type="audio/mp3" />
        Your browser does not support the audio element.

      </audio>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-left">
        <thead>
        <tr>
          <th class="py-3 text-sm font-semibold text-gray-500">Part 1</th>
          <th class="py-3 text-sm font-semibold text-center text-gray-500">True</th>
          <th class="py-3 text-sm font-semibold text-center text-gray-500">False</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="(q, i) in questions" :key="i" class="hover:bg-gray-50">
          <td class="py-4 pr-4 text-gray-800 max-w-sm">{{ i + 1 }}) {{ q.text }}</td>
          <td class="text-center">
            <input
              type="radio"
              :name="'q' + i"
              value="true"
              v-model="answers[i]"
              class="accent-green-600 w-5 h-5"
            />
          </td>
          <td class="text-center">
            <input
              type="radio"
              :name="'q' + i"
              value="false"
              v-model="answers[i]"
              class="accent-red-600 w-5 h-5"
            />
          </td>
        </tr>

        <div class="w-full">
          <audio
            controls
            controlsList="nodownload"
            @contextmenu.prevent
            class="w-full rounded-lg shadow-md"
          >
            <source src="../assets/audio/how_are_they_getting_there.mp3" type="audio/mp3" />
            Your browser does not support the audio element.

          </audio>
        </div>
        </tbody>
        <thead>
        <tr>
          <th class="py-3 text-sm font-semibold text-gray-500">Part 2</th>
          <th class="py-3 text-sm font-semibold text-center text-gray-500">A</th>
          <th class="py-3 text-sm font-semibold text-center text-gray-500">B</th>
          <th class="py-3 text-sm font-semibold text-center text-gray-500">C</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="(q, i) in questions" :key="i" class="hover:bg-gray-50">
          <td class="py-4 pr-4 text-gray-800 max-w-sm">{{ i + 1 }}) {{ q.text }}</td>
          <td class="text-center">
            <input
              type="radio"
              :name="'q' + i"
              value="true"
              v-model="answers[i]"
              class="accent-green-600 w-5 h-5"
            />
          </td>
          <td class="text-center">
            <input
              type="radio"
              :name="'q' + i"
              value="false"
              v-model="answers[i]"
              class="accent-red-600 w-5 h-5"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const questions = [
  { text: 'There is a big baseball game today.' },
  { text: 'There is a traffic jam on the freeway.' },
  { text: 'Taxis usually don’t come very quickly.' },
  { text: 'Kevin lives close to Harry.' },
  { text: 'The traffic is backing up because a traffic light is broken.' },
  { text: 'The weather is not so good.' }
]

const answers = ref(Array(questions.length).fill(null))
</script>

<style lang="scss" scoped>
/* Пример адаптивности */
table {
  @apply w-full;
}
input[type='radio'] {
  @apply transition duration-150 ease-in-out;
}
</style>
