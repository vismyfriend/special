<template>
    <div>

      <!-- Сворачиваемое меню -->
      <div class="top-menu-wrapper" :class="{ collapsed: isMenuCollapsed }">
        <div class="top-menu-bar">
          <button class="menu-button" @click="showAboutGame">Доп.инфо</button>
          <button class="menu-button" @click="restartGame">Заново</button>
          <button class="menu-button" @click="changeSet">Другой набор</button>
          <button class="menu-button" @click="otherGames">Задания</button>
          <!-- Кнопка свернуть/развернуть -->
          <button class="collapse-button" @click="toggleMenu">
            {{ isMenuCollapsed ? 's.p.e.c.i.a.l.' : '...' }}
          </button>
        </div>
      </div>


      <!-- Модалка с сообщением -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <p v-html="modalMessage"></p>
          <button @click="closeModal">закрыть</button>
        </div>
      </div>

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
import {computed, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
const route = useRoute()
const router = useRouter();

const showModal = ref(false);
const modalMessage = ref('');
const isMenuCollapsed = ref(false);


// Методы для меню
const toggleMenu = () => {
  // isMenuCollapsed.value = !isMenuCollapsed.value;
};

const showAboutGame = () => {
  openModal(`
    <div style="text-align: center;">
      <p>Подробнее про <br>S.P.E.C.I.A.L.<br>и vismyfriend</p>

      <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">


        <!-- Кнопка "Обновления" (внутренний переход) -->
        <button onclick="window.__router.push('/v-is-my-friend/'); window.__modal.close()"
           style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          my site
        </button>

        <!-- Кнопка "Об авторах" (внешняя ссылка) -->
        <a href="https://vismyfriend.itch.io/clicker-test"
           target="_blank"
           style="padding: 8px 16px; background: #4CAF50; color: white; border-radius: 4px; text-decoration: none;">
          Who is Vincent?
        </a>
      </div>
    </div>
  `);
};

const restartGame = () => {
  router.go(0); // Аналог нажатия кнопки "Обновить" в браузере
};

const changeSet = () => {
  router.push("/see-all-sets-of-words/")
};

const otherGames = () => {
  if (route.params.missionName) {
    router.push(`/see-all-sets-of-words/${route.params.missionName}`);
  } else {
    router.push("/see-all-sets-of-words/");
  }
};


const openModal = (message) => {
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};



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

// Через 10 сек сворачиваем меню (однократно)
onMounted(() => {
  setTimeout(() => {
    isMenuCollapsed.value = true;
  }, 7000); // 7 000 мс = 7 сек
  window.__router = router;
  window.__modal = { close: closeModal };

});
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
    display: none
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


/* Стили меню */
.top-menu-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  overflow: visible;
  height: auto;
}


.top-menu-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
}

.collapsed .top-menu-bar {
  transform: translateY(-80%);
}

.collapse-button {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 20px;
  border: none;
  border-radius: 0 0 10px 10px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #2c3e50;
  z-index: 1001;
  transition: all 0.3s ease;
}

.collapse-button:hover {
  background: #f1f3f6;
}

.menu-button {
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f3f6 100%);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  cursor: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.menu-button:hover {
  background: linear-gradient(145deg, #f1f3f6 0%, #e6e9f0 100%);
  transform: translateY(-1px);
}


/* Свернутое состояние */
.top-menu-wrapper.collapsed .top-menu-bar {
  transform: translateY(-80%);
}

/* Ховер-эффект */
.top-menu-wrapper.collapsed:hover .top-menu-bar {
  transform: translateY(0);
}


/* Адаптивные стили */
@media (max-width: 768px) {
  .top-menu-bar {
    flex-wrap: wrap;
    padding: 8px;
    gap: 6px;
  }

  .menu-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .collapse-button {
    bottom: -17px;
    height: 20px;
    width: 70px;
    font-size: 10px;
  }
}
/* Стили модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 80%;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.modal-content button {
  margin-top: 15px;
  padding: 8px 15px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: none;
}
</style>
