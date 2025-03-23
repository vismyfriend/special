<template>
    <div>
        <div class="sliderSwitcher-container">
            <label class="sliderSwitcher">
                <input type="checkbox" v-model="isSorted" />
                <span class="slider">
                    <span class="slider-text"> отсортировать</span>
                    <span class="slider-handle"></span>
                </span>
            </label>
            <button class="print-button" @click="printData">print PDF</button>
        </div>

        <div class="row" v-if="currentGameData.length > 0">
            <div class="col index-col">
                <div class="wordCard" v-for="(word, index) in displayedGameData"
                :key="word.id"
                @click="toggleWord(index)"
                :class="{ 'toggled': toggledWords[index], 'highlight': lastToggledIndex === index }">

                <span class="index-text">{{ index + 1 }}</span>
                </div>
            </div>
            <div class="col eng-col">
                <div class="wordCard"
                     v-for="(word, index) in displayedGameData"
                     :key="word.id"
                     @click="toggleWord(index)"
                     :class="{ 'toggled': toggledWords[index], 'highlight': lastToggledIndex === index }">
                    <span><strong>{{ word.eng }}</strong> <span class="hint-text ">{{ word.hint }}</span></span>
                </div>
            </div>
            <div class="col ru-col">
                <div class="wordCard"
                     v-for="(word, index) in displayedGameData"
                     :key="word.id"
                     @click="toggleWord(index)"
                     :class="{ 'toggled': toggledWords[index], 'highlight': lastToggledIndex === index }">
                    <span>{{ word.ru }}</span>
                </div>
            </div>
        </div>
        <div class="excel-pattern none" v-if="currentGameData.length > 0">
            <table class="print-table">
                <thead>
                    <tr>
                        <th> №</th>
                        <th> по-английски:</th>
                        <th> по-русски:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(word, index) in displayedGameData" :key="word.id">
                        <td> {{ index + 1 }}</td>
                        <td> {{ word.eng }} {{ word.hint }} </td>
                        <td> {{ word.ru }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import shortWordsData from '../dataForGames/short-words-data';

const router = useRouter();
const route = useRoute();

const currentMission = ref();
const currentGameData = ref([]);
const isSorted = ref(false);
const toggledWords = ref([]);
const lastToggledIndex = ref(null); // Индекс последнего нажатого слова

const displayedGameData = computed(() => {
    return isSorted.value
        ? currentGameData.value.slice().sort((a, b) => a.eng.localeCompare(b.eng))
        : currentGameData.value;
});

const printData = () => {
    // Получаем все контейнеры, которые нужно скрыть
    const sliderSwitcherContainer = document.querySelector('.sliderSwitcher-container');
    const rowContainer = document.querySelector('.row'); // Если у вас есть контейнер с классом row
    const excelPatternContainer = document.querySelector('.excel-pattern');
    const body = document.body; // Получаем body для изменения фона

  const originalBackground = body.style.backgroundImage;

// Скрываем все контейнеры, кроме excel-pattern
sliderSwitcherContainer.style.display = 'none'; // Предполагается, что элемент существует
rowContainer.style.display = 'none'; // Предполагается, что элемент существует
excelPatternContainer.style.display = 'block'; // Предполагается, что элемент существует

setTimeout(() => {
    window.print();

}, 700);

setTimeout(() => {
    sliderSwitcherContainer.style.display = 'flex'; // Или 'block', в зависимости от вашего дизайна
    rowContainer.style.display = 'flex'; // Или 'block', в зависимости от вашего дизайна
    excelPatternContainer.style.display = 'none'; // Скрываем excel-pattern снова
}, 3000); // 1000 миллисекунд = 1 секунда


    // Печатаем содержимое



};

const toggleWord = (index) => {
    // Устанавливаем индекс последнего нажатого слова при каждом нажатии
    lastToggledIndex.value = index;

    // Переключаем состояние нажатия
    toggledWords.value[index] = !toggledWords.value[index];
};

onMounted(() => {
    currentMission.value = route.params.missionName;
    currentGameData.value = shortWordsData[currentMission.value] || [];
});
</script>



<style lang="scss" scoped>


.sliderSwitcher-container {
    font-size: 18px;
    user-select: none;
    display: flex;
    align-items: center; /* Центрируем элементы по вертикали */
    padding-top: 5px;
}
input[type="checkbox"] {
    display: none; /* Скрыть стандартный чекбокс */
}
.sliderSwitcher {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 170px; /* Ширина переключателя */
    height: 34px; /* Высота переключателя */
    margin-right: 10px; /* Отступ между переключателем и текстом */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Легкая тень для объема */
    border-radius: 34px; /* Закругление краев */
    background: linear-gradient(180deg, #f0f0f0, #d9d9d9); /* Градиент для фона */

}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: #ccc; /* Цвет фона переключателя */
    transition: background-color .4s, box-shadow .4s; /* Плавный переход */
    border-radius: 34px; /* Закругление краев */
    box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.5); /* Внутренняя тень для эффекта глубины */

}
.slider-text {
    font-size: 14px;
    padding: 10px 36px;
    display: flex;
}
.slider:before {
    position: absolute;
    content: "AZ";
    padding-top: 7px;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    height: 26px; /* Высота ползунка */
    width: 26px; /* Ширина ползунка */
    left: 140px; /* Отступ слева НАЧАЛЬНОЕ ПОЛОЖЕНИЕ ПОЛЗУНКА*/
    bottom: 4px; /* Отступ снизу */
    background-color: white; /* Цвет ползунка */
    transition: transform .4s; /* Плавный переход */
    border-radius: 50%; /* Закругление ползунка */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Тень для ползунка */
}

