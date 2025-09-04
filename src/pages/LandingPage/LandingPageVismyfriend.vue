<template>
  <div class="landing-page">
    <!-- Navigation -->
    <section id="headerTitle">
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-logo">
            <i class="fas fa-magnifying-glass"></i>
            <span @click.prevent="scrollToSection('headerTitle')">S.P.E.C.I.A.L &nbsp; <span class="special-font">/ спэшл /</span> </span>
          </div>

          <!-- Навигационное меню -->
          <div class="nav-menu" :class="{ 'active': isMobileMenuOpen }">
            <a href="#" @click.prevent="scrollToSection('mission'); closeMobileMenu()">Что это?</a>
            <a href="#" @click.prevent="scrollToSection('services'); closeMobileMenu()">Сколько?</a>
            <a href="#" @click.prevent="scrollToSection('cases'); closeMobileMenu()">Кейсы</a>
            <a href="#" @click.prevent="scrollToSection('contact'); closeMobileMenu()">Контакты</a>
          </div>

          <div class="nav-cta">
            <button class="btn-primary" @click.prevent="scrollToSection('services')">Записаться</button>
          </div>

          <!-- Бургер-меню -->
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </section>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="highlight">АНГЛИЙСКИЙ</span><br>
            English<br>

          </h1>
          <p class="hero-subtitle">
            Добро пожаловать на уроки к тичеру Винсенту (<span class="white-text">Vincent</span>). Каждый урок это (<span class="white-text">mission</span>) как новое расследование,
            а каждый студент (<span class="white-text">agent</span>) детектив, спец.агент, раскрывающий секреты языка через общение в разных жизненных ситуациях.
          </p>


          <div class="hero-stats none">
            <div class="stat">
              <span class="stat-number">16 yearz</span>
              <span class="stat-label">опыт<br></span>
            </div>
            <div class="stat">
              <span class="stat-number">2100+</span>
              <span class="stat-label">довольных<br>учеников</span>
            </div>
            <div class="stat">
              <span class="stat-number">3</span>
              <span class="stat-label">доступных<br>курса </span>
            </div>
          </div>

          <div class="hero-buttons">
<!--            <button class="btn-primary btn-large" @click.prevent="scrollToSection('services')">-->
<!--              <i class="fas fa-play" ></i>-->
<!--              Начать <br> расследование-->
<!--            </button>-->
          <div class="text-align-center">




            <div class="gif-container">
              <img :src="gifs.matrixPills2" alt="Matrix pills" class="detective-gif" />

            </div>



            <button class="btn-mission btn-large" @click.prevent="scrollToSection('services')">
              <i class="fas fa-search" ></i>
              Попробовать <br> <span class="special-font">бесплатно</span>
            </button>


          </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="gif-container">
            <img
              :src="gifs.doYouUnderstand"
              alt="Анимированный детектив"
              class="detective-gif"
            />
          </div>
          <div class="detective-card">
            <div class="card-header">
              <i class="fas fa-user-secret"></i>
              <span>Цитаты от <strike class="gray-text">студентов</strike> агентов :</span>
            </div>
            <div class="card-content">
              <p>"Круто, что мы учимся говорить, а не названия грамматики зубрим"</p>
            </div>
          </div>
          <!-- Добавьте гифку здесь -->
          <div class="gif-container">
            <img
              :src="gifs.missionIsPossible"
              alt="Анимированный детектив"
              class="detective-gif"
            />
          </div>

        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section id="mission" class="mission">
      <div class="container">
        <div class="section-header">
