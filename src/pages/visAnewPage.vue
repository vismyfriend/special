<template>
    <div>
        
        <div>
            
            <button class="closeThisPage" @click="backToIntroPage">back to intro page ❌</button>
            <div class="glass-buttons-container">

                <div class="btn"><a href="">красивые</a></div>
                <div class="btn"><a href="">стеклянные</a></div>
                <div class="btn"><a href="">кнопки</a></div>  
            </div>
        </div>
        
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router';



// посмотреть на какой платформе открыт сайт
import { useQuasar } from 'quasar';
const $q=useQuasar()
console.log($q.platform.is) 
// посмотреть на какой платформе открыт сайт


const router = useRouter()

const backToIntroPage = () => {
    router.push("/")
}

</script>

<style lang="scss" scoped>
.closeThisPage {
    display: block;
    margin: 10px auto;
    border-radius: 30px;
    background-color: transparent;
   
   }
   .glass-buttons-container {
    width: 600px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .btn {
      position: relative;
      width: 155px;
      height: 50px;
      margin: 20px;
      a {
        position: absolute; // Абсолютное позиционирование для ссылки внутри кнопки
        top: 0;
        left: 0;
        width: 100%; // Заполняет всю кнопку
        height: 100%; // Заполняет всю кнопку
        display: flex; // Используем flexbox для центрирования текста
        justify-content: center; // Центрируем по горизонтали
        align-items: center; // Центрируем по вертикали
        background: rgba(255,255,255,0.05); // Полупрозрачный фон
        box-shadow: 0 15px 35px rgba(0,0,0,0.2); // Тень для создания эффекта глубины
        border-top: 1px solid rgba(255,255,255,0.1); // Верхняя граница
        border-bottom: 1px solid rgba(255,255,255,0.1); // Нижняя граница
        border-radius: 30px; // Закругленные углы
        color: #fff; // Цвет текста
        z-index: 1; // Устанавливаем уровень наложения
        font-weight: 400; // Толщина шрифта
        letter-spacing: 1px; // Расстояние между буквами
        text-decoration: none; // Убираем подчеркивание у ссылки
        overflow: hidden; // Скрываем все, что выходит за пределы кнопки
        transition: 0.5s; // Плавный переход для изменений стилей
        backdrop-filter: blur(15px); // Эффект размытия фона за кнопкой

        &:before {
            // Псевдоэлемент перед ссылкой
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to left, rgba(255,255,255,0.15), transparent);
          transform: skewX(45deg) translateX(0); // Наклон и начальная позиция
          transition: 0.5s; // Плавный переход
        } 
      }
         // Эффекты при наведении на кнопку
         &:hover a {
            letter-spacing: 3px; // Увеличиваем расстояние между буквами
            transition: 0.5s; // Плавный переход

            &:before {
                // Анимация псевдоэлемента при наведении
                transform: skewX(45deg) translateX(200%); // Перемещаем псевдоэлемент
            }
        }
    // Эффекты при наведении на саму кнопку
    &:hover:before {
        bottom: 0; // Перемещаем псевдоэлемент вниз
        height: 50%; // Увеличиваем высоту до 50%
        width: 80%; // Увеличиваем ширину до 80%
        border-radius: 30px; // Закругляем углы
        transition-delay: 0.5s; // Задержка перед началом анимации
    }

      &:hover:after {
        top: 0;
        height: 50%;
        width: 80%;
        border-radius: 30px;
        transition-delay:0.5s;
      }


      // Псевдоэлементы для создания эффекта под кнопкой
      &:before {
        content: ''; // Создаем пустой контент
        position: absolute; // Абсолютное позиционирование
        left: 50%; // Центрируем по горизонтали
        transform: translateX(-50%); // Сдвигаем на половину ширины
        bottom: -5px; // Сдвигаем вниз
        width: 30px; // Ширина
        height: 10px; // Высота
        background: #f00; // Красный фон
        border-radius: 10px; // Закругленные углы
        transition: 0.5s; // Плавный переход
    }
        // Второй псевдоэлемент
        &:after {
            content: ''; // Создаем пустой контент
            position: absolute; // Абсолютное позиционирование
            left: 50%; // Центрируем по горизонтали
            transform: translateX(-50%); // Сдвигаем на половину ширины
            top: -5px; // Сдвигаем вверх
            width: 30px; // Ширина
            height: 10px; // Высота
            background: #f00; // Красный фон
            border-radius: 10px; // Закругленные углы
            transition: 0.5s; // Плавный переход
        }

        // Устанавливаем разные цвета для псевдоэлементов в зависимости от порядка кнопки
      &:nth-child(1):before, &:nth-child(1):after {
        background: #ff1f71;
        box-shadow: 0 0 5px #ff1f71, 0 0 15px #ff1f71, 0 0 30px #ff1f71, 0 0 60px #ff1f71;
      } // эффект свечения
      &:nth-child(2):before, &:nth-child(2):after {
        background: #2bd2ff;
        box-shadow: 0 0 5px #2bd2ff, 0 0 15px #2bd2ff, 0 0 30px #2bd2ff, 0 0 60px #2bd2ff;
      }
      &:nth-child(3):before, &:nth-child(3):after {
        background: #1eff45;
        box-shadow: 0 0 5px #1eff45, 0 0 15px #1eff45, 0 0 30px #1eff45, 0 0 60px #1eff45;
      } // эффект свечения
    }
  }
</style>