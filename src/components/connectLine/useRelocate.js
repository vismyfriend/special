export function createRelocate({ cards, sideLists, layoutSide, estimateX, estimateY, getLine, SUB_MAX }) {
  const LIMITS = SUB_MAX || { left: 8, right: 8, top: 4 }
  const HALF_WIDTH = 400 // половина от BASE_W (800) для проверки "длинной" линии

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

  // Обычный поиск лучшего слота
  function findBestSlot(card, zone, skipSides = []) {
    const currentSide = card.side
    const currentSub = card.sub ?? 0
    const STICKY_BONUS = 20
    let best = null

    for (const side of ['left', 'right', 'top']) {
      if (skipSides.includes(side)) continue
      const slots = sideLists[side] || []
      for (let sub = 0; sub < slots.length; sub++) {
        const list = slots[sub]
        if (list.length >= LIMITS[side]) continue

        const possiblePositions = [0, list.length]
        for (const pos of possiblePositions) {
          const cx = estimateX(side, sub, pos, list.length + 1)
          const cy = estimateY(side, sub, pos, list.length + 1)
          let d = Math.hypot(cx - zone.x, cy - zone.y)

          const isOwn = (side === currentSide && sub === currentSub)
          if (isOwn) d -= STICKY_BONUS

          if (!best || d < best.dist) {
            best = { side, sub, pos, dist: d }
          }
        }
      }
    }
    return best
  }

  function findUnconnectedInBucket(bucket) {
    for (let i = bucket.length - 1; i >= 0; i--) {
      const c = cards.find(x => x.id === bucket[i])
      if (c && !c.isConnected) return { index: i, card: c }
    }
    return null
  }

  function relocateCard(card, zone) {
    // Определяем, нужно ли делать свап (линия пересекает половину канваса)
    const isLongLine = Math.abs(zone.x - card.x) > HALF_WIDTH
    const targetSide = zone.x < HALF_WIDTH ? 'left' : 'right'

    const currentSide = card.side
    const currentSub = card.sub ?? 0
    const currentBucket = sideLists[currentSide]?.[currentSub]
    if (!currentBucket) return

    const oldIndex = currentBucket.indexOf(card.id)
    if (oldIndex < 0) return
    currentBucket.splice(oldIndex, 1)

    let best = findBestSlot(card, zone)

    // Если линия длинная, и обычный лучший слот не на той стороне, где зона
    if (isLongLine && (!best || best.side !== targetSide)) {
      const targetSlots = sideLists[targetSide] || []

      for (let sub = 0; sub < targetSlots.length; sub++) {
        const victim = findUnconnectedInBucket(targetSlots[sub])
        if (victim) {
          // Меняем местами: жертва -> старое место карточки (или свободное)
          const victimSlot = findBestSlot(victim.card, zone, [targetSide])

          if (victimSlot) {
            // Сначала ставим жертву на новое место
            sideLists[victimSlot.side][victimSlot.sub].splice(victimSlot.pos, 0, victim.card.id)
            victim.card.side = victimSlot.side
            victim.card.sub = victimSlot.sub

            // Убираем жертву из старого слота
            targetSlots[sub].splice(victim.index, 1)

            // Теперь ищем слот для нашей карточки (там освободилось место)
            best = findBestSlot(card, zone)
            if (best) {
              sideLists[best.side][best.sub].splice(best.pos, 0, card.id)
              card.side = best.side
              card.sub = best.sub
            }
            // Если best всё ещё null (маловероятно), откат жертвы
            // (пропускаем для простоты, так как место освободилось)
          }
          break
        }
      }
    } else if (best) {
      // Обычная вставка (если места нет или линия не длинная)
      sideLists[best.side][best.sub].splice(best.pos, 0, card.id)
      card.side = best.side
      card.sub = best.sub
    }

    // Если ничего не нашли вообще (best = null), возвращаем в конец исходного столбца
    if (!best) {
      currentBucket.push(card.id)
    }

    // Пересчитываем layout для всех сторон (на всякий случай)
    layoutSide('left')
    layoutSide('right')
    layoutSide('top')

    animateAllCards()
  }

  return { relocateCard, animateAllCards }
}
