import { Card, Zone, ImageObject } from '../specialEngine/objects'

export function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Планировщик раскладки ────────────────────────────────────────────
export function planLayout(count) {
  if (count <= 6)  return { left: 1, right: 0, top: 0 }
  if (count <= 12) return { left: 1, right: 1, top: 0 }
  if (count <= 16) return { left: 2, right: 2, top: 1, stagger: true }  // ← верх с 13

  // 17+: top = ceil((count - 16) / 4), но не меньше 1
  const topRows = Math.max(1, Math.ceil((count - 16) / 4))
  return { left: 2, right: 2, top: topRows, stagger: true }
}

function distribute(cards, plan) {
  const slots = []
  slots.push({ side: 'left',  sub: 0, max: 8 })
  if (plan.right > 0) slots.push({ side: 'right', sub: 0, max: 8 })
  for (let i = 0; i < plan.top; i++) {
    slots.push({ side: 'top', sub: i, max: 4 })
  }
  if (plan.left > 1)  slots.push({ side: 'left',  sub: 1, max: 8 })
  if (plan.right > 1) slots.push({ side: 'right', sub: 1, max: 8 })

  const buckets = slots.map(() => [])
  let s = 0
  cards.forEach(card => {
    let guard = 0
    while (buckets[s].length >= slots[s].max && guard < slots.length) {
      s = (s + 1) % slots.length
      guard++
    }
    buckets[s].push(card.id)
    s = (s + 1) % slots.length
  })
  return { slots, buckets }
}