input:checked + .slider {
    background-color: #2196F3; /* Цвет фона при включении */
    box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.5); /* Внутренняя тень при включении */
}

input:checked + .slider:before {
    transform: translateX(-132px); /* Перемещение ползунка при включении */
}

.row {
    margin-top: 20px;
    display: flex;
}

.col {
    color: wheat;
    flex-direction: column;
}

.index-col {
    flex: 0 0 30px;
}

.wordCard.highlight {
    background-color: rgba(13, 236, 91, 0.61); /* Светло-зеленый фон для выделения */
}
.index-text {
    font-size: 9px;
    color: #656565;
}

.eng-col {

}

.ru-col {
    flex: 0 0 125px;
    font-size: 12px;
}

.hint-text {
    color: #777474;
    font-size: 0.9em;
}


.wordCard {
    background-color: #f9f9f9;
    border: 0.5px solid #656565;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    color: black;
    height: 20px;
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Плавный переход */
}

.wordCard:hover {
    transform: scale(1.05); /* Увеличение при наведении */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень при наведении */
    background-color: rgba(2, 116, 255, 0.518); /* Полупрозрачный фон при нажатии */
    color: white; /* Цвет текста для карточки */
    font-size: 11px; /* Уменьшение размера шрифта */
    font-weight: normal; /* Убираем жирность */
}

.wordCard:hover .hint-text {
    color: white; /* Цвет текста для hint при наведении на карточку */
    font-size: 14px; /* Увеличение размера шрифта для hint */
    font-weight: bold; /* Делаем текст жирным */
}
.wordCard.toggled {
    background-color: rgba(255, 255, 255, 0.5); /* Полупрозрачный фон при нажатии */
        color: #777474;

}

/* Стили для печати */
@media print {
    body {
        background: none; /* Убираем фон у body */
    }

    .sliderSwitcher-container {
        display: none; /* Скрыть переключатель и кнопку при печати */
    }

    .wordCard {
        background-color: #f9f9f9;
        border: none; /* Убираем границы при печати */
    }

    .row {
        display: none;
    }

    .excel-pattern {
        display: flex;
    }
}
.print-button {
    background: linear-gradient(180deg, #f0f0f0, #d9d9d9); /* Градиентный фон кнопки */
    border: none; /* Убираем стандартные границы кнопки */
    border-radius: 34px; /* Закругляем углы кнопки */
    color: #333; /* Цвет текста на кнопке */
    font-size: 18px; /* Размер шрифта текста на кнопке */
    padding: 8px 16px; /* Внутренние отступы (сверху/снизу и слева/справа) */
    cursor: pointer; /* Указатель при наведении на кнопку */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для создания эффекта объема */
    transition: background-color 0.4s, box-shadow 0.4s, transform 0.2s; /* Плавный переход для фона, тени и увеличения */
    margin-left: 10px; /* Отступ слева от кнопки */
    height: 30px; /* Высота кнопки */
    width: 110px; /* Ширина кнопки */
    align-items: center; /* Вертикальное выравнивание содержимого по центру */
    display: flex; /* Используем flexbox для выравнивания содержимого */
    justify-content: center; /* Горизонтальное выравнивание содержимого по центру */
}

.print-button:hover {
    background-color: #e0e0e0; /* Цвет фона при наведении */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Увеличиваем тень при наведении */
    transform: scale(1.15); /* Увеличиваем кнопку на 5% при наведении */
    font-weight: bold; /* Меняем жирность текста при наведении */
}

.print-button:active {
    background-color: #d9d9d9; /* Цвет фона при нажатии */
    transform: scale(0.95); /* Уменьшаем кнопку на 5% при нажатии для эффекта нажатия */
}

.excel-pattern {
}

.print-table {
    width: 100%;
    /* Ширина таблицы */
    border-collapse: collapse;
    /* Убираем двойные границы */
    background-color: #f2f2f2;
    /* Цвет фона для заголовков */

}

.print-table th,
.print-table td {
    border: 1px solid #000000;
    /* Граница ячеек */
    padding: 1px;
    /* Отступы внутри ячеек */
    text-align: left;
    /* Выравнивание текста */
}

.print-table th {
    background-color: #f2f2f2;
    /* Цвет фона для заголовков */
}

.none{
    display: none;

}
</style>