<!--          <h2>Методика S.P.E.C.I.A.L</h2>-->
<!--          <h2>Методика <span class="special-font">S.P.E.C.I.A.L</span></h2>-->
          <h2><span class="special-font highlight">спэшл</span> S.P.E.C.I.A.L <br>
            <span class="special-font highlight"> методика &nbsp; </span> </h2>
          <p>Индивидуальный особенный подход в изучении иностранных языков<br> - разговорный для ежедневного общения! Подробнее на карточках : </p>
        </div>

        <Carousel v-bind="carouselConfig" class="custom-carousel">
          <Slide v-for="(slide, index) in carouselSlides" :key="index">
            <div class="mission-card">
              <div class="card-icon">
                <span class="special-letter">{{ slide.letter }}</span>
              </div>
              <h3 class="sp-card-title">{{ slide.title }}</h3>
              <ul class="card-features">
                <li v-for="(feature, featureIndex) in slide.features"
                    :key="featureIndex"
                    v-html="feature"></li>
              </ul>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>

      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
      <div class="container">
        <div class="section-header">
          <h2 >How much? / хау мач? /</h2>
          <p>Какая стоимость?</p>
        </div>
        <div class="services-grid">
          <div class="service-card-wrapper">
            <div class="service-card">
              <div class="service-content">
                <div class="service-header">
                  <h3>Agent Zero 0 <br> <span class="special-font yellow-gradient-text">в разведку !</span></h3>
                  <div class="price yellow-gradient-text">₽ 0000/урок</div>
                </div>
                <ul class="service-features">
                  <li><i class="fas fa-check"></i> Знакомство</li>
                  <li><i class="fas fa-check"></i> Определение уровня</li>
                  <li><i class="fas fa-check"></i> Без навязываний</li>
                  <li><i class="fas fa-check"></i> Без обязательств </li>
                  <li><i class="fas fa-check"></i> 1 на 1 урок с Винсентом </li>
                </ul>
              </div>

            </div>
            <div class="service-action">
              <button class="btn-primary">Начну с этого</button>
            </div>
          </div>
          <div class="service-card featured">
            <div class="service-header">
              <h3>Agent One 1 <br> <span class="special-font yellow-gradient-text"> волк одиночка</span></h3>
              <div class="price highlight-gradient-text">₽ 3500/урок</div>
            </div>
            <ul class="service-features">
              <li><i class="fas fa-check"></i> Индивидуальный план занятий</li>
              <li><i class="fas fa-check"></i> Гибкий график</li>
              <li><i class="fas fa-check"></i> Зачёт каждые 8 занятий </li>
              <li><i class="fas fa-check"></i> 1 на 1 уроки с Винсентом </li>
              <li><i class="fas fa-check"></i> Можно с выключенной камерой </li>

            </ul>
            <button class="btn-primary">Записаться</button>
          </div>
          <div class="service-card featured">
            <div class="service-badge">Популярно</div>
            <div class="service-header">
              <h3>Agent Two 02 <br> <span class="special-font yellow-gradient-text">плечом к плечу</span> </h3>
              <div class="price yellow-gradient-text">₽ 1500/урок</div>
            </div>
            <ul class="service-features">
              <li><i class="fas fa-check"></i> Интенсив</li>
              <li><i class="fas fa-check"></i> Поддержка напарников</li>
              <li><i class="fas fa-check"></i> Здоровая конкуренция</li>
              <li><i class="fas fa-check"></i> Командная работа 2 - 4 детектива</li>
            </ul>
            <button class="btn-primary">Попробовать</button>
          </div>
          <div class="service-card extended">
            <div class="service-header">
              <h3>Secret Missions <br> остальные услуги</h3>
              <div class="price">от ₽ 2000</div>
            </div>
            <ul class="service-features">
              <li><i class="fas fa-check"></i> Синхронный перевод</li>
              <li><i class="fas fa-check"></i> Сдача экзаменов</li>
              <li><i class="fas fa-check"></i> Перевод статей, книг, </li>
              <li><i class="fas fa-check"></i> программ мероприятий,</li>
              <li><i class="fas fa-check"></i> тех. документации, сайтов,</li>
              <li><i class="fas fa-check"></i> видео и аудио курсов</li>
              <li><i class="fas fa-check"></i> текстов ведущих, и другое</li>
            </ul>
            <button class="btn-primary">Выбрать</button>
          </div>
          <div class="service-card">
            <div class="service-header">
              <h3>Special Tours <br> <span class="special-font yellow-gradient-text">путешествия</span> </h3>
              <div class="price yellow-gradient-text"> от ₽ 55000</div>
            </div>
            <ul class="service-features">
              <li><i class="fas fa-check"></i> North America</li>
              <li><i class="fas fa-check"></i> South Korea</li>
              <li><i class="fas fa-check"></i> Western Europe</li>
              <li><i class="fas fa-check"></i> Far East</li>
              <li><i class="fas fa-check"></i> Tours</li>

            </ul>
            <button class="btn-primary">Погнали вместе!</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Cases Section -->
    <section id="cases" class="cases">
      <div class="container">
        <div class="section-header special-font">
          <h2 class="section-header special-font"> Успешные Кейсы</h2>
          <p>от детективов - студентов</p>
        </div>
        <div class="cases-grid">
          <div class="case-card">
            <div class="case-image">
              <i class="fas fa-user-graduate"></i>
            </div>
            <div class="case-content">
              <h3>Анна, 25 лет</h3>
              <p>"За 6 месяцев с нуля до B2. Теперь работаю в международной компании!"</p>
              <div class="case-result">
                <span class="result-badge">A0 → B2</span>
              </div>
            </div>
          </div>
          <div class="case-card">
            <div class="case-image">
              <i class="fas fa-user-tie"></i>
            </div>
            <div class="case-content">
              <h3>Михаил, 32 года</h3>
              <p>"Подготовился к собеседованию за 2 недели. Получил оффер в Google!"</p>
              <div class="case-result">
                <span class="result-badge">Job Offer</span>
              </div>
            </div>
          </div>
          <div class="case-card">
            <div class="case-image">
              <i class="fas fa-user-graduate"></i>
            </div>
            <div class="case-content">
              <h3>Елена, 19 лет</h3>
              <p>"Сдала IELTS на 8.0. Поступила в университет в Лондоне!"</p>
              <div class="case-result">
                <span class="result-badge">IELTS 8.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <p>Присоединяйтесь к команде детективов и раскройте все тайны английского языка</p>
          <div class="cta-buttons">
            <button class="btn-secondary btn-large special-font">
              <i class="fas fa-calculator"></i>
