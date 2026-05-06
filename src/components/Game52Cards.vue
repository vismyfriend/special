<template>
  <div class="card-deck-container">
    <div class="deck-header">
      <h3>🎴 Hand = Combination of cards</h3>
      <p>For special agents only . DO NOT BLAME VINCENT !</p>
    </div>

    <!-- Отображение карт -->
    <div class="cards-display">
      <div class="cards-area" v-if="displayCards.length">
        <div
          v-for="(card, index) in displayCards"
          :key="index"
          class="card"
          :class="getCardSuitClass(card.suit)"
        >
          <div class="card-rank">{{ card.rank }}</div>
          <div class="card-suit">{{ getSuitSymbol(card.suit) }}</div>
        </div>
      </div>
      <div v-else class="empty-message">
        Нажимайте на любые из кнопок ниже, чтобы увидеть комбинации
      </div>
    </div>

    <!-- Кнопки управления (от слабой к сильной) -->
    <div class="controls">
      <button class="btn btn-primary" @click="getRandomCard">
        🃏 Any Card
      </button>
      <button class="btn btn-info" @click="getHighCard">
        High Card
      </button>
      <button class="btn btn-info" @click="getOnePair">
        A Pair
      </button>
      <button class="btn btn-info" @click="getTwoPair">
        2 Pairs
      </button>
      <button class="btn btn-secondary" @click="getStraight">
        Straight
      </button>
      <button class="btn btn-secondary" @click="getFlush">
        Flush
      </button>
      <button class="btn btn-warning" @click="getFullHouse">
        Full House
      </button>
      <button class="btn btn-success" @click="getFourOfAKind">
        Four of a Kind
      </button>
      <button class="btn btn-secondary" @click="getStraightFlush">
        Straight Flush
      </button>
      <button class="btn btn-danger" @click="getRoyalFlush">
        Royal Flush
      </button>
      <button class="btn btn-random" @click="getRandomCombination">
        🎲 Random
      </button>
      <button class="btn btn-quiz" @click="openQuiz">
        ❓ QUIZ: Who wins?
      </button>
    </div>

    <!-- Информация о текущей комбинации -->
    <div class="info" v-if="currentCombinationName">
      <strong>{{ currentCombinationName }}</strong>
    </div>

    <!-- Модальное окно Quiz -->
    <div v-if="showQuizModal" class="quiz-overlay" @click.self="closeQuiz">
      <div class="quiz-modal">
        <div class="quiz-header">
          <h3>❓ Who is winning? ❓</h3>
          <button class="close-btn" @click="closeQuiz">✖</button>
        </div>

        <div class="quiz-content">
          <!-- Player 1 -->
          <div
            class="player-hand"
            :class="{ 'winner-highlight': selectedWinner === 'player1' && showResult, 'loser-dim': selectedWinner === 'player2' && showResult }"
            @click="selectWinner('player1')"
          >
            <div class="player-label">👤 PLAYER 1</div>
            <div class="cards-area quiz-cards">
              <div
                v-for="(card, index) in quizHands.player1"
                :key="index"
                class="card quiz-card"
                :class="getCardSuitClass(card.suit)"
              >
                <div class="card-rank">{{ card.rank }}</div>
                <div class="card-suit">{{ getSuitSymbol(card.suit) }}</div>
              </div>
            </div>
<!--            <div class="combination-name">{{ quizHands.player1Name }}</div>-->
          </div>

          <!-- VS -->
          <div class="vs-div">⚔️ or ⚔️</div>

          <!-- Player 2 -->
          <div
            class="player-hand"
            :class="{ 'winner-highlight': selectedWinner === 'player2' && showResult, 'loser-dim': selectedWinner === 'player1' && showResult }"
            @click="selectWinner('player2')"
          >
            <div class="player-label">👤 PLAYER 2</div>
            <div class="cards-area quiz-cards">
              <div
                v-for="(card, index) in quizHands.player2"
                :key="index"
                class="card quiz-card"
                :class="getCardSuitClass(card.suit)"
              >
                <div class="card-rank">{{ card.rank }}</div>
                <div class="card-suit">{{ getSuitSymbol(card.suit) }}</div>
              </div>
            </div>
<!--            <div class="combination-name">{{ quizHands.player2Name }}</div>-->
          </div>
        </div>

<!--        <div class="quiz-question">-->
<!--          <p>🤔 Who is winning? Click on Player 1 or Player 2! 🤔</p>-->
<!--        </div>-->

        <div class="quiz-feedback" v-if="feedbackMessage">
          <div :class="feedbackClass" class="feedback-bubble">
            {{ feedbackMessage }}
          </div>
        </div>

        <div class="quiz-footer">
          <button class="btn-next" @click="nextQuiz">Next Question ➡</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Эмит для отправки данных родителю
const emit = defineEmits(['cardSelected', 'combinationSelected'])

// Текущая комбинация
const currentCombinationName = ref('')
const displayCards = ref([])

