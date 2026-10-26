export function createRelocate({ cards, sideLists, layoutSide, estimateX, estimateY, getLine }) {
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
          line.x1 = card.x + card.w / 2
          line.y1 = card.y + card.h / 2
        }
        if (t < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    })
  }

  function relocateCard(card, zone) {
    const currentSide = card.side
    const currentList = sideLists[currentSide]
    const oldIndex = currentList.indexOf(card.id)
    if (oldIndex < 0) return

    currentList.splice(oldIndex, 1)

    let best = null
    for (const side of ['left', 'right', 'top']) {
      const list = sideLists[side]
      for (let pos = 0; pos <= list.length; pos++) {
        const cx = estimateX(side, pos, list.length + 1)
        const cy = estimateY(side, pos, list.length + 1)
        const d = Math.hypot(cx - zone.x, cy - zone.y)
        if (!best || d < best.dist) {
          best = { side, pos, dist: d }
        }
      }
    }

    if (!best) {
      currentList.splice(oldIndex, 0, card.id)
      return
    }

    sideLists[best.side].splice(best.pos, 0, card.id)
    const newSide = best.side
    card.side = newSide

    layoutSide(currentSide)
    if (currentSide !== newSide) layoutSide(newSide)

    animateAllCards()
  }

  return { relocateCard, animateAllCards }
}