export async function setupBoard(engine, gameData, options = {}) {
  const {
    difficulty = { value: 'easy' },
    hideCardText = false,
  } = options

  // ─── КОНСТАНТЫ РАСКЛАДКИ ───
  let cardW = 160
  const cardH = 52
  const gapY = 12
  const gapX_top = 10
  const sidePadX = 20
  const topPadY = 10
  const columnGap = 12
  const rowGap = 10

  // ─── Геометрия картинки (нужна columnX / estimateX) ───
  let imgX = 0
  let imgW = 0
  let imgH = 0

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
  let sideLists = { left: [], right: [], top: [] }

  if (isMobile) {
    setupMobile()
  } else {
    setupDesktop()
  }

  // ==================== DESKTOP ====================
  function setupDesktop() {
    // ─── План считаем ДО картинки ───
    const plan = planLayout(shuffledWords.length)

    // ─── Базовая доля ширины под картинку ───
    const imgShare = plan.stagger ? 0.45 : 0.6
    const maxW = engine.width * imgShare
    let scale = Math.min(maxW / gameData.imageWidth, 1)
    let w = gameData.imageWidth * scale
    let h = gameData.imageHeight * scale

    // ─── Высота верхних строк ───
    const topBlockH = plan.top > 0
      ? plan.top * cardH + (plan.top - 1) * rowGap + topPadY * 2
      : 0

    // ─── Вертикальное центрирование + сдвиг вниз, если верх мешает ───
    let imgY = (engine.height - h) / 2
    const minImgY = topBlockH + 12
    if (imgY < minImgY) imgY = minImgY

    // ─── Если картинка вылезает за низ — уменьшаем её ───
    const bottomPad = 8
    if (imgY + h > engine.height - bottomPad) {
      const maxH = engine.height - bottomPad - imgY
      if (maxH > 60) {
        const ratio = maxH / h
        h = h * ratio
        w = w * ratio
        // пересчёт X (картинка по центру)
        imgX = (engine.width - w) / 2
      } else {
        // совсем мало места — прижимаем к верху и уменьшаем по максимуму
        imgY = Math.max(topBlockH + 12, engine.height * 0.15)
        const maxH2 = engine.height - bottomPad - imgY
        const ratio = Math.max(0.2, maxH2 / h)
        h = h * ratio
        w = w * ratio
        imgX = (engine.width - w) / 2
      }
    } else {
      imgX = (engine.width - w) / 2
    }

    imgW = w
    imgH = h

    // ─── Добавляем картинку ───
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
    const allCards = shuffledWords.map(word => {
      const card = new Card({
        x: 0, y: 0, w: cardW, h: cardH,
        text: hideCardText ? '' : word.text,
      })
      card.id = word.id
      card.correctText = word.text
      card.side = 'left'
      card.sub = 0
      return card
    })
    cards.push(...allCards)
    allCards.forEach(c => engine.add(c))

    // ─── cardW: по реальному свободному месту слева/справа от картинки ───
    if (plan.stagger) {
      const leftSpace  = imgX - sidePadX * 2 - columnGap
      const rightSpace = (engine.width - (imgX + w)) - sidePadX * 2 - columnGap
      const freeSide = Math.min(leftSpace, rightSpace)
      const perColumn = (freeSide - columnGap) / 2
      cardW = Math.max(140, Math.min(160, Math.floor(perColumn)))
      allCards.forEach(c => { c.w = cardW })
    }

    // --- РАСПРЕДЕЛЕНИЕ ---
    const shuffledCards = shuffleArray(allCards)
    const { slots, buckets } = distribute(shuffledCards, plan)

    sideLists.left  = Array.from({ length: plan.left  }, () => [])
    sideLists.right = Array.from({ length: plan.right }, () => [])
    sideLists.top   = Array.from({ length: plan.top   }, () => [])

    slots.forEach((slot, i) => {
      sideLists[slot.side][slot.sub] = buckets[i]
    })

    const idToCard = new Map(allCards.map(c => [c.id, c]))
    for (const side of ['left', 'right', 'top']) {
      sideLists[side].forEach((bucket, sub) => {
        bucket.forEach(id => {
          const c = idToCard.get(id)
          if (!c) return
          c.side = side
          c.sub = sub
        })
      })
    }

    // --- РАСКЛАДКА ---
    layoutAll()

    cards.forEach(c => { c.x = c.targetX; c.y = c.targetY })
  }

  // ==================== MOBILE ====================
  function setupMobile() {
    const mCardW = 90
    const mCardH = 36
    const mGapX = 8
    const mGapY = 8
    const paddingX = 12
    const paddingTop = 12

    const maxRowW = engine.width - paddingX * 2
    let x = paddingX
    let y = paddingTop

    shuffledWords.forEach(word => {
      if (x + mCardW > maxRowW + paddingX) {
        x = paddingX
        y += mCardH + mGapY
      }
      const card = new Card({
        x, y, w: mCardW, h: mCardH,
        text: hideCardText ? '' : word.text,
      })
      card.id = word.id
      card.correctText = word.text
      card.side = 'left'
      card.sub = 0
      cards.push(card)
      engine.add(card)
      x += mCardW + mGapX
    })

    sideLists.left = [[]]
    sideLists.right = []
    sideLists.top = []

    const cardsBottom = y + mCardH + 16

    const availW = engine.width - 24
    const availH = engine.height - cardsBottom - 12
    const scale = Math.min(availW / gameData.imageWidth, availH / gameData.imageHeight, 1)
    const w = gameData.imageWidth * scale
    const h = gameData.imageHeight * scale
    const imgXm = (engine.width - w) / 2
    const imgYm = cardsBottom + (availH - h) / 2

    engine.add(new ImageObject({ x: imgXm, y: imgYm, w, h, img }))
    const minSide = Math.min(w, h)

    gameData.words.forEach(word => {
      const zx = imgXm + word.x * w
      const zy = imgYm + word.y * h
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

  // ==================== LAYOUT (DESKTOP) ====================

  function columnX(side, sub) {
    if (side === 'left') {
      let x = sidePadX + sub * (cardW + columnGap)
      if (x + cardW > imgX - columnGap) {
        x = imgX - columnGap - cardW
      }
      return Math.max(sidePadX, x)
    }
    // right
    let x = engine.width - sidePadX - cardW - (1 - sub) * (cardW + columnGap)
    if (x < imgX + imgW + columnGap) {
      x = imgX + imgW + columnGap
    }
    return Math.min(engine.width - sidePadX - cardW, x)
  }

  function columnStaggerOffset(sub, plan) {
    if (!plan.stagger) return 0
    return sub === 1 ? (cardH + gapY) : 0
  }

  function layoutBucket(side, sub) {
    const bucket = sideLists[side]?.[sub]
    if (!bucket || bucket.length === 0) return
    const N = bucket.length
    const plan = planLayout(cards.length)

    if (side === 'left' || side === 'right') {
      const x = columnX(side, sub)
      const offset = columnStaggerOffset(sub, plan)
      const startY = (engine.height - N * (cardH + gapY) + gapY) / 2 + offset
      bucket.forEach((cardId, i) => {
        const card = cards.find(c => c.id === cardId)
        if (!card) return
        card.targetX = x
        card.targetY = startY + i * (cardH + gapY)
      })
      return
    }

    if (side === 'top') {
      const totalW = N * cardW + (N - 1) * gapX_top
      const startX = (engine.width - totalW) / 2
      const y = topPadY + sub * (cardH + rowGap)
      bucket.forEach((cardId, i) => {
        const card = cards.find(c => c.id === cardId)
        if (!card) return
        card.targetX = startX + i * (cardW + gapX_top)
        card.targetY = y
      })
    }
  }

  function layoutAll() {
    for (const side of ['left', 'right', 'top']) {
      const slots = sideLists[side] || []
      for (let sub = 0; sub < slots.length; sub++) {
        layoutBucket(side, sub)
      }
    }
  }

  function layoutSide(side) {
    const slots = sideLists[side] || []
    for (let sub = 0; sub < slots.length; sub++) {
      layoutBucket(side, sub)
    }
  }

  function estimateX(side, sub, pos = 0, total = 1) {
    if (side === 'left' || side === 'right') {
      return columnX(side, sub) + cardW / 2
    }
    if (side === 'top') {
      const totalW = total * cardW + (total - 1) * gapX_top
      const startX = (engine.width - totalW) / 2
      return startX + pos * (cardW + gapX_top) + cardW / 2
    }
    return 0
  }

  function estimateY(side, sub, pos = 0, total = 1) {
    if (side === 'left' || side === 'right') {
      const plan = planLayout(cards.length)
      const offset = columnStaggerOffset(sub, plan)
      const startY = (engine.height - total * (cardH + gapY) + gapY) / 2 + offset
      return startY + pos * (cardH + gapY) + cardH / 2
    }
    if (side === 'top') {
      return topPadY + sub * (cardH + rowGap) + cardH / 2
    }
    return 0
  }

  function findZoneByText(text) {
    return zones.find(z => z.text === text)
  }

  return {
    cards, zones, sideLists,
    layoutSide, layoutAll, layoutBucket,
    estimateX, estimateY,
    isMobile, findZoneByText,
  }
}