начать расследование            </button>
            <div class="section-header">

            </div>
            <div class="contact-content">
              <div class="contact-form">
                <form>
                  <div class="form-group">
                    <input type="text" id="name" name="name" placeholder="Имя (можно никнейм)" required>
                  </div>
                  <div class="form-group">
                    <input type="email" id="email" name="email" placeholder="Email" required>
                  </div>
                  <div class="form-group">
                    <input type="tel" id="phone" name="phone" placeholder="Телефон" required>
                  </div>
                  <div class="form-group">
                    <select id="service" name="service" required>
                      <option value="">Выберите формат обучения</option>
                      <option value="individual">Индивидуальные занятия</option>
                      <option value="group">Групповые занятия</option>
                      <option value="express">Экспресс-курс</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <textarea id="message" name="message" placeholder="Здесь можно написать о ваших целях и планах по изучению английского (можно ин Russian language или ин English лангуаге ;)" rows="4"></textarea>
                  </div>
                  <button class="btn-mission btn-large special-font">
                    <i class="fas fa-calculator"></i>
                    отправить заявку
                  </button>
                </form>

              </div>

              </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="container">

        <div class="contact-content">
          <div class="contact-form">

          </div>
          <div class="contact-info">
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="info-content">
                <h3>Телефон</h3>
                <p>+7 (999) 123-45-67</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <h3>Email</h3>
                <p>detective@english-agency.ru</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="info-content">
                <h3>Рабочие часы</h3>
                <p>Пн-Вс: 9:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <i class="fas fa-magnifying-glass"></i>
            <span>S.P.E.C.i.A.L. &nbsp; <span class="yellow-gradient-text">#vismyfriend</span> &nbsp; @vismyfriend</span>
          </div>
          <div class="footer-links">
            <a href="#mission">О нас</a>
            <a href="#services">Услуги</a>
            <a href="#cases">Отзывы</a>
            <a href="#contact">Контакты</a>
          </div>
          <div class="footer-social">
            <a href="#"><i class="fab fa-telegram"></i></a>
            <a href="#"><i class="fab fa-whatsapp"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 English Detective Agency. Все права защищены.</p>
        </div>
      </div>
    </footer>

    <!-- Mission Modal -->
    <div id="missionModal" ref="missionModal" class="mission-modal">
      <div class="mission-content">
        <div class="mission-header">
          <h2><i class="fas fa-search"></i> Миссия: Восстановить предложение</h2>
          <button class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="mission-body">
          <p class="mission-description">
            🕵️‍♂️ <strong>Детектив!</strong> Слова в предложении перепутаны.
            Перетащи их в правильном порядке, чтобы восстановить предложение.
          </p>

          <div class="sentence-container">
            <h3>Восстановите предложение:</h3>
            <div class="sentence-target">
              <div class="drop-zone" data-word="My"></div>
              <div class="drop-zone" data-word="name"></div>
              <div class="drop-zone" data-word="is"></div>
              <div class="drop-zone" data-word="Vincent"></div>
              <div class="drop-zone" data-word="and"></div>
              <div class="drop-zone" data-word="I"></div>
              <div class="drop-zone" data-word="am"></div>
              <div class="drop-zone" data-word="a"></div>
              <div class="drop-zone" data-word="detective"></div>
            </div>
          </div>

          <div class="words-container">
            <h3>Перетащите слова:</h3>
            <div class="words-source">
              <div class="word-item" draggable="true" data-word="My">My</div>
              <div class="word-item" draggable="true" data-word="name">name</div>
              <div class="word-item" draggable="true" data-word="is">is</div>
              <div class="word-item" draggable="true" data-word="Vincent">Vincent</div>
              <div class="word-item" draggable="true" data-word="and">and</div>
              <div class="word-item" draggable="true" data-word="I">I</div>
              <div class="word-item" draggable="true" data-word="am">am</div>
              <div class="word-item" draggable="true" data-word="a">a</div>
              <div class="word-item" draggable="true" data-word="detective">detective</div>
            </div>
          </div>

          <div class="mission-actions">
            <button class="btn-secondary">
              <i class="fas fa-random"></i>
              Перемешать слова
            </button>
            <button class="btn-primary">
              <i class="fas fa-check"></i>
              Проверить ответ
            </button>
          </div>

          <div class="mission-result" style="display: none;">
            <div class="result-content">
              <div class="result-icon">
                <i class="fas fa-trophy"></i>
              </div>
              <h3>Отлично, детектив!</h3>
              <p>Вы успешно восстановили предложение! Готовы к настоящему расследованию?</p>
              <button class="btn-primary">
                <i class="fas fa-play"></i>
                Начать обучение
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';



import gifMissionIsPossible from '/src/assets/images/gifs/missionIsPossible.gif';
import gifDoYouUnderstand from '/src/assets/images/gifs/doYouUnderstand.gif';
import gifWhatIsUp1 from '/src/assets/images/gifs/whatIsUp1.gif';
import gifMatrixPills2 from '/src/assets/images/gifs/MatrixPills.gif';

const gifs = ref({
  matrixPills2: gifMatrixPills2,
  missionIsPossible: gifMissionIsPossible,
  doYouUnderstand: gifDoYouUnderstand,
  whatIsUp1: gifWhatIsUp1,
});


// Smooth scrolling functions

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};


// Navbar scroll effect
const navbar = ref(null);
const handleScroll = () => {
  if (window.scrollY > 100) {
    navbar.value.style.background = 'rgba(0, 0, 0, 0.98)';
    navbar.value.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.value.style.background = 'rgba(0, 0, 0, 0.95)';
    navbar.value.style.boxShadow = 'none';
  }
};

// Scroll animations
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.mission-card, .service-card, .case-card, .info-card');
  animateElements.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
};

// slider vue 3


