<template>
    <div>
        <router-view />
        <button class="infoButton" @click="showInstructions"></button>

        <div v-if="isInstructionsVisible" class="overlay" @click="hideInstructions">
            <div class="instructions">
                <h3>what do u wanna do?</h3>
                                <q-btn class="q-mb-sm zoomIn" label="Попробовать ещё раз  " push color="green" @click="$router.go(0)" >
                    <span class="star-icons">
                        <q-icon name="star" color="yellow" />
                        <q-icon name="star" color="yellow" />
                        <q-icon name="star" color="yellow" />
                        <q-icon name="star" color="yellow" />
                        <q-icon name="star" color="yellow" />
                    </span>
                </q-btn>
                <q-btn class="q-mb-sm zoomIn" icon="search" label="Другой набор слов" push color="primary" @click="backToAllSets" />

                <q-btn class="q-mb-sm zoomIn" icon="fingerprint" label="QUIT S.P.E.C.I.A.L App"
                stack glossy color="purple" @click="backToIntroPage" />
              <!-- Кнопка показывается только если есть missionName -->
              <q-btn
                v-if="hasMissionName"
                push
                color="brown-5"
                @click="backToSameSet"
                label="Этот же набор, другое задание"
              >
                🔎
              </q-btn>

            </div>
        </div>
    </div>
</template>




<script setup>
import {computed, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
const route = useRoute()

const router = useRouter();
const isInstructionsVisible = ref(false);

// На страницу с играми этого же набора
const backToSameSet = () => {
  if (hasMissionName.value) {
    router.push(`/see-all-sets-of-words/${route.params.missionName}`);
  } else {
    console.error("missionName is undefined");
    // Кнопка не должна отображаться, если missionName не определён,
    // поэтому этот код выполнится только если что-то пошло не так
    router.push("/see-all-sets-of-words/");
  }
}

const backToAllSets = () => {
  router.push("/see-all-sets-of-words/");
}

// Вычисляемое свойство для проверки наличия missionName
const hasMissionName = computed(() => {
  return !!route.params.missionName;
});
// на предидущую страницу
// const goBack = () => {
//   router.go(-1)
//   //   router.push("/")
// }


const backToIntroPage = () => {
  router.push("/");
}

const showInstructions = () => {
  isInstructionsVisible.value = true;
}

const hideInstructions = () => {
  isInstructionsVisible.value = false;
}
</script>


<style lang="scss" scoped>

.star-icons {
    display: inline-flex; /* Используйте inline-flex для размещения иконок в строку */
    gap: 1px; /* Расстояние между звездами */
    align-items: center; /* Центрирование иконок по вертикали */
    margin-right: 5px; /* Отступ между звездами и текстом кнопки */
  }

  .q-btn {
    display: flex; /* Используйте flex для кнопки */
    align-items: center; /* Центрирование содержимого кнопки по вертикали */
  }

.closeThisPage {
    display: block;
    margin: 0 auto;

    border-radius: 30px;
    background-color: transparent;
}
.goToMissions {
    color: green;
    border-radius: 50px;
  }

  .goBackPage {
    color: green;
    border-radius: 50px;
  }
.infoButton {
    position: absolute;
    top: 20px;
    right: -50px;
    width: 50px; // Установите ширину кнопки
    height: 50px; // Установите высоту кнопки
    background-image: url('../assets/images/ApyGlassEmoji2.png'); // Укажите путь к вашему изображению
    background-size: cover; // Обеспечьте, чтобы изображение заполнило кнопку
    background-position: center; // Центрируйте изображение
    background-color: transparent;
    border: none; // Уберите рамку
    border-radius: 50%; // Круглая форма
    cursor: pointer; // Курсор при наведении
    transition: transform 0.3s, box-shadow 0.3s; // Плавный эффект при наведении
}

.infoButton:hover {
    transform: scale(1.1); // Увеличение при наведении
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // Тень при наведении
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8); // Затемнение
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; // Убедитесь, что затемнение выше других элементов
}

.instructions {
    background: white;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;

}
</style>