// Quiz state
const showQuizModal = ref(false)
const quizHands = ref({
  player1: [],
  player2: [],
  player1Name: '',
  player2Name: ''
})
const selectedWinner = ref(null)
const showResult = ref(false)
const feedbackMessage = ref('')
const feedbackClass = ref('')
let currentCorrectAnswer = null

// Масти
const suits = ['hearts', 'diamonds', 'clubs', 'spades']
const suitSymbols = {
  hearts: '♥️',
  diamonds: '♦️',
  clubs: '♣️',
  spades: '♠️'
}

// Ранги карт (для 52 карт)
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Порядок рангов для сравнения
const rankOrder = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11,
  '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
}

// Полная колода
const fullDeck = ref([])

// Веса комбинаций (для сравнения)
const combinationWeights = {
  'High Card': 1,
  'One Pair': 2,
  'Two Pair': 3,
  'Three of a Kind': 4,
  'Straight': 5,
  'Flush': 6,
  'Full House': 7,
  'Four of a Kind': 8,
  'Straight Flush': 9,
  'Royal Flush': 10
}

// Инициализация колоды
const initDeck = () => {
  const deck = []
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit })
    }
  }
  fullDeck.value = deck
}

// Получить символ масти
const getSuitSymbol = (suit) => {
  return suitSymbols[suit]
}

// Получить класс для масти (цвет)
const getCardSuitClass = (suit) => {
  return suit === 'hearts' || suit === 'diamonds' ? 'card-red' : 'card-black'
}

// Перемешать массив
const shuffle = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Получить случайную карту
const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * fullDeck.value.length)
  const card = fullDeck.value[randomIndex]
  displayCards.value = [card]

  const rankNames = {
    'A': 'Ace', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
    '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '10': 'Ten',
    'J': 'Jack', 'Q': 'Queen', 'K': 'King'
  }
  const suitNames = {
    'hearts': 'of Hearts', 'diamonds': 'of Diamonds',
    'clubs': 'of Clubs', 'spades': 'of Spades'
  }

  const cardName = `${rankNames[card.rank]} ${suitNames[card.suit]}`
  currentCombinationName.value = `Random Card (${cardName})`
  emit('cardSelected', displayCards.value[0])
}

// Получить флеш (5 карт одной масти)
const getFlush = () => {
  const randomSuit = suits[Math.floor(Math.random() * suits.length)]
  const cardsOfSuit = fullDeck.value.filter(card => card.suit === randomSuit)
  const shuffledCards = shuffle(cardsOfSuit)
  displayCards.value = shuffledCards.slice(0, 5)
  currentCombinationName.value = `Flush (${randomSuit} - 5 cards of same suit)`
  emit('combinationSelected', { type: 'flush', cards: displayCards.value })
}

// Получить стрит (5 карт по порядку)
const getStraight = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const startPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  const randomStart = startPositions[Math.floor(Math.random() * startPositions.length)]
  const straightRanks = rankList.slice(randomStart, randomStart + 5)

  if (straightRanks.length < 5) {
    const specialStraight = ['10', 'J', 'Q', 'K', 'A']
    const cards = []
    for (const rank of specialStraight) {
      const randomSuit = suits[Math.floor(Math.random() * suits.length)]
      cards.push({ rank, suit: randomSuit })
    }
    displayCards.value = cards
  } else {
    const cards = []
    for (const rank of straightRanks) {
      const randomSuit = suits[Math.floor(Math.random() * suits.length)]
      cards.push({ rank, suit: randomSuit })
    }
    displayCards.value = cards
  }

  currentCombinationName.value = 'Straight (5 cards in sequence)'
  emit('combinationSelected', { type: 'straight', cards: displayCards.value })
}

// Получить стрит-флеш (5 карт одной масти по порядку)
const getStraightFlush = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const startPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const randomStart = startPositions[Math.floor(Math.random() * startPositions.length)]
  const straightRanks = rankList.slice(randomStart, randomStart + 5)
  const randomSuit = suits[Math.floor(Math.random() * suits.length)]

  if (straightRanks.length < 5) {
    const specialStraight = ['10', 'J', 'Q', 'K', 'A']
    displayCards.value = specialStraight.map(rank => ({ rank, suit: randomSuit }))
  } else {
    displayCards.value = straightRanks.map(rank => ({ rank, suit: randomSuit }))
  }

  currentCombinationName.value = `Straight Flush (${randomSuit} - 5 cards in a row, with same suit)`
  emit('combinationSelected', { type: 'straightFlush', cards: displayCards.value })
}

// Получить роял-флеш (10, J, Q, K, A одной масти)
const getRoyalFlush = () => {
  const randomSuit = suits[Math.floor(Math.random() * suits.length)]
  const royalRanks = ['10', 'J', 'Q', 'K', 'A']
  displayCards.value = royalRanks.map(rank => ({ rank, suit: randomSuit }))
  currentCombinationName.value = `🔥 ROYAL FLUSH 🔥 (${randomSuit} - 10, J, Q, K, A)`
  emit('combinationSelected', { type: 'royalFlush', cards: displayCards.value })
}