import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const carouselSlides = ref([
  {
    letter: 'S',
    title: 'Study to speak',
    features: [
      '<i class="fas fa-brain"></i> <strong>Учимся</strong> чтобы <strong>говорить</strong>',
      '<i class="fas fa-fire"></i>Убираем<strong> синдром собаки</strong> - когда всё понимаю 🐶 но не говорю...',
      '<i class="fas fa-user-cog"></i> <strong>не видео-курс</strong> не чат-бот, <strong>не ИИ</strong> <br>реальное общение с человеком',
      '<i class="fas fa-user-cog"></i> * на урок можно с питомцами'
    ]
  },
  {
    letter: 'P',
    title: 'Practice \n /прЭктис/',
    features: [
      '<i class="fas fa-comments"></i> <strong>Практика</strong> - двигатель прогресса.',
      '<i class="fas fa-comments"></i> Разговорные тренинги, <br>ставим произношение',
      '<i class="fas fa-fire"></i> Без учебников и только персонализированные актуальные материалы'
    ]
  },
  {
    letter: 'E',
    title: 'Exams',
    features: [
      '<i class="fas fa-clock"></i> Подготовка к экзаменам, <strong>собеседованиям</strong>, тестам, релокации, созвонам, публичным выступлениям, митам, помощь в написании статей, переводах, документации, профессиональный технический английский, IT - сфера'
    ]
  },
  {
    letter: 'C',
    title: 'Culture \n /\u00A0ˈkʌltʃər /',
    features: [
      '<i class="fas fa-plane"></i> Путешествия в разные страны.',
      '<i class="fas fa-plane"></i> <strong>Mission is possible.</strong>',
      '<i class="fas fa-tv"></i> Анализ мемов, сериалов, песен, фильмов, книг, журналов, трендов соцсетей и технологий',
      '<i class="fas fa-tv"></i> Изучение через<strong> культуру</strong> англоязычных стран'
    ]
  },
  {
    letter: 'I',
    title: 'Immersion \n /имЁршн/',
    features: [
      '<i class="fas fa-pen-fancy"></i> Постепенное <strong>погружение</strong> в атмосферу английского, чтобы он органично стал вторым разговорным языком в вашей копилке навыков',
      '<i class="fas fa-hand-holding-usd"></i>'
    ]
  },
  {
    letter: 'A',
    title: 'Apps and Ai',
    features: [
      '<i class="fas fa-trophy"></i> Artificial Intelligence',
      '<i class="fas fa-trophy"></i> <strong>Своё приложение </strong>и уникальная <strong>платформа </strong> для тренировки памяти + <strong>электронная тетрадь</strong>',
      '<i class="fas fa-users"></i> Учимся взаимодействию с Искуственным Интеллектом и нейронными сетями для любых целей помимо изучения английского'
    ]
  },
  {
    letter: 'L',
    title: 'Luck',
    features: [
      '<i class="fas fa-magic"></i> Чит-фразы ответы для любых экзаменов и реальных жизненных ситуаций.',
      '<i class="fas fa-user-secret"></i> <strong>Как говорить уверенно </strong>, даже если знаешь мало слов.',
      '<i class="fas fa-user-secret"></i> Методы спецслужб для запоминания слов (мнемоника из CIA, ментальные карты, ассоциативное мышление)'
    ]
  }
]);

const carouselConfig = {
  height: 500,
  // itemsToShow: 3,
  wrapAround: false,
  snapAlign: 'center',
  transition: 500,
  breakpoints: {
    // 300px and up
    300: {
      itemsToShow: 1,
      snapAlign: 'center',
    },
    // 400px and up
    768: {
      itemsToShow: 3,
      snapAlign: 'start',
    },

  },
};



// Slider logic









const currentSlide = ref(0);
// Добавляем переменные для обработки свайпа
const touchStartX = ref(0);
const touchEndX = ref(0);
const sliderTrack = ref(null);
const isDragging = ref(false);
const startPosX = ref(0);
const currentTranslateX = ref(0);


// Добавьте эти переменные
const isMobileMenuOpen = ref(false);
const isMobile = ref(false);

// Методы для мобильного меню
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Проверка размера экрана
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 960;
};

// Обработчик изменения размера окна
const handleResize = () => {
  checkScreenSize();
  if (!isMobile.value) {
    closeMobileMenu();
  }
};


// Обработчики для мыши
const handleMouseDown = (e) => {
  isDragging.value = true;
  startPosX.value = e.clientX;
  sliderTrack.value.style.cursor = 'grabbing';
  sliderTrack.value.style.transition = 'none';
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;

  const currentX = e.clientX;
  const diff = currentX - startPosX.value;

  // Обновляем позицию трека
  const cards = document.querySelectorAll('.mission-card');
  const cardWidth = cards[0].offsetWidth + 30;
  const baseTranslate = -currentSlide.value * cardWidth * 1.5;

  sliderTrack.value.style.transform = `translateX(${baseTranslate + diff}px)`;
};

const handleMouseUp = (e) => {
  if (!isDragging.value) return;
  isDragging.value = false;
  sliderTrack.value.style.cursor = 'grab';
  sliderTrack.value.style.transition = 'transform 0.5s ease';

  const endX = e.clientX;
  const diff = startPosX.value - endX;

  // Определяем, был ли это свайп
  if (Math.abs(diff) > 50) {
    scrollSlider(diff > 0 ? 1 : -1);
  } else {
    // Возвращаем на текущий слайд
    goToSlide(currentSlide.value);
  }
};
// Обработчики touch-событий
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (!touchStartX.value || !touchEndX.value) return;

  const diff = touchStartX.value - touchEndX.value;

  // Определяем направление свайпа
  if (diff > 50) {
    // Свайп влево - следующий слайд
    scrollSlider(1);
  } else if (diff < -50) {
    // Свайп вправо - предыдущий слайд
    scrollSlider(-1);
  }

  // Сбрасываем значения
  touchStartX.value = 0;
  touchEndX.value = 0;
};

