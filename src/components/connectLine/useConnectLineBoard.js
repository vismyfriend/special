import { Card, Zone, ImageObject, Rect } from '../specialEngine/objects'

export function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function planLayout(count) {
  if (count <= 10) return { left: 1, right: 0, top: 0 }
  if (count <= 20) return { left: 1, right: 1, top: 0 }
  if (count <= 30) return { left: 2, right: 1, top: 0, stagger: true }
  if (count <= 40) return { left: 2, right: 2, top: 0, stagger: true }

  const topRows = Math.max(1, Math.ceil((count - 40) / 4))
  return { left: 2, right: 2, top: topRows, stagger: true }
}

function distribute(cards, plan) {
  const slots = []
  slots.push({ side: 'left',  sub: 0, max: 10 })
  if (plan.right > 0) slots.push({ side: 'right', sub: 0, max: 10 })
  for (let i = 0; i < plan.top; i++) {
    slots.push({ side: 'top', sub: i, max: 4 })
  }
  if (plan.left > 1)  slots.push({ side: 'left',  sub: 1, max: 10 })
  if (plan.right > 1) slots.push({ side: 'right', sub: 1, max: 10 })

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

function applyCropToImage(img, crop, BASE_W = 800, BASE_H = 520) {
  if (!img || !crop) return img
  const outW = crop.croppedWidth || BASE_W
  const outH = crop.croppedHeight || BASE_H

  const off = document.createElement('canvas')
  off.width = outW
  off.height = outH
  const ctx = off.getContext('2d')

  const iw = img.width
  const ih = img.height
  const baseScale = Math.min(BASE_W / iw, BASE_H / ih)
  const s = baseScale * crop.scale
  const drawW = iw * s
  const drawH = ih * s
  const dx = (BASE_W - drawW) / 2 + crop.offsetX * BASE_W
  const dy = (BASE_H - drawH) / 2 + crop.offsetY * BASE_H

  const bx = crop.box.x
  const by = crop.box.y
  const bw = crop.box.w
  const bh = crop.box.h

  const sx = (bx - dx) / s
  const sy = (by - dy) / s
  const sw = bw / s
  const sh = bh / s

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
  return off
}

export async function setupBoard(engine, gameData, options = {}) {
  const {
    difficulty = { value: 'easy' },
    hideCardText = false,
  } = options

  // ─── ФЛАГИ ОТЛАДКИ ───
  const SHOW_DEBUG_ZONES = false // true — показывать синие зоны и зелёный контур

  // ─── КОНСТАНТЫ РАСКЛАДКИ ───
  let cardW = 110
  const cardH = 28
  const gapY = 18
  const gapX_top = 10
  const sidePadX = 10
  const topPadY = 10
  const columnGap = -50
  const rowGap = 10

  // ─── БАЗОВАЯ СИСТЕМА КООРДИНАТ ───
  const BASE_W = 800
  const BASE_H = 520

  let imgX = 0
  let imgW = 0
  let imgH = 0

  let currentLeftGap = 8
  let currentRightGap = 8

  let img = null
  try {
    img = await engine.loadImage(gameData.image)
  } catch (err) {
    console.warn('[connectLineBoard] image failed:', gameData.image, err)
  }

  if (img && gameData.crop) {
    img = applyCropToImage(img, gameData.crop, BASE_W, BASE_H)
  }

  const imgNaturalW = img?.width || gameData.imageWidth || BASE_W
  const imgNaturalH = img?.height || gameData.imageHeight || BASE_H

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
    const plan = planLayout(shuffledWords.length)

    const leftCols = plan.left
    const rightCols = plan.right

    const leftGap = 8
    const rightGap = 8

    currentLeftGap = leftGap
    currentRightGap = rightGap

    // 1. Считаем РЕАЛЬНУЮ ширину карточек
    const leftRealWidth = leftCols > 0
      ? (sidePadX + cardW + (leftCols === 2 ? columnGap + cardW : 0))
      : 0

    const rightRealWidth = rightCols > 0
      ? (sidePadX + cardW + (rightCols === 2 ? columnGap + cardW : 0))
      : 0

    // 2. Картинка занимает ВСЁ оставшееся место
    const maxW = engine.width - leftRealWidth - rightRealWidth - leftGap - rightGap

    // 3. Высота верхних карточек
    const topBlockH = plan.top > 0
      ? plan.top * cardH + (plan.top - 1) * rowGap + topPadY * 2
      : 0

    const maxH = engine.height - topBlockH - 8

    // 4. Размер картинки
    const scale = Math.min(maxW / imgNaturalW, maxH / imgNaturalH, 1)
    let w = imgNaturalW * scale
    let h = imgNaturalH * scale

    // 5. ПОЗИЦИЯ КАРТИНКИ — ВСЕГДА ПО ЦЕНТРУ
    let imgXPos = (engine.width - w) / 2
    let imgY = topBlockH + (engine.height - topBlockH - h) / 2

    // 6. Если вылезает за низ
    const bottomPad = 8
    if (imgY + h > engine.height - bottomPad) {
      const maxH2 = engine.height - bottomPad - imgY
      if (maxH2 > 60) {
        const ratio = maxH2 / h
        h = h * ratio
        w = w * ratio
        imgXPos = (engine.width - w) / 2 // по центру
      }
    }

    imgX = imgXPos
    imgW = w
    imgH = h

    // 7. Рисуем картинку
    engine.add(new ImageObject({ x: imgX, y: imgY, w, h, img }))

    // 8. Рисуем зоны
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

    // 9. Создаём карточки
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

    // 10. Если stagger — уменьшаем карточки
    if (plan.stagger) {
      const leftSpace  = imgX - sidePadX * 2 - Math.abs(columnGap)
      const rightSpace = (engine.width - (imgX + w)) - sidePadX * 2 - Math.abs(columnGap)
      const freeSide = Math.min(leftSpace, rightSpace)
      const perColumn = (freeSide - Math.abs(columnGap)) / 2
      cardW = Math.max(120, Math.min(140, Math.floor(perColumn)))
      allCards.forEach(c => { c.w = cardW })
    }

    // 11. Распределение карточек по слотам
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

    // 12. Раскладка
    layoutAll()
    cards.forEach(c => { c.x = c.targetX; c.y = c.targetY })

    // 13. ОТЛАДКА (если включено — рисуем зоны и контуры)
    if (SHOW_DEBUG_ZONES) {
      if (plan.left > 0) {
        const leftCards = cards.filter(c => c.side === 'left')
        if (leftCards.length > 0) {
          const maxX = Math.max(...leftCards.map(c => c.x + c.w))
          engine.add(new Rect({
            x: 0, y: 0, w: maxX, h: engine.height,
            color: 'rgba(59,130,246,0.06)',
            borderColor: 'rgba(59,130,246,0.35)',
            borderWidth: 1,
          }))
        }
      }

      if (plan.right > 0) {
        const rightCards = cards.filter(c => c.side === 'right')
        if (rightCards.length > 0) {
          const minX = Math.min(...rightCards.map(c => c.x))
          engine.add(new Rect({
            x: minX, y: 0, w: engine.width - minX, h: engine.height,
            color: 'rgba(59,130,246,0.06)',
            borderColor: 'rgba(59,130,246,0.35)',
            borderWidth: 1,
          }))
        }
      }

      if (topBlockH > 0) {
        engine.add(new Rect({
          x: 0, y: 0, w: engine.width, h: topBlockH,
          color: 'rgba(245,158,11,0.08)',
          borderColor: 'rgba(245,158,11,0.35)',
          borderWidth: 1,
        }))
      }

      engine.add(new Rect({
        x: imgX, y: imgY, w, h,
        color: 'rgba(34,197,94,0.04)',
        borderColor: 'rgba(34,197,94,0.6)',
        borderWidth: 2,
      }))
    }
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
    const scale = Math.min(availW / imgNaturalW, availH / imgNaturalH, 1)
    const w = imgNaturalW * scale
    const h = imgNaturalH * scale
    const imgXm = (engine.width - w) / 2
    const imgYm = cardsBottom + (availH - h) / 2

    engine.add(new ImageObject({ x: imgXm, y: imgYm, w, h, img }))
    const minSide = Math.min(w, h)

    gameData.words.forEach(word => {
      const zx = imgXm + (word.x * BASE_W / imgNaturalW) * w
      const zy = imgYm + (word.y * BASE_H / imgNaturalH) * h
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

  function columnX(side, sub) {
    if (side === 'left') {
      let x = sidePadX + sub * (cardW + columnGap)
      if (x + cardW > imgX - currentLeftGap) {
        x = imgX - currentLeftGap - cardW
      }
      return Math.max(sidePadX, x)
    }
    let x = engine.width - sidePadX - cardW - (1 - sub) * (cardW + columnGap)
    if (x < imgX + imgW + currentRightGap) {
      x = imgX + imgW + currentRightGap
    }
    return Math.min(engine.width - sidePadX - cardW, x)
  }

  function columnStaggerOffset(sub, plan) {
    if (!plan.stagger) return 0
    return sub === 1 ? Math.round((cardH + gapY) / 2) : 0
  }

  function layoutBucket(side, sub) {
    const bucket = sideLists[side]?.[sub]
    if (!bucket || bucket.length === 0) return
    const N = bucket.length
    const plan = planLayout(cards.length)

    if (side === 'left' || side === 'right') {
      const x = columnX(side, sub)
      const isStagger = plan.stagger && sub === 1
      const stepY = cardH + gapY

      let startY
      if (isStagger) {
        const refBucket = sideLists[side]?.[0] || []
        const refN = refBucket.length
        const refBlockH = refN * stepY - gapY
        const refStartY = (engine.height - refBlockH) / 2
        startY = refStartY + stepY / 2
      } else {
        const totalBlockH = N * stepY - gapY
        startY = (engine.height - totalBlockH) / 2
      }

      bucket.forEach((cardId, i) => {
        const card = cards.find(c => c.id === cardId)
        if (!card) return
        card.targetX = x
        card.targetY = startY + i * stepY
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
