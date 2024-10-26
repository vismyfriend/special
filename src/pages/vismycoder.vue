<template>
    <div>
        <button class="closeThisPage" @click="backToIntroPage">back to intro page ❌</button> 
        <q-btn class="q-mb-sm zoomIn" icon="print" label="тут вИнсентик тренируется кодить, здесь всё интересно, но ничего непонятно =)" push color="green" @click="goToAnewPage" />
        <button class="image-button ios-shake" id="youTube-logo"></button>   
		
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const backToIntroPage = () => {
    router.push("/")
}

const goToAnewPage = () => { 
        router.push("/a-new-page") 
}


</script>

<style lang="scss" scoped>
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