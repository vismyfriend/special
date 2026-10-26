import { Card, Zone, ImageObject } from '../specialEngine/objects'

export function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function setupBoard(engine, gameData, options = {}) {
  const {
    difficulty = { value: 'easy' },
    hideCardText = false,
  } = options

  let img = null
  try {
    img = await engine.loadImage(gameData.image)
  } catch (err) {
    console.warn('[connectLineBoard] image failed:', gameData.image, err)
  }

  const isMobile = engine.width < 600

  const uniqueByText = new Map()
  gameData.words.forEach(word => {
    if (!uniqueByText.has(word.text)) uniqueByText.set(word.text, word)
  })
  const uniqueWords = [...uniqueByText.values()]
  const shuffledWords = shuffleArray(uniqueWords)

  const cards = []
  const zones = []
  const sideLists = { left: [], right: [], top: [] }

  if (isMobile) {
    setupMobile()
  } else {
    setupDesktop()
  }

  // ==================== DESKTOP ====================
  function setupDesktop() {
    const maxW = engine.width * 0.6
    const scale = Math.min(maxW / gameData.imageWidth, 1)
    const w = gameData.imageWidth * scale
    const h = gameData.imageHeight * scale
    const imgX = (engine.width - w) / 2
    const imgY = (engine.height - h) / 2

    engine.add(new ImageObject({ x: imgX, y: imgY, w, h, img }))
    const minSide = Math.min(w, h)

    // --- ЗОНЫ ---
    gameData.words.forEach(word => {
      const zx = imgX + word.x * w
      const zy = imgY + word.y * h
      const zr = word.r * minSide
      const shape = word.shape || 'circle'
      const zone = new Zone({
        x: zx, y: zy, r: zr,
        w: (word.w || word.r * 2) * minSide,
        h: (word.h || word.r * 2) * minSide,
        shape,
      })
      zone.id = word.id
      zone.text = word.text
      zone.showRadius = false
      zone.showAnchor = difficulty.value === 'easy' || difficulty.value === 'medium' || difficulty.value === 'hardcore'
      zone.anchorAlpha = (difficulty.value === 'medium' || difficulty.value === 'hardcore') ? 0.6 : 1
      zones.push(zone)
      engine.add(zone)
    })

    // --- КАРТОЧКИ ---
    const cardW = 160
    const cardH = 52

    const allCards = shuffledWords.map(word => {
      const card = new Card({
        x: 0, y: 0, w: cardW, h: cardH,
        text: hideCardText ? '' : word.text,
      })
      card.id = word.id
      card.correctText = word.text
      card.side = 'left'
      return card
    })

    // --- распределение: поровну, но в случайном порядке ---
    const shuffledCards = shuffleArray(allCards)
    const sides = ['left', 'right', 'top']
    shuffledCards.forEach((card, i) => {
      const side = sides[i % 3]
      sideLists[side].push(card.id)
      card.side = side
    })

    cards.push(...allCards)
    allCards.forEach(c => engine.add(c))

    layoutSide('left')
    layoutSide('right')
    layoutSide('top')

    cards.forEach(c => {
      c.x = c.targetX
      c.y = c.targetY
    })
  }

  // ==================== MOBILE ====================
  function setupMobile() {
    const cardW = 90
    const cardH = 36
    const gapX = 8
    const gapY = 8
    const paddingX = 12
    const paddingTop = 12

    const maxRowW = engine.width - paddingX * 2
    let x = paddingX
    let y = paddingTop

    shuffledWords.forEach(word => {
      if (x + cardW > maxRowW + paddingX) {
        x = paddingX
        y += cardH + gapY
      }
      const card = new Card({
        x, y, w: cardW, h: cardH,
        text: hideCardText ? '' : word.text,
      })
      card.id = word.id
      card.correctText = word.text
      cards.push(card)
      engine.add(card)
      x += cardW + gapX
    })

    const cardsBottom = y + cardH + 16

    const availW = engine.width - 24
    const availH = engine.height - cardsBottom - 12
    const scale = Math.min(availW / gameData.imageWidth, availH / gameData.imageHeight, 1)
    const w = gameData.imageWidth * scale
    const h = gameData.imageHeight * scale
    const imgX = (engine.width - w) / 2
    const imgY = cardsBottom + (availH - h) / 2

    engine.add(new ImageObject({ x: imgX, y: imgY, w, h, img }))
    const minSide = Math.min(w, h)

    gameData.words.forEach(word => {
      const zx = imgX + word.x * w
      const zy = imgY + word.y * h
      const zr = word.r * minSide
      const shape = word.shape || 'circle'
      const zone = new Zone({
        x: zx, y: zy, r: zr,
        w: (word.w || word.r * 2) * minSide,
        h: (word.h || word.r * 2) * minSide,
        shape,
      })
      zone.id = word.id
      zone.text = word.text
      zone.showRadius = false
      zone.showAnchor = difficulty.value === 'easy' || difficulty.value === 'medium' || difficulty.value === 'hardcore'
      zone.anchorAlpha = (difficulty.value === 'medium' || difficulty.value === 'hardcore') ? 0.6 : 1
      zones.push(zone)
      engine.add(zone)
    })
  }

  // ==================== LAYOUT ====================
  function layoutSide(side) {
    const list = sideLists[side]
    const N = list.length
    if (N === 0) return

    const cardW = 160
    const cardH = 52
    const gap = 12

    if (side === 'left') {
      const startY = (engine.height - N * (cardH + gap) + gap) / 2
      list.forEach((cardId, i) => {
        const card = cards.find(c => c.id === cardId)
        if (!card) return
        card.targetX = 20
        card.targetY = startY + i * (cardH + gap)
      })
    } else if (side === 'right') {
      const x = engine.width - cardW - 20
      const startY = (engine.height - N * (cardH + gap) + gap) / 2
      list.forEach((cardId, i) => {
        const card = cards.find(c => c.id === cardId)
        if (!card) return
        card.targetX = x
        card.targetY = startY + i * (cardH + gap)
      })
    } else if (side === 'top') {
      const topGap = 10
      const totalW = N * cardW + (N - 1) * topGap
      const startX = (engine.width - totalW) / 2
      list.forEach((cardId, i) => {
        const card = cards.find(c => c.id === cardId)
        if (!card) return
        card.targetX = startX + i * (cardW + topGap)
        card.targetY = 10
      })
    }
  }

  function estimateX(side, pos, total) {
    const cardW = 160
    const topGap = 10
    if (side === 'left') return 20 + cardW / 2
    if (side === 'right') return engine.width - cardW - 20 + cardW / 2
    if (side === 'top') {
      const totalW = total * cardW + (total - 1) * topGap
      const startX = (engine.width - totalW) / 2
      return startX + pos * (cardW + topGap) + cardW / 2
    }
    return 0
  }

  function estimateY(side, pos, total) {
    const cardH = 52
    const gap = 12
    if (side === 'left' || side === 'right') {
      const startY = (engine.height - total * (cardH + gap) + gap) / 2
      return startY + pos * (cardH + gap) + cardH / 2
    }
    if (side === 'top') {
      return 10 + cardH / 2
    }
    return 0
  }

  function findZoneByText(text) {
    return zones.find(z => z.text === text)
  }

  return {
    cards, zones, sideLists, layoutSide, estimateX, estimateY, isMobile, findZoneByText,
  }
}
