<template>
    <div>
        <div class="main-cont">
            <div class="content-wrapper">
                <div class="char-cont">
                    <div id="big-char" class="char">{{ displayedChar }}</div>
                </div>
                <button id="show-keyboard-button" @click="showKeyboard">Show Keyboard</button>
                <button id="hide-button" @click="hideAbout">Hide About</button>
                <button id="about-button" @click="showAbout">About</button>
                <div id="about-cont" v-if="showAboutSection">
                    <div class="about-white-bg">
                        <h2 class="about-title">About This Game</h2>
                        <p class="about-text">This is a fun alphabet game.</p>
                        <button id="hide-button" @click="hideAbout">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <audio ref="audioPlayer">
            <source id="mp3Source" />
            <source id="oggSource" />
        </audio>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const displayedChar = ref('');
const showAboutSection = ref(false);
const myName = ref('');
const audioPlayer = ref(null);

const setLetterSound = (letter) => {
    const mp3Source = document.getElementById('mp3Source');
    const oggSource = document.getElementById('oggSource');
    mp3Source.src = `https://mahdif.github.io/alphabets-game/sounds/mp3/${letter}.mp3`;
    oggSource.src = `https://mahdif.github.io/alphabets-game/sounds/ogg/${letter}.ogg`;
};

const setGenericSound = () => {
    const mp3Source = document.getElementById('mp3Source');
    const oggSource = document.getElementById('oggSource');
    mp3Source.src = 'https://mahdif.github.io/alphabets-game/sounds/mp3/like-glass.mp3';
    oggSource.src = 'https://mahdif.github.io/alphabets-game/sounds/ogg/like-glass.ogg';
};

const runAudioPlayer = () => {
    audioPlayer.value.load();
    audioPlayer.value.play();
};

const showAbout = () => {
    showAboutSection.value = true;
};

const hideAbout = () => {
    showAboutSection.value = false;
};

const showKeyboard = () => {
    document.getElementById('mobile-text-input').focus();
};

const handleKeyPress = (event) => {
    if (event.charCode) {
        const char = String.fromCharCode(event.charCode);
        displayedChar.value = char;

        if (/[^\w]/.test(char)) { // Check for non-alphanumeric characters
            setGenericSound();
            runAudioPlayer();
        } else {
            setLetterSound(char.toLowerCase());
            runAudioPlayer();
        }

        myName.value += char;
        if (myName.value === "mahdi") {
            alert('You typed my name!\n--------------------------------\nNow I will show you my website.');
            window.open('http://mahdif.com', '_blank');
        }
    }
};

document.addEventListener('keypress', handleKeyPress);
</script>

<style scoped>
/* Вставьте ваш CSS код здесь */


  .main-cont {
    width: 100%;
    height: 100%;
    position: fixed;
    background: -webkit-linear-gradient(left, #CC0000 0%, #FF5100 100%);
    background: linear-gradient(90deg, #CC0000 0%, #FF5100 100%);
    z-index: -1;
  }
  
  #mobile-text-input {
    position: absolute;
    top:-500px;
    left:-500px;
  }
  
  #show-keyboard-button {
    margin: 40px 0 0 0;
    display: none;
  }
  #show-keyboard-button:hover{
    background: none;
    color: white;
  }
  
  #about-cont{
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    padding: 20px;
    z-index: 10;
    display: none;
  }
  
  .content-wrapper{
    width: 600px;
    margin: 0 auto;
    position: relative;
    height: 100%;
  }
  .content-wrapper, .char-cont {
    padding: 0 20px;
  }
  
  .about-white-bg {
    background: rgba(255, 255, 255, 1);
    padding: 20px;
    color: #333;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 0;
    -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
    z-index: 2;
    width: 100%;
  }
  
  .about-text {
    color: #666666;
  }
  
  .about-text a{
    color: #CC0000;
    text-decoration: none;
  }
  .about-text a:hover {
    text-decoration: underline;
  }
  
  .about-image {
    background:url('https://mahdif.github.io/alphabets-game/images/omgomgomg.gif') center no-repeat;
    width:100%;
    height:150px;
    margin: 20px 0;
  }
  
  hr {
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    margin: 20px 0;
  }
  
  .about-title {
    font-size: 24px;
    font-weight: 400;
  }
  
  #hide-button {
    padding: 10px 20px;
    margin: 20px 0 0 0;
    background: white;
    border: 1px solid rgba(0,0,0,0.2);
    font-size: 16px;
    border-radius: 2px;
    color: rgba(0,0,0,0.7);
    cursor: pointer;
  }
  #hide-button:hover {
    background: #CC0000;
    color: white;
  }
  #hide-button:active {
    background: #980000;
    color: white;
  }
  
  .char-cont {
    width: 100%;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
    z-index: 2;
  }
  
  .char {
    font-size: 160px;
    font-weight: 300;
    position: relative;
  }
  .animationHabibi {
    animation: growAnimation 0.2s ease-in-out 0s;
    -webkit-animation: growAnimation 0.2s ease-in-out 0s;
    -moz-animation: growAnimation 0.2s ease-in-out 0s;
  }
  
  footer {
    position: fixed;
    bottom: 20px;
    left: 0;
    width: 100%;
    z-index: 1;
  }
  
  .habibi-button {
    display: inline-block;
    margin: 0 10px;
    padding: 14px 30px;
    font-size: 14px;
    background: none;
    color: white;
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 2px;
    cursor: pointer;
  }
  
  .habibi-button:hover {
    background: white;
    color: #DB1010;
  }
  
  .habibi-button:active {
    background: rgba(0,0,0,0.4);
    border-color: rgba(0, 0, 0, 0);
    color: white;
  }
  
  /* Make me responsive */
  @media screen and (max-width: 800px){
    body {
      font-size: 14px;
    }
    .about-title {
      font-size: 18px;
    }
    .char {
      font-size: 80px;
    }
    .content-wrapper {
      width: 100%;
      overflow: auto;
    }
    .char-cont {
      position: relative;
      -webkit-transform: none;
              transform: none;
      top: 0;
      margin: 40px 0 20px 0;
    }
    .animationHabibi {
      -webkit-animation: none;
              animation: none;
    }
    #show-keyboard-button {
      display: inline-block;
    }
    footer {
      position: relative;
      margin-top: 200px;
      bottom: 0;
    }
  }
  @media screen and (max-width: 600px){
    .char {
      font-size: 50px;
    }
    .about-image {
      height: 90px;
      background-size: 90%;
    }
  }
  
  /*
    Animation habibi
  */
  @-webkit-keyframes growAnimation {
    0%   {
      opacity: 0;
      font-size: 0;
    }
    100% {
      opacity: 1;
      font-size: 160px;
    }
  }
  @keyframes growAnimation {
    0%   {
      opacity: 0;
      font-size: 0;
    }
    100% {
      opacity: 1;
      font-size: 160px;
    }
  }
</style>
