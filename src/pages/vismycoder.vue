<template>
    <div class="mouse-container" @mousemove="handleMouseMove">
        <button class="closeThisPage" @click="backToIntroPage">back to intro page ❌</button> 
        <q-btn class="q-mb-sm zoomIn" icon="print" label="тут вИнсентик тренируется кодить, здесь всё интересно, но ничего непонятно =)" push color="green" @click="goToAnewPage" />
        <button class="image-button ios-shake" id="youTube-logo"></button>   

        <!-- Элементы для радиокнопок -->
        <div class="chooser">
            <input type="radio" v-model="fallDirection" value="1" id="r1" />
            <label for="r1">Gravity On</label>
            <input type="radio" v-model="fallDirection" value="-1" id="r2" />
            <label for="r2">No Gravity</label>
            <input type="radio" v-model="fallDirection" value="0" id="r3" />
            <label for="r3">Fade Away</label>
        </div>

        <!-- Контейнер для анимации -->
        <div ref="animationContainer" id="animation-container"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const animationContainer = ref(null); // Use ref to get a reference to the DOM element
const fallDirection = ref(1);

const backToIntroPage = () => {
    router.push("/");
}

const goToAnewPage = () => { 
    router.push("/a-new-page"); 
}

// Логика для анимации следов мыши
let x1 = 0, y1 = 0;
const dist_to_draw = 50;
const delay = 1000;
const fsize = ['1.1rem', '1.4rem', '.8rem', '1.7rem'];
const colors = ['#E23636', '#F9F3EE', '#E1F8DC', '#B8AFE6', '#AEE1CD', '#5EB0E5'];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const selRand = (o) => o[rand(0, o.length - 1)];
const distanceTo = (x1, y1, x2, y2) => Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));
const shouldDraw = (x, y) => (distanceTo(x1, y1, x, y) >= dist_to_draw);

const addStr = (x, y) => {
    const str = document.createElement("div");
    str.innerHTML = '&#10022;';
    str.className = 'star';
    str.style.top = `${y + rand(-20, 20)}px`;
    str.style.left = `${x}px`;
    str.style.color = selRand(colors);
    str.style.fontSize = selRand(fsize);
    animationContainer.value.appendChild(str); // Use the ref here

    str.animate(
        {
            translate: [
                `${rand(-5, 5)}px ${((y + 10) > window.innerHeight ? window.innerHeight - y : 10) * fallDirection.value * 0.3}px`,
                `${rand(-20, 20)}px ${((y + 10) > window.innerHeight ? window.innerHeight - y : 10) * fallDirection.value}px`
            ],
            opacity: [1, 0],
            transform: ['rotateX(0) rotateY(0)', `rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`]
        },
        {
            duration: delay,
            fill: 'forwards',
        }
    );

    setTimeout(() => {
        str.remove();
    }, delay);
}

const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (shouldDraw(clientX, clientY)) {
        addStr(clientX, clientY);
        x1 = clientX;
        y1 = clientY;
    }
};
</script>
<style lang="scss" scoped>

.mouse-container {
    
}
.chooser {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

.star {
    position: absolute;
    font-size: 1rem;
    pointer-events: none;
}

.closeThisPage {
    display: block;
    margin: 10px auto;
    border-radius: 30px;
    background-color: transparent;
   }


.ios-shake {
	animation-name: ios-shake;
	animation-duration: 1s;
	animation-direction: alternate;
	animation-iteration-count: infinite;
	animation-timing-function: ease-in-out;
	will-change: transform;
	backface-visibility: hidden;
}
/* Negative delay, preventing icons from remaining static at the beginning */
.ios-shake:nth-of-type(2n) {
	animation-delay: -0.3s;
}
.ios-shake:nth-of-type(3n) {
	animation-delay: -0.6s;
}
@keyframes ios-shake {
	10% {
		transform: translate(1px, 1px) rotate3d(0, 0, 1, 2deg);
	}
	20% {
		transform: translate(0px, 0px) rotate3d(0, 0, 1, -2deg);
	}
	30% {
		transform: translate(-1px, -1px) rotate3d(0, 0, 1, 2deg);
	}
	40% {
		transform: translate(0px, 0px) rotate3d(0, 0, 1, -2deg);
	}
	50% {
		transform: translate(1px, 1px) rotate3d(0, 0, 1, 2deg);
	}
	60% {
		transform: translate(1px, 0px) rotate3d(0, 0, 1, -2deg);
	}
	70% {
		transform: translate(0px, 0px) rotate3d(0, 0, 1, 2deg);
	}
	80% {
		transform: translate(0px, 1px) rotate3d(0, 0, 1, -2deg);
	}
	90% {
		transform: translate(1px, 1px) rotate3d(0, 0, 1, 2deg);
	}
}
.ios-shake:active {
	filter: brightness(0.7);
	animation: none;
}

.image-button::before {
	position: absolute;
	content: "x";
	background: #fcfffd;
	top: -0.5em;
	left: -0.25em;
	width: 1.5em;
	height: 1.5em;
	border-radius: 0.75em;
}
.image-button {
        width: 90px;
        height: 55px; /* Задайте высоту, чтобы кнопка была видимой */
        background-image: url('../assets/images/youtubeLogoOval.png'); /* Используйте url() для указания пути к изображению */
        background-size: cover; /* Это позволит изображению занимать всю кнопку */
        background-position: center; /* Центрирует изображение */
        border: none; /* Убирает стандартные границы кнопки */
        cursor: pointer; /* Изменяет курсор при наведении */
        border-radius: 20px; /* Закругляет края кнопки */
        transition: transform 0.3s; /* Добавляет эффект при наведении */
    }
    
    .image-button:hover {
        transform: scale(1.05); /* Увеличивает кнопку при наведении */
    }

    .zoomIn:hover {
        transition: transform 0.3s; /* Добавляет эффект при наведении */

        transform: scale(1.05); /* Увеличивает кнопку при наведении */

    }
	
</style>