// Получить фулл хаус (3 одной + 2 другой)
const getFullHouse = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const threeRank = shuffledRanks[0]
  const pairRank = shuffledRanks[1]

  const cards = []
  const suitsList = [...suits]

  for (let i = 0; i < 3; i++) {
    cards.push({ rank: threeRank, suit: suitsList[i % suitsList.length] })
  }

  for (let i = 0; i < 2; i++) {
    cards.push({ rank: pairRank, suit: suitsList[(i + 2) % suitsList.length] })
  }

  displayCards.value = shuffle(cards)
  currentCombinationName.value = `Full House (Three ${threeRank}s and two ${pairRank}s)`
  emit('combinationSelected', { type: 'fullHouse', cards: displayCards.value })
}

// Получить каре (4 одинаковых ранга)
const getFourOfAKind = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const randomRank = rankList[Math.floor(Math.random() * rankList.length)]
  const kickerRank = rankList.filter(r => r !== randomRank)[Math.floor(Math.random() * 12)]

  const cards = []

  for (let i = 0; i < 4; i++) {
    cards.push({ rank: randomRank, suit: suits[i] })
  }

  const randomSuit = suits[Math.floor(Math.random() * suits.length)]
  cards.push({ rank: kickerRank, suit: randomSuit })

  displayCards.value = shuffle(cards)
  currentCombinationName.value = `Four of a Kind (Four ${randomRank}s)`
  emit('combinationSelected', { type: 'fourOfAKind', cards: displayCards.value })
}

// Получить High Card (5 случайных карт без комбинации)
const getHighCard = () => {
  const shuffledDeck = shuffle(fullDeck.value)
  const randomCards = shuffledDeck.slice(0, 5)

  displayCards.value = randomCards

  const shortCards = randomCards.map(card => {
    const symbol = getSuitSymbol(card.suit)
    return `${card.rank}${symbol}`
  }).join(', ')

  currentCombinationName.value = `High Card (${shortCards})`
  emit('combinationSelected', { type: 'highCard', cards: displayCards.value })
}

// Получить пару (One Pair)
const getOnePair = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const pairRank = shuffledRanks[0]

  const otherRanks = shuffledRanks.filter(r => r !== pairRank).slice(0, 3)

  const cards = []
  const suitsList = [...suits]

  for (let i = 0; i < 2; i++) {
    cards.push({ rank: pairRank, suit: suitsList[i % suitsList.length] })
  }

  for (let i = 0; i < otherRanks.length; i++) {
    const randomSuit = suitsList[Math.floor(Math.random() * suitsList.length)]
    cards.push({ rank: otherRanks[i], suit: randomSuit })
  }

  displayCards.value = shuffle(cards)

  const shortCards = cards.map(card => {
    const symbol = getSuitSymbol(card.suit)
    return `${card.rank}${symbol}`
  }).join(', ')

  currentCombinationName.value = `One Pair (Pair of ${pairRank}s - ${shortCards})`
  emit('combinationSelected', { type: 'onePair', cards: displayCards.value })
}

// Получить две пары (Two Pair)
const getTwoPair = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const firstPairRank = shuffledRanks[0]
  const secondPairRank = shuffledRanks[1]
  const kickerRank = shuffledRanks[2]

  const cards = []
  const suitsList = [...suits]

  for (let i = 0; i < 2; i++) {
    cards.push({ rank: firstPairRank, suit: suitsList[i % suitsList.length] })
  }

  for (let i = 0; i < 2; i++) {
    cards.push({ rank: secondPairRank, suit: suitsList[(i + 2) % suitsList.length] })
  }

  const randomSuit = suitsList[Math.floor(Math.random() * suitsList.length)]
  cards.push({ rank: kickerRank, suit: randomSuit })

  displayCards.value = shuffle(cards)

  const shortCards = cards.map(card => {
    const symbol = getSuitSymbol(card.suit)
    return `${card.rank}${symbol}`
  }).join(', ')

  currentCombinationName.value = `Two Pair (${firstPairRank}s and ${secondPairRank}s - ${shortCards})`
  emit('combinationSelected', { type: 'twoPair', cards: displayCards.value })
}

// Получить случайную комбинацию (для текущего дисплея)
const getRandomHand = () => {
  const functions = [getHighCard, getOnePair, getTwoPair, getFlush, getStraight, getFullHouse, getFourOfAKind, getStraightFlush, getRoyalFlush]
  const randomFunc = functions[Math.floor(Math.random() * functions.length)]
  randomFunc()
}

// Генерация случайной руки для квиза
const generateRandomHand = () => {
  const functions = [getHighCardForQuiz, getOnePairForQuiz, getTwoPairForQuiz, getFlushForQuiz, getStraightForQuiz, getFullHouseForQuiz, getFourOfAKindForQuiz]
  const randomFunc = functions[Math.floor(Math.random() * functions.length)]
  return randomFunc()
}

// Функции для квиза (возвращают карты и название)
const getHighCardForQuiz = () => {
  const shuffledDeck = shuffle(fullDeck.value)
  const cards = shuffledDeck.slice(0, 5)
  return { cards, name: 'High Card' }
}

const getOnePairForQuiz = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const pairRank = shuffledRanks[0]
  const otherRanks = shuffledRanks.filter(r => r !== pairRank).slice(0, 3)
  const cards = []
  for (let i = 0; i < 2; i++) {
    cards.push({ rank: pairRank, suit: suits[i % suits.length] })
  }
  for (let i = 0; i < otherRanks.length; i++) {
    cards.push({ rank: otherRanks[i], suit: suits[Math.floor(Math.random() * suits.length)] })
  }
  return { cards: shuffle(cards), name: 'One Pair' }
}

const getTwoPairForQuiz = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const firstPairRank = shuffledRanks[0]
  const secondPairRank = shuffledRanks[1]
  const kickerRank = shuffledRanks[2]
  const cards = []
  for (let i = 0; i < 2; i++) cards.push({ rank: firstPairRank, suit: suits[i] })
  for (let i = 0; i < 2; i++) cards.push({ rank: secondPairRank, suit: suits[i + 2] })
  cards.push({ rank: kickerRank, suit: suits[Math.floor(Math.random() * suits.length)] })
  return { cards: shuffle(cards), name: 'Two Pair' }
}

const getFlushForQuiz = () => {
  const randomSuit = suits[Math.floor(Math.random() * suits.length)]
  const cardsOfSuit = fullDeck.value.filter(card => card.suit === randomSuit)
  const cards = shuffle(cardsOfSuit).slice(0, 5)
  return { cards, name: 'Flush' }
}

const getStraightForQuiz = () => {
  const rankList = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const startPos = Math.floor(Math.random() * 9)
  const straightRanks = rankList.slice(startPos, startPos + 5)
  const cards = straightRanks.map(rank => ({ rank, suit: suits[Math.floor(Math.random() * suits.length)] }))
  return { cards, name: 'Straight' }
}

const getFullHouseForQuiz = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const threeRank = shuffledRanks[0]
  const pairRank = shuffledRanks[1]
  const cards = []
  for (let i = 0; i < 3; i++) cards.push({ rank: threeRank, suit: suits[i] })
  for (let i = 0; i < 2; i++) cards.push({ rank: pairRank, suit: suits[i + 2] })
  return { cards: shuffle(cards), name: 'Full House' }
}

const getFourOfAKindForQuiz = () => {
  const rankList = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const shuffledRanks = shuffle(rankList)
  const fourRank = shuffledRanks[0]
  const kickerRank = shuffledRanks[1]
  const cards = []
  for (let i = 0; i < 4; i++) cards.push({ rank: fourRank, suit: suits[i] })
  cards.push({ rank: kickerRank, suit: suits[Math.floor(Math.random() * suits.length)] })
  return { cards: shuffle(cards), name: 'Four of a Kind' }
}

// Сравнение карт по старшинству (для High Card, Flush)
const compareHighCard = (cards1, cards2) => {
  const sorted1 = [...cards1].sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])
  const sorted2 = [...cards2].sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])

  for (let i = 0; i < Math.min(sorted1.length, sorted2.length); i++) {
    const rank1 = rankOrder[sorted1[i].rank]
    const rank2 = rankOrder[sorted2[i].rank]
    if (rank1 > rank2) return 'player1'
    if (rank2 > rank1) return 'player2'
  }
  return 'tie'
}

// Получить ранги карт
const getRanks = (cards) => {
  return cards.map(c => c.rank)
}

// Подсчитать частоту рангов
const getRankCounts = (cards) => {
  const counts = {}
  cards.forEach(card => {
    counts[card.rank] = (counts[card.rank] || 0) + 1
  })
  return counts
}

// Сравнение One Pair
const compareOnePair = (cards1, cards2) => {
  const counts1 = getRankCounts(cards1)
  const counts2 = getRankCounts(cards2)

  // Находим пару
  let pairRank1 = null, pairRank2 = null
  for (const [rank, count] of Object.entries(counts1)) {
    if (count === 2) pairRank1 = rank
  }
  for (const [rank, count] of Object.entries(counts2)) {
    if (count === 2) pairRank2 = rank
  }

  // Сравниваем пары
  if (rankOrder[pairRank1] > rankOrder[pairRank2]) return 'player1'
  if (rankOrder[pairRank2] > rankOrder[pairRank1]) return 'player2'

  // Если пары равны, сравниваем кикеры (остальные карты)
  const kickers1 = cards1.filter(c => c.rank !== pairRank1).sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])
  const kickers2 = cards2.filter(c => c.rank !== pairRank2).sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])

  for (let i = 0; i < Math.min(kickers1.length, kickers2.length); i++) {
    if (rankOrder[kickers1[i].rank] > rankOrder[kickers2[i].rank]) return 'player1'
    if (rankOrder[kickers2[i].rank] > rankOrder[kickers1[i].rank]) return 'player2'
  }
  return 'tie'
}

// Сравнение Two Pair
const compareTwoPair = (cards1, cards2) => {
  const counts1 = getRankCounts(cards1)
  const counts2 = getRankCounts(cards2)

  // Находим пары
  const pairs1 = Object.entries(counts1).filter(([_, count]) => count === 2).map(([rank, _]) => rank)
  const pairs2 = Object.entries(counts2).filter(([_, count]) => count === 2).map(([rank, _]) => rank)

  pairs1.sort((a, b) => rankOrder[b] - rankOrder[a])
  pairs2.sort((a, b) => rankOrder[b] - rankOrder[a])

  // Сравниваем старшую пару
  if (rankOrder[pairs1[0]] > rankOrder[pairs2[0]]) return 'player1'
  if (rankOrder[pairs2[0]] > rankOrder[pairs1[0]]) return 'player2'

  // Сравниваем младшую пару
  if (rankOrder[pairs1[1]] > rankOrder[pairs2[1]]) return 'player1'
  if (rankOrder[pairs2[1]] > rankOrder[pairs1[1]]) return 'player2'

  // Находим кикер
  const kicker1 = cards1.filter(c => c.rank !== pairs1[0] && c.rank !== pairs1[1])[0]
  const kicker2 = cards2.filter(c => c.rank !== pairs2[0] && c.rank !== pairs2[1])[0]

  if (rankOrder[kicker1.rank] > rankOrder[kicker2.rank]) return 'player1'
  if (rankOrder[kicker2.rank] > rankOrder[kicker1.rank]) return 'player2'
  return 'tie'
}

// Сравнение Four of a Kind
const compareFourOfAKind = (cards1, cards2) => {
  const counts1 = getRankCounts(cards1)
  const counts2 = getRankCounts(cards2)

  // Находим каре
  let fourRank1 = null, fourRank2 = null
  for (const [rank, count] of Object.entries(counts1)) {
    if (count === 4) fourRank1 = rank
  }
  for (const [rank, count] of Object.entries(counts2)) {
    if (count === 4) fourRank2 = rank
  }

  // Сравниваем каре
  if (rankOrder[fourRank1] > rankOrder[fourRank2]) return 'player1'
  if (rankOrder[fourRank2] > rankOrder[fourRank1]) return 'player2'

  // Сравниваем кикер
  const kicker1 = cards1.find(c => c.rank !== fourRank1)
  const kicker2 = cards2.find(c => c.rank !== fourRank2)

  if (rankOrder[kicker1.rank] > rankOrder[kicker2.rank]) return 'player1'
  if (rankOrder[kicker2.rank] > rankOrder[kicker1.rank]) return 'player2'
  return 'tie'
}

// Сравнение Full House
const compareFullHouse = (cards1, cards2) => {
  const counts1 = getRankCounts(cards1)
  const counts2 = getRankCounts(cards2)

  // Находим тройку и пару
  let threeRank1 = null, pairRank1 = null
  let threeRank2 = null, pairRank2 = null

  for (const [rank, count] of Object.entries(counts1)) {
    if (count === 3) threeRank1 = rank
    if (count === 2) pairRank1 = rank
  }
  for (const [rank, count] of Object.entries(counts2)) {
    if (count === 3) threeRank2 = rank
    if (count === 2) pairRank2 = rank
  }

  // Сравниваем тройки
  if (rankOrder[threeRank1] > rankOrder[threeRank2]) return 'player1'
  if (rankOrder[threeRank2] > rankOrder[threeRank1]) return 'player2'

  // Сравниваем пары
  if (rankOrder[pairRank1] > rankOrder[pairRank2]) return 'player1'
  if (rankOrder[pairRank2] > rankOrder[pairRank1]) return 'player2'
  return 'tie'
}

// Сравнение Straight и Straight Flush
const compareStraight = (cards1, cards2) => {
  const getHighestRank = (cards) => {
    const ranks = cards.map(c => rankOrder[c.rank])
    const maxRank = Math.max(...ranks)
    // Специальный случай для стрита A,2,3,4,5
    if (ranks.includes(14) && ranks.includes(2) && ranks.includes(3) && ranks.includes(4) && ranks.includes(5)) {
      return 5 // старшая карта - 5
    }
    return maxRank
  }

  const highest1 = getHighestRank(cards1)
  const highest2 = getHighestRank(cards2)

  if (highest1 > highest2) return 'player1'
  if (highest2 > highest1) return 'player2'
  return 'tie'
}

// Обновленная функция сравнения рук
const compareHands = (hand1Name, hand2Name, hand1Cards, hand2Cards) => {
  const weight1 = combinationWeights[hand1Name] || 1
  const weight2 = combinationWeights[hand2Name] || 1

  if (weight1 > weight2) return 'player1'
  if (weight2 > weight1) return 'player2'

  // Если комбинации одинаковые, сравниваем по правилам покера
  switch (hand1Name) {
    case 'High Card':
      return compareHighCard(hand1Cards, hand2Cards)
    case 'One Pair':
      return compareOnePair(hand1Cards, hand2Cards)
    case 'Two Pair':
      return compareTwoPair(hand1Cards, hand2Cards)
    case 'Flush':
      return compareHighCard(hand1Cards, hand2Cards)
    case 'Straight':
      return compareStraight(hand1Cards, hand2Cards)
    case 'Full House':
      return compareFullHouse(hand1Cards, hand2Cards)
    case 'Four of a Kind':
      return compareFourOfAKind(hand1Cards, hand2Cards)
    case 'Straight Flush':
      return compareStraight(hand1Cards, hand2Cards)
    case 'Royal Flush':
      return 'tie' // Роял-флеш всегда одинаковый по силе
    default:
      return 'tie'
  }
}

// Открыть квиз
const openQuiz = () => {
  showQuizModal.value = true
  selectedWinner.value = null
  showResult.value = false
  feedbackMessage.value = ''
  generateNewQuizQuestion()
}

// Генерация нового вопроса
const generateNewQuizQuestion = () => {
  const hand1 = generateRandomHand()
  const hand2 = generateRandomHand()

  quizHands.value = {
    player1: hand1.cards,
    player2: hand2.cards,
    player1Name: hand1.name,
    player2Name: hand2.name
  }

  currentCorrectAnswer = compareHands(hand1.name, hand2.name, hand1.cards, hand2.cards)
}

// Выбор победителя
// Выбор победителя
const selectWinner = (winner) => {
  if (showResult.value) return

  selectedWinner.value = winner
  showResult.value = true

  // Получаем объяснение почему
  const explanation = getWinnerExplanation()

  if (winner === currentCorrectAnswer) {
    feedbackMessage.value = `🎉 CORRECT! ${explanation} 🎉`
    feedbackClass.value = 'correct'
  } else if (currentCorrectAnswer === 'tie') {
    feedbackMessage.value = '🤝 It\'s a TIE! Это редкость - но это ничья! Произносится ТАЙ - tie - it means 2 players have equal hands! 🤝'
    feedbackClass.value = 'tie'
  } else {
    const correctPlayer = currentCorrectAnswer === 'player1' ? 'Player 1' : 'Player 2'
    feedbackMessage.value = `❌ WRONG! ${correctPlayer} wins! ${explanation} ❌`
    feedbackClass.value = 'wrong'
  }
}

// Функция для получения объяснения
const getWinnerExplanation = () => {
  if (currentCorrectAnswer === 'player1') {
    return getDetailedExplanation(quizHands.value.player1, quizHands.value.player2, quizHands.value.player1Name, quizHands.value.player2Name)
  } else if (currentCorrectAnswer === 'player2') {
    return getDetailedExplanation(quizHands.value.player2, quizHands.value.player1, quizHands.value.player2Name, quizHands.value.player1Name)
  }
  return ''
}

// Детальное объяснение
const getDetailedExplanation = (winnerCards, loserCards, winnerName, loserName) => {
  if (winnerName !== loserName) {
    // Разные комбинации
    return `${winnerName} beats ${loserName}`
  }

  // Одинаковые комбинации - даем детали
  switch (winnerName) {
    case 'High Card':
      return getHighCardExplanation(winnerCards, loserCards)
    case 'One Pair':
      return getOnePairExplanation(winnerCards, loserCards)
    case 'Two Pair':
      return getTwoPairExplanation(winnerCards, loserCards)
    case 'Flush':
      return getHighCardExplanation(winnerCards, loserCards)
    case 'Full House':
      return getFullHouseExplanation(winnerCards, loserCards)
    case 'Four of a Kind':
      return getFourOfAKindExplanation(winnerCards, loserCards)
    default:
      return `${winnerName} is stronger`
  }
}

const getHighCardExplanation = (winnerCards, loserCards) => {
  const winnerSorted = [...winnerCards].sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])
  const loserSorted = [...loserCards].sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank])

  for (let i = 0; i < winnerSorted.length; i++) {
    if (rankOrder[winnerSorted[i].rank] !== rankOrder[loserSorted[i].rank]) {
      return `Player has higher card: ${winnerSorted[i].rank}${getSuitSymbol(winnerSorted[i].suit)} > ${loserSorted[i].rank}${getSuitSymbol(loserSorted[i].suit)}`
    }
  }
  return 'Higher cards win'
}

const getOnePairExplanation = (winnerCards, loserCards) => {
  const getPairRank = (cards) => {
    const counts = getRankCounts(cards)
    for (const [rank, count] of Object.entries(counts)) {
      if (count === 2) return rank
    }
    return null
  }

  const winnerPair = getPairRank(winnerCards)
  const loserPair = getPairRank(loserCards)

  if (winnerPair !== loserPair) {
    return `Pair of ${winnerPair}s beats pair of ${loserPair}s`
  }
  return `Same pair, but higher kicker wins`
}

const getTwoPairExplanation = (winnerCards, loserCards) => {
  const getPairs = (cards) => {
    const counts = getRankCounts(cards)
    const pairs = Object.entries(counts).filter(([_, count]) => count === 2).map(([rank, _]) => rank)
    return pairs.sort((a, b) => rankOrder[b] - rankOrder[a])
  }

  const winnerPairs = getPairs(winnerCards)
  const loserPairs = getPairs(loserCards)

  if (winnerPairs[0] !== loserPairs[0]) {
    return `Higher pair ${winnerPairs[0]}s beats ${loserPairs[0]}s`
  }
  if (winnerPairs[1] !== loserPairs[1]) {
    return `Second pair ${winnerPairs[1]}s beats ${loserPairs[1]}s`
  }
  return `Same pairs, higher kicker wins`
}

const getFullHouseExplanation = (winnerCards, loserCards) => {
  const getThreeRank = (cards) => {
    const counts = getRankCounts(cards)
    for (const [rank, count] of Object.entries(counts)) {
      if (count === 3) return rank
    }
    return null
  }

  const winnerThree = getThreeRank(winnerCards)
  const loserThree = getThreeRank(loserCards)

  if (winnerThree !== loserThree) {
    return `Three ${winnerThree}s beats three ${loserThree}s`
  }
  return `Same three, higher pair wins`
}

const getFourOfAKindExplanation = (winnerCards, loserCards) => {
  const getFourRank = (cards) => {
    const counts = getRankCounts(cards)
    for (const [rank, count] of Object.entries(counts)) {
      if (count === 4) return rank
    }
    return null
  }

  const winnerFour = getFourRank(winnerCards)
  const loserFour = getFourRank(loserCards)

  if (winnerFour !== loserFour) {
    return `Four ${winnerFour}s beats four ${loserFour}s`
  }
  return `Same four, higher kicker wins`
}

// Следующий вопрос
const nextQuiz = () => {
  selectedWinner.value = null
  showResult.value = false
  feedbackMessage.value = ''
  generateNewQuizQuestion()
}

// Закрыть квиз
const closeQuiz = () => {
  showQuizModal.value = false
  selectedWinner.value = null
  showResult.value = false
  feedbackMessage.value = ''
}

// Массив всех доступных функций-комбинаций
const combinationFunctions = [
  { name: 'Random Card', func: getRandomCard },
  { name: 'High Card', func: getHighCard },
  { name: 'One Pair', func: getOnePair },
  { name: 'Two Pair', func: getTwoPair },
  { name: 'Flush', func: getFlush },
  { name: 'Straight', func: getStraight },
  { name: 'Straight Flush', func: getStraightFlush },
  { name: 'Royal Flush', func: getRoyalFlush },
  { name: 'Full House', func: getFullHouse },
  { name: 'Four of a Kind', func: getFourOfAKind }
]

// Получить случайную комбинацию
const getRandomCombination = () => {
  const randomIndex = Math.floor(Math.random() * combinationFunctions.length)
  const randomCombo = combinationFunctions[randomIndex]
  randomCombo.func()
}

// Инициализация
initDeck()
</script>

<style scoped>
/* ... предыдущие стили ... */

.card-deck-container {
  background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin: 20px auto;
  margin-top: 60px;
  max-width: 900px;
}

.deck-header {
  text-align: center;
  margin-bottom: 20px;
}

.deck-header h3 {
  color: #ffd700;
  font-size: 24px;
  margin: 0 0 5px 0;
}

.deck-header p {
  color: #aaa;
  font-size: 14px;
  margin: 0;
}

.cards-display {
  min-height: 180px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.cards-area {
  display: flex;
  justify-content: center;

}

.card {
  width: 80px;
  height: 110px;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-rank {
  font-size: 28px;
  font-weight: bold;
}

.card-suit {
  font-size: 36px;
}

.card-red {
  color: #e53935;
}

.card-black {
  color: #1a1a1a;
}

.empty-message {
  text-align: center;
  color: #aaa;
  padding: 30px;
  font-style: italic;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn-primary {
  background: #4a90e2;
  color: white;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

.btn-secondary {
  background: #6c5ce7;
  color: white;
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.3);
}

.btn-danger {
  background: #e53935;
  color: white;
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.3);
}

.btn-warning {
  background: #f39c12;
  color: white;
  box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
}

.btn-success {
  background: #3ec46d;
  color: white;
  box-shadow: 0 2px 8px rgba(62, 196, 109, 0.3);
}

.btn-random {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  box-shadow: 0 2px 8px rgba(155, 89, 182, 0.3);
}

.btn-random:hover {
  background: linear-gradient(135deg, #8e44ad, #7d3c98);
}

.btn-info {
  background: #00bcd4;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
}

.btn-info:hover {
  background: #0097a7;
}

.btn-quiz {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  box-shadow: 0 2px 8px rgba(238, 90, 36, 0.3);
  position: relative;
  overflow: hidden;
  animation: pulseGlow 1.5s ease-in-out infinite, borderPulse 1.5s ease-in-out infinite;
  border: 2px solid transparent;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg,
    #ff0000, #ff7700, #ffff00, #00ff00,
    #0000ff, #4b0082, #9400d3, #ff0000);
    background-size: 400%;
    border-radius: 40px;
    z-index: -1;
    animation: shimmer 3s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.08);
    animation: none;

    &::before {
      opacity: 1;
    }
  }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(238, 90, 36, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(238, 90, 36, 0);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(238, 90, 36, 0);
    transform: scale(1);
  }
}

@keyframes borderPulse {
  0% {
    border-color: rgba(255, 215, 0, 0.3);
  }
  50% {
    border-color: rgba(255, 215, 0, 0.8);
  }
  100% {
    border-color: rgba(255, 215, 0, 0.3);
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.info {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  color: #ffd700;
  font-size: 14px;
}

/* Quiz Modal Styles */
.quiz-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.quiz-modal {
  background: linear-gradient(135deg, #1a472a 0%, #0d2818 100%);
  border-radius: 32px;
  padding: 24px;
  max-width: 900px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid #ffd700;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ffd700;
}

.quiz-header h3 {
  color: #ffd700;
  font-size: 24px;
  margin: 0;
}

.close-btn {
  background: #e53935;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
  background: #c62828;
}

.quiz-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.player-hand {
  flex: 1;
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.player-hand:hover:not(.winner-highlight):not(.loser-dim) {
  transform: scale(1.02);
  border-color: #ffd700;
}

.winner-highlight {
  background: rgba(62, 196, 109, 0.3);
  border-color: #3ec46d;
  animation: winnerPulse 0.5s ease;
}

.loser-dim {
  opacity: 0.5;
  background: rgba(229, 57, 53, 0.2);
}

.player-label {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 15px;
}

.quiz-cards {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.quiz-card {
  width: 60px;
  height: 85px;
}

.quiz-card .card-rank {
  font-size: 20px;
}

.quiz-card .card-suit {
  font-size: 28px;
}

.combination-name {
  font-size: 14px;
  color: #aaa;
  margin-top: 10px;
  font-style: italic;
}

.vs-div {
  font-size: 32px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.quiz-question {
  text-align: center;
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
}

.quiz-question p {
  color: white;
  font-size: 20px;
  margin: 0;
}

.quiz-feedback {
  text-align: center;
  margin-bottom: 20px;
}

.feedback-bubble {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 40px;
  font-size: 18px;
  font-weight: bold;
  animation: slideUp 0.3s ease;
}

.feedback-bubble.correct {
  background: #3ec46d;
  color: white;
}

.feedback-bubble.wrong {
  background: #e53935;
  color: white;
}

.feedback-bubble.tie {
  background: #f39c12;
  color: white;
}

.quiz-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-next, .btn-close {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-next {
  background: #4a90e2;
  color: white;
}

.btn-next:hover {
  background: #357abd;
  transform: scale(1.05);
}

.btn-close {
  background: #e53935;
  color: white;
}

.btn-close:hover {
  background: #c62828;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes winnerPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* Мобильные стили для Quiz (вертикальное отображение) */
@media (max-width: 700px) {
  .quiz-modal {
    padding: 16px;
    width: 98%;
    max-height: 95vh;
  }

  .quiz-header h3 {
    font-size: 18px;
  }

  .quiz-content {
    flex-direction: column;
    gap: 15px;
  }

  .player-hand {
    width: 100%;
    padding: 12px;
  }

  .vs-div {
    font-size: 20px;
    padding: 5px;
    background: rgba(255, 215, 0, 0.2);
    border-radius: 40px;
    width: fit-content;
    margin: 0 auto;
  }

  .quiz-cards {
    gap: 6px;
  }

  .quiz-card {
    width: 50px;
    height: 70px;
  }

  .quiz-card .card-rank {
    font-size: 16px;
  }

  .quiz-card .card-suit {
    font-size: 22px;
  }

  .player-label {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .combination-name {
    font-size: 11px;
  }

  .quiz-question {
    margin: 10px 0;
    padding: 10px;
  }

  .quiz-question p {
    font-size: 14px;
  }

  .feedback-bubble {
    font-size: 12px;
    padding: 8px 12px;
    max-width: 90%;
    word-wrap: break-word;
  }

  .quiz-footer {
    flex-direction: column;
    gap: 10px;
  }

  .btn-next, .btn-close {
    padding: 10px 16px;
    font-size: 14px;
    width: 100%;
  }
}

/* Для очень маленьких экранов (до 480px) */
@media (max-width: 480px) {
  .quiz-card {
    width: 45px;
    height: 60px;
  }

  .quiz-card .card-rank {
    font-size: 14px;
  }

  .quiz-card .card-suit {
    font-size: 18px;
  }

  .player-hand {
    padding: 10px;
  }

  .quiz-question p {
    font-size: 12px;
  }

  .combination-name {
    font-size: 10px;
  }
}

/* Для горизонтальной ориентации на мобильных (если хотим оставить горизонтальным при достаточной ширине) */
@media (min-width: 701px) and (max-width: 900px) {
  .quiz-card {
    width: 55px;
    height: 75px;
  }

  .quiz-card .card-rank {
    font-size: 18px;
  }

  .quiz-card .card-suit {
    font-size: 24px;
  }

  .player-label {
    font-size: 16px;
  }
}
</style>
