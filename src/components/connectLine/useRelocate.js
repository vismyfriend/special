export function createRelocate({ cards, sideLists, layoutSide, estimateX, estimateY, getLine, SUB_MAX }) {
  const LIMITS = SUB_MAX || { left: 10, right: 10, top: 4 }

  function animateAllCards() {
    cards.forEach(card => {
      const dx = Math.abs(card.x - card.targetX)
      const dy = Math.abs(card.y - card.targetY)
      if (dx < 1 && dy < 1) return

      const startX = card.x, startY = card.y
      const endX = card.targetX, endY = card.targetY
      const duration = 250
      const t0 = performance.now()

      const line = getLine?.(card.id)

      function frame(now) {
        const t = Math.min(1, (now - t0) / duration)
        const e = 1 - Math.pow(1 - t, 3)
        card.x = startX + (endX - startX) * e
        card.y = startY + (endY - startY) * e

        if (line) {
          const anchor = card.getAnchorPoint
            ? card.getAnchorPoint()
            : { x: card.x + card.w / 2, y: card.y + card.h / 2 }
          line.x1 = anchor.x
          line.y1 = anchor.y
        }

        if (t < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    })
  }

  function relocateCard(card, zone) {
    const currentSide = card.side
    const currentSub = card.sub ?? 0
    const currentBucket = sideLists[currentSide]?.[currentSub]
    if (!currentBucket) return

    const oldIndex = currentBucket.indexOf(card.id)
    if (oldIndex < 0) return
    currentBucket.splice(oldIndex, 1)

    // Ищем лучший слот: side × sub × pos, с учётом лимитов
    let best = null
    for (const side of ['left', 'right', 'top']) {
      const slots = sideLists[side] || []
      for (let sub = 0; sub < slots.length; sub++) {
        const list = slots[sub]
        // не даём превысить лимит
        if (list.length >= LIMITS[side]) continue

        for (let pos = 0; pos <= list.length; pos++) {
          const cx = estimateX(side, sub, pos, list.length + 1)
          const cy = estimateY(side, sub, pos, list.length + 1)
          const d = Math.hypot(cx - zone.x, cy - zone.y)
          if (!best || d < best.dist) {
            best = { side, sub, pos, dist: d }
          }
        }
      }
    }

    if (!best) {
      // откат
      currentBucket.splice(oldIndex, 0, card.id)
      return
    }

    sideLists[best.side][best.sub].splice(best.pos, 0, card.id)
    card.side = best.side
    card.sub = best.sub

    // пересчёт затронутых сторон (даже если sub не менялся — могла поменяться высота бакета)
    layoutSide(best.side)
    if (currentSide !== best.side) {
      layoutSide(currentSide)
    }

    animateAllCards()
  }

  return { relocateCard, animateAllCards }
}