// Обновленный scrollSlider
const scrollSlider = (direction) => {
  const cards = document.querySelectorAll('.mission-card');
  if (!cards.length || !sliderTrack.value) return;

  const cardWidth = cards[0].offsetWidth + 30;
  const newSlide = currentSlide.value + direction;

  // Проверяем границы
  if (newSlide < 0 || newSlide >= cards.length) return;

  currentSlide.value = newSlide;
  sliderTrack.value.style.transform = `translateX(-${currentSlide.value * cardWidth * 1.5}px)`;
};

const goToSlide = (index) => {
  const cards = document.querySelectorAll('.mission-card');
  if (!cards.length || !sliderTrack.value) return;

  const cardWidth = cards[0].offsetWidth + 30;
  currentSlide.value = index;
  sliderTrack.value.style.transform = `translateX(-${currentSlide.value * cardWidth * 1.5}px)`;
};



// Counter animation
const animateCounter = (element) => {
  const target = parseInt(element.textContent.replace(/\D/g, ''));
  const suffix = element.textContent.replace(/\d/g, '');
  let current = 0;
  const increment = target / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 30);
};

const initCounterAnimations = () => {
  const stats = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));
};

// Form handling
const handleFormSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
  submitBtn.disabled = true;

  setTimeout(() => {
    alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.');
    e.target.reset();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
};

// Service selection
const selectService = (service) => {
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    serviceSelect.value = service;
  }
};

// Pricing calculator
const showPricing = () => {
  const pricing = {
    individual: { price: 2000, lessons: 1 },
    group: { price: 1200, lessons: 1 },
    express: { price: 15000, lessons: 20 }
  };

  const service = prompt('Выберите формат обучения:\n1. Индивидуальные занятия\n2. Групповые занятия\n3. Экспресс-курс');

  if (service) {
    let selectedService;
    switch(service) {
      case '1':
        selectedService = 'individual';
        break;
      case '2':
        selectedService = 'group';
        break;
      case '3':
        selectedService = 'express';
        break;
      default:
        alert('Пожалуйста, выберите корректный вариант');
        return;
    }

    const lessons = prompt('Сколько уроков вы планируете взять?');
    if (lessons && !isNaN(lessons)) {
      const total = pricing[selectedService].price * parseInt(lessons);
      alert(`Стоимость ${lessons} уроков: ${total.toLocaleString()} ₽`);
    }
  }
};

// Parallax effect
const initParallax = () => {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
};

// Typing effect
const initTypingEffect = () => {
  const heroTitle = document.querySelector('.hero-title .highlight');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    setTimeout(typeWriter, 1000);
  }
};

// Floating animation for detective card
const initFloatingAnimation = () => {
  const detectiveCard = document.querySelector('.detective-card');
  if (detectiveCard) {
    let floatDirection = 1;
    let floatOffset = 0;

    function floatAnimation() {
      floatOffset += 0.02 * floatDirection;
      if (floatOffset > 1) floatDirection = -1;
      if (floatOffset < -1) floatDirection = 1;

      detectiveCard.style.transform = `translateY(${Math.sin(floatOffset) * 20}px)`;
      requestAnimationFrame(floatAnimation);
    }

    floatAnimation();
  }
};

// Particle effect
const createParticles = () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(102, 126, 234, 0.6);
      border-radius: 50%;
      pointer-events: none;
      animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `;
    hero.appendChild(particle);
  }
};

// Mission functionality
const missionModal = ref(null);
const draggedElement = ref(null);
const currentDropZone = ref(null);

const startMission = () => {
  missionModal.value.classList.add('active');
  document.body.style.overflow = 'hidden';
  initializeDragAndDrop();
  shuffleWords();
};

const closeMission = () => {
  missionModal.value.classList.remove('active');
  document.body.style.overflow = 'auto';
  resetMission();
};

const initializeDragAndDrop = () => {
  const wordItems = document.querySelectorAll('.word-item');
  const dropZones = document.querySelectorAll('.drop-zone');

  wordItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);
  });
};

const handleDragStart = (e) => {
  draggedElement.value = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.outerHTML);
};

const handleDragEnd = (e) => {
  e.target.classList.remove('dragging');
  draggedElement.value = null;
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

const handleDragEnter = (e) => {
  e.preventDefault();
  e.target.classList.add('drag-over');
  currentDropZone.value = e.target;
};

const handleDragLeave = (e) => {
  e.target.classList.remove('drag-over');
  currentDropZone.value = null;
};

const handleDrop = (e) => {
  e.preventDefault();
  e.target.classList.remove('drag-over');

  if (draggedElement.value && !e.target.hasChildNodes()) {
    const clonedElement = draggedElement.value.cloneNode(true);
    clonedElement.classList.remove('dragging');
    clonedElement.draggable = false;

    clonedElement.addEventListener('click', function() {
      this.remove();
      this.classList.remove('filled');
    });

    e.target.appendChild(clonedElement);
    e.target.classList.add('filled');
    draggedElement.value.remove();
  }
};

const shuffleWords = () => {
  const wordsSource = document.getElementById('wordsSource');
  const words = Array.from(wordsSource.children);

  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.innerHTML = '';
    zone.classList.remove('filled');
  });

  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    wordsSource.appendChild(words[j]);
  }

  document.getElementById('missionResult').style.display = 'none';
  initializeDragAndDrop();
};

const checkAnswer = () => {
  const dropZones = document.querySelectorAll('.drop-zone');
  const correctOrder = ['My', 'name', 'is', 'Vincent', 'and', 'I', 'am', 'a', 'detective'];
  let isCorrect = true;

  dropZones.forEach((zone, index) => {
    const wordElement = zone.querySelector('.word-item');
    if (!wordElement || wordElement.textContent !== correctOrder[index]) {
      isCorrect = false;
    }
  });

  if (isCorrect) {
    showSuccessResult();
  } else {
    showErrorResult();
  }
};

const showSuccessResult = () => {
  const result = document.getElementById('missionResult');
  result.style.display = 'block';

  const dropZones = document.querySelectorAll('.drop-zone.filled');
  dropZones.forEach((zone, index) => {
    setTimeout(() => {
      zone.style.animation = 'celebrate 0.3s ease';
      setTimeout(() => {
        zone.style.animation = '';
      }, 300);
    }, index * 100);
  });
};

const showErrorResult = () => {
  const dropZones = document.querySelectorAll('.drop-zone');
  dropZones.forEach(zone => {
    zone.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      zone.style.animation = '';
    }, 500);
  });

  alert('❌ Неправильно! Попробуйте еще раз. Подсказка: "My name is Vincent and I am a detective"');
};

const resetMission = () => {
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.innerHTML = '';
    zone.classList.remove('filled');
  });

  const wordsSource = document.getElementById('wordsSource');
  wordsSource.innerHTML = `
    <div class="word-item" draggable="true" data-word="My">My</div>
    <div class="word-item" draggable="true" data-word="name">name</div>
    <div class="word-item" draggable="true" data-word="is">is</div>
    <div class="word-item" draggable="true" data-word="Vincent">Vincent</div>
    <div class="word-item" draggable="true" data-word="and">and</div>
    <div class="word-item" draggable="true" data-word="I">I</div>
    <div class="word-item" draggable="true" data-word="am">am</div>
    <div class="word-item" draggable="true" data-word="a">a</div>
    <div class="word-item" draggable="true" data-word="detective">detective</div>
  `;

  document.getElementById('missionResult').style.display = 'none';
  shuffleWords();
};
const addParticleStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-particle {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
};
// Initialize everything when component mounts
onMounted(() => {
  addParticleStyles();
  createParticles();
  // Set navbar ref
  navbar.value = document.querySelector('.navbar');

  // Initialize all effects
  // window.addEventListener('scroll', handleScroll);
  initScrollAnimations();
  initCounterAnimations();
  initParallax();
  initTypingEffect();
  initFloatingAnimation();
  createParticles();

  checkScreenSize();
  window.addEventListener('resize', handleResize);

  // Add form handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }

  // Add mission modal ref
  missionModal.value = document.getElementById('missionModal');

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target === missionModal.value) {
      closeMission();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && missionModal.value.classList.contains('active')) {
      closeMission();
    }
  });

  // Add loading animation
  document.body.classList.add('loaded');
  goToSlide(currentSlide.value);

});

// Clean up when component unmounts
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);

  window.removeEventListener('resize', handleResize);
  // Remove other event listeners if needed
});
</script>





<style scoped lang="scss">
/* Reset and Base Styles */


body {
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  line-height: 1.2;
}
.sp-card-title {
  font-size: 25px;
  line-height: 25px;


}
/* Buttons */
.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.btn-secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-mission {
  background: linear-gradient(135deg, #ecf162 0%, #ee5a24 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  border-radius: 45px;
  line-height: 18px;
  margin-top: 10px;
}

.btn-mission:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
}

.btn-large {
  padding: 16px 32px;
  font-size: 18px;
}

/* Navigation */
.navbar {
  //position: fixed;
  top: 0;
  left: 0;
  right: 0;
  //background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 15px 0;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  //color: white;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 18px;
}

.nav-logo i {
  color: #667eea;
  font-size: 20px;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-menu a {
  //color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-menu a:hover {
  color: #667eea;
}

/* Hero Section */
.hero {
  min-height: 85vh;
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  margin: 1px 10px 10px;
  border-radius: 50px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23667eea" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  color: white;
  margin-bottom: 20px;
  line-height: 1.1;
}

.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: Special_f1;
  font-size: 60px;

}
.special-font {
  font-family: 'Special_f1';
}
.hero-subtitle {
  font-size: 1.2rem;
  color: #b0b0b0;
  margin-bottom: 40px;
  line-height: 20px;
  max-width: 450px;

}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: 'Orbitron', monospace;
  font-size: 2rem;
  font-weight: 900;
  color: #667eea;
  line-height: 29px;
}

.stat-label {
  font-size: 0.9rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  position: relative;
}

.gif-container {
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detective-gif {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
}

.detective-gif:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.6);
}

.detective-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  text-align: center;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  color: #667eea;
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  font-size: 20px;
  line-height: 20px;

}

.card-header i {
  font-size: 24px;

}

.card-content p {
  color: #b0b0b0;
  font-style: italic;
  font-size: 1.1rem;
  line-height: 20px;
}

/* Mission Slider Styles */
/* Mission Section - обновленные стили */
.mission {
  padding: 80px 0;
  background: linear-gradient(135deg, #f5f9ff 0%, #e6f0ff 100%);
}

.section-header h2 {
  color: #2c3e50;
  font-size: 3rem;
  margin-bottom: 10px;
}

.section-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 20px;
  line-height: 20px;

}

/* Контейнер слайдера с эффектом затухания */
.mission-slider-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  mask-image: linear-gradient(
      90deg,
      transparent 0%,
      white 10%,
      white 90%,
      transparent 100%
  );

}

.mission-slider {
  overflow: visible; /* Изменено с hidden на visible */
  margin: 0 -15px;
}


/* Эффект затухания по краям */
.mission-slider-container::before,
.mission-slider-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.mission-slider-container::before {
  left: 0;
  background: linear-gradient(90deg, #f5f9ff 0%, rgba(245, 249, 255, 0) 100%);
}

.mission-slider-container::after {
  right: 0;
  background: linear-gradient(270deg, #f5f9ff 0%, rgba(245, 249, 255, 0) 100%);
}

.mission-slider {
  //overflow: visible;
  touch-action: pan-y;
  user-select: none;
  margin: 0 -15px;
  position: relative;
}

.slider-track {
  //display: flex;
  transition: transform 0.5s ease;
  padding: 20px 0;
  will-change: transform;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
/* Карточки */
.mission-card {
  flex: 0 0 calc(100% / 3 - 30px);
  margin: 0 15px;
  padding: 15px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(100, 149, 237, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(100, 149, 237, 0.1);
  backdrop-filter: blur(2px);
  width: 270px;
  height: 400px;

}

.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(100, 149, 237, 0.15);
}

.special-letter {
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Orbitron', cursive;
  color: white;
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
  border-radius: 50%;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(161, 196, 253, 0.3);
  text-align: center;
}

.card-features {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.card-features li {
  margin-bottom: 12px;
  padding-left: 15px;
  position: relative;
  text-align: left;
  color: #5a6a7e;
  line-height: 1.5;
}

.card-features i {
  position: absolute;
  left: 0;
  top: 3px;
  color: #a1c4fd;
  font-size: 18px;
}

/* Стрелки */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #000000;
  border: none;
  color: #a1c4fd;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(100, 149, 237, 0.2);


}

.slider-arrow:hover {
  background: #a1c4fd;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.slider-arrow-left {
  left: 10px;
}

.slider-arrow-right {
  right: 10px;
}

/* Точки навигации */
.slider-dots {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 8px;
}

.slider-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d1e0ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dots span.active {
  background: #a1c4fd;
  transform: scale(1.3);
}

/* Адаптивность */
@media (max-width: 992px) {
  .mission-card {
    flex: 0 0 calc(100% / 2 - 30px);
  }

  .mission-slider-container {
    padding: 0 40px;
  }
}

@media (max-width: 768px) {
  .mission-card {
    flex: 0 0 calc(100% - 30px);
  }

  .mission-slider-container::before,
  .mission-slider-container::after {
    width: 50px;
  }

  .slider-arrow {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  .gif-container {
    max-width: 250px;
  }

  .detective-gif {
    max-width: 80%;
  }
}


/* Services Section */
.services {
  padding: 50px 0;
  background: white;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.service-card-wrapper {
  display: flex;
}
.service-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.service-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.1);
}

.service-card.featured {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  transform: scale(1.05);
}


.service-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ecf162 0%, #ee5a24 100%);
  color: white;
  border: solid;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
}

.service-header {
  margin-bottom: 30px;
}

.service-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
}

.price {
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  font-weight: 900;
  color: #667eea;
}

.service-features {
  list-style: none;
  margin-bottom: 30px;
}

.service-features li {
  padding: 10px 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
}

.service-features i {
  color: #667eea;
  font-size: 14px;
}

@media (max-width: 480px) {
  .mission-slider-container {
    padding: 0 20px;
  }

  .mission-slider-container::before,
  .mission-slider-container::after {
    width: 30px;
  }

  .service-features li {
    padding: 1px 0;
  }
  .service-badge {
    top: 90%;
  }
  .service-card.extended {
    height: 280px
  }
  .service-features {
    margin-bottom: 10px;
    padding: 0;
  }
  .btn-primary {
    margin-bottom: 10px;
    //left: 58%;
    //bottom: 38%;
  }

  .special-letter {
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
  }

  .service-header {
    margin-bottom: 10px;
  }
  .service-header h3{
    margin-bottom: 0;
    font-size: 20px;
  }
}
/* Cases Section */
.cases {
  padding: 50px 0;
  background: #f8f9fa;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.case-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.case-card:hover {
  transform: translateY(-5px);
}

.case-image {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.case-image i {
  font-size: 32px;
  color: white;
}

.case-content h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
}

.case-content p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.result-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 700;
}

/* CTA Section */
.cta-section {
  padding: 50px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-buttons .btn-secondary {
  border-color: white;
  color: white;
}

.cta-buttons .btn-secondary:hover {
  background: white;
  color: #667eea;
}

/* Contact Section */
.contact {
  padding: 100px 0;
  background: white;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.contact-form {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
}

.info-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon i {
  font-size: 24px;
  color: white;
}

.info-content h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 5px;
}

.info-content p {
  color: #666;
}

/* Footer */
.footer {
  background: #1a1a2e;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 18px;
}

.footer-logo i {
  color: #667eea;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.footer-links a {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

.footer-social {
  display: flex;
  gap: 15px;
}

.footer-social a {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-social a:hover {
  background: #667eea;
  transform: translateY(-2px);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
    margin-top: 20px;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-buttons {
    justify-content: center;
  }

  .nav-menu {
    display: none;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }



  .section-header h2 {
    font-size: 3rem;
    line-height: 38px;
  }

  .services-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }

  .service-card {

    padding: 5px 5px;
    width: 255px;
    height: 220px;


  }
  .price {
    font-size: 20px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mission-card,
.service-card,
.case-card {
  animation: fadeInUp 0.6s ease forwards;
}

/* Scroll animations */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.scroll-animate.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Mission Modal Styles */
.mission-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.mission-modal.active {
  display: flex;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.mission-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mission-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mission-header h2 {
  margin: 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.mission-body {
  padding: 40px;
}

.mission-description {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 30px;
  font-size: 1.1rem;
  line-height: 1.6;
  border-left: 4px solid #667eea;
}

.sentence-container {
  margin-bottom: 30px;
}

.sentence-container h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.sentence-target {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 60px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 2px dashed #ddd;
}

.drop-zone {
  min-width: 80px;
  height: 50px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  position: relative;
}

.drop-zone.drag-over {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.drop-zone.filled {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.words-container {
  margin-bottom: 30px;
}

.words-container h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.words-source {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  min-height: 80px;
}

.word-item {
  padding: 12px 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: grab;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.word-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.word-item:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.word-item.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.mission-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.mission-result {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  animation: celebrate 0.6s ease;
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.result-content h3 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.result-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

/* Responsive design for modal */
@media (max-width: 768px) {
  .mission-content {
    margin: 10px;
    max-height: 95vh;
  }

  .mission-body {
    padding: 20px;
  }

  .mission-header {
    padding: 20px;
  }

  .mission-header h2 {
    font-size: 1.4rem;
  }

  .sentence-target {
    gap: 8px;
  }

  .drop-zone {
    min-width: 60px;
    height: 40px;
    font-size: 0.9rem;
  }

  .word-item {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .mission-actions {
    flex-direction: column;
  }
}

.white-text {
  color: white;
}

.gray-text {
  color: #b0b0b0;
}
.yellow-gradient-text {
  background: linear-gradient(135deg, #ecf162 0%, #ee5a24 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* Fallback для браузеров без поддержки */
  display: inline-block;}

.highlight-gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* Fallback для браузеров без поддержки */
  display: inline-block;}
/* Mobile Menu Styles */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;

  span {
    width: 25px;
    height: 3px;
    background: #667eea;
    margin: 2px 0;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  &.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  &.active span:nth-child(2) {
    opacity: 0;
  }

  &.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}

/* Адаптивность для навбара */
@media (max-width: 960px) {
  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transition: right 0.3s ease;
    z-index: 1000;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);

    &.active {
      right: 0;
    }

    a {
      color: #333 !important;
      font-size: 1.2rem;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 25px;
      transition: all 0.3s ease;

      &:hover {
        background: #667eea;
        color: white !important;
        transform: translateX(-5px);
      }
    }
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .nav-cta {
    display: none;
  }
.highlight {
  font-family: Special_f1;
  font-size: 38px;
}
  /* Overlay при открытом меню */
  .nav-menu.active::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    z-index: -1;
  }
}
//
///* Дополнительная адаптивность */
//@media (max-width: 768px) {
//  .nav-container {
//    padding: 0 15px;
//  }
//
//  .nav-logo {
//    font-size: 16px;
//
//    span {
//      display: none;
//    }
//  }
//
//  .nav-menu {
//    width: 100%;
//    max-width: none;
//
//    a {
//      font-size: 1.1rem;
//      padding: 15px 25px;
//    }
//  }
//}
//
//@media (max-width: 480px) {
//  .nav-logo {
//    i {
//      font-size: 24px;
//    }
//  }
//
//  .mobile-menu-toggle {
//    width: 25px;
//    height: 25px;
//
//    span {
//      width: 20px;
//      height: 2px;
//    }
//  }
//}



/* Стили для карусели */
.custom-carousel {
  margin: 40px 0;
}

.custom-carousel :deep(.carousel__viewport) {
  overflow: hidden;
}

.custom-carousel :deep(.carousel__track) {
  padding: 20px 0;
}

.custom-carousel :deep(.carousel__slide) {
  padding: 0 15px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  display: block;

}

.custom-carousel :deep(.carousel__slide--active) {
  opacity: 1;
}

.custom-carousel :deep(.carousel__prev),
.custom-carousel :deep(.carousel__next) {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #a1c4fd;
  color: #a1c4fd;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-carousel :deep(.carousel__prev):hover,
.custom-carousel :deep(.carousel__next):hover {
  background: #a1c4fd;
  color: white;
  //transform: scale(1.1);
}

.custom-carousel :deep(.carousel__pagination-button) {
  background: #d1e0ff;
  width: 12px;
  height: 12px;
  margin: 0 5px;
}

.custom-carousel :deep(.carousel__pagination-button--active) {
  background: #a1c4fd;
  transform: scale(1.3);
}
//
///* Адаптивность карусели */
//@media (max-width: 768px) {
//  .custom-carousel :deep(.carousel__prev),
//  .custom-carousel :deep(.carousel__next) {
//    width: 40px;
//    height: 40px;
//    font-size: 14px;
//  }
//
//  .custom-carousel :deep(.carousel__pagination) {
//    margin-top: 20px;
//  }
//}


.none {
  display: none;
}
.text-align-center {
  text-align: center;
}

/* Добавьте анимации для миссии */
@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Добавьте стили для загрузки */
body {
  opacity: 0;
  transition: opacity 0.5s ease;
}

body.loaded {
  opacity: 1;
}
</style>
