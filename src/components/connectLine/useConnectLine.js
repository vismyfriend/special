import { ref } from 'vue'
import { Line } from '../specialEngine/objects'
import { setupBoard } from './useConnectLineBoard'
import { createRelocate } from './useRelocate'

export function useConnectLine(engine, gameData, difficulty, autoCheck = true) {
  const cards = []
  const zones = []
  let sideLists = { left: [], right: [], top: [] }
  let layoutSideFn = () => {}
  let estimateXFn = () => 0
  let estimateYFn = () => 0
  let isMobile = false
  let relocateCardFn = () => {}

  const connections = ref([])
  const activeLine = ref(null)
  const selectedCard = ref(null)
  const selectedZone = ref(null)
  const dragMode = ref(null)         // 'from-card' | 'from-zone' | 'from-zone-new' | null
  const draggingConn = ref(null)
  const byCard = new Map()
  const byZone = new Map()
  let returningLine = null

  async function setup() {
    const board = await setupBoard(engine, gameData, { difficulty })
    cards.push(...board.cards)
    zones.push(...board.zones)
    sideLists = board.sideLists
    layoutSideFn = board.layoutSide
    estimateXFn = board.estimateX
    estimateYFn = board.estimateY
    isMobile = board.isMobile

    const reloc = createRelocate({
      cards,
      sideLists,
      layoutSide: layoutSideFn,
      estimateX: estimateXFn,
      estimateY: estimateYFn,
      getLine: (cardId) => byCard.get(cardId)?.line,
    })
    relocateCardFn = reloc.relocateCard
  }

  function isMatch(card, zone) {
    return card.correctText === zone.text
  }

  function onPointerDown(pt) {
    if (returningLine) {
      engine.remove(returningLine)
      returningLine = null
    }
    if (activeLine.value && (dragMode.value === 'from-card' || dragMode.value === 'from-zone-new')) {
      engine.remove(activeLine.value)
      activeLine.value = null
    }
    if (selectedCard.value) selectedCard.value.highlight = false
    if (selectedZone.value) selectedZone.value.highlight = false
    selectedCard.value = null
    selectedZone.value = null
    dragMode.value = null
    draggingConn.value = null

    // 1) КАРТОЧКА
    const card = cards.find(c => c.hitTest(pt.x, pt.y))
    if (card) {
      const existing = byCard.get(card.id)
      if (existing) detachConnection(existing, true)

      selectedCard.value = card
      card.highlight = true
      dragMode.value = 'from-card'

      const line = new Line({
        x1: card.x + card.w / 2,
        y1: card.y + card.h / 2,
        x2: pt.x,
        y2: pt.y,
        color: '#3b82f6',
      })
      line.isTemporary = true
      activeLine.value = engine.add(line)
      return
    }

    // 2) ЗОНА (якорь)
    const anchorHit = zones.find(z => {
      const d = Math.hypot(pt.x - z.x, pt.y - z.y)
      const effectiveR = z.shape === 'rect' ? Math.max(z.w, z.h) / 2 : z.r
      return d <= Math.max(14, effectiveR * 0.25)
    })

    if (anchorHit) {
      const conn = byZone.get(anchorHit.id)

      if (conn) {
        // 2a) зона уже соединена — отвязываем конец линии
        conn.originalZoneId = anchorHit.id
        byZone.delete(anchorHit.id)
        connections.value = [...byCard.values()]

        draggingConn.value = conn
        dragMode.value = 'from-zone'
        activeLine.value = conn.line
        activeLine.value.isTemporary = true
        activeLine.value.color = '#3b82f6'
      } else {
        // 2b) зона свободна — новая линия от зоны к карточке
        selectedZone.value = anchorHit
        anchorHit.highlight = true
        dragMode.value = 'from-zone-new'

        const line = new Line({
          x1: anchorHit.x,
          y1: anchorHit.y,
          x2: pt.x,
          y2: pt.y,
          color: '#3b82f6',
        })
        line.isTemporary = true
        activeLine.value = engine.add(line)
      }
      return
    }
  }

  function onPointerMove(pt) {
    if (!activeLine.value) return

    if (dragMode.value === 'from-card' || dragMode.value === 'from-zone' || dragMode.value === 'from-zone-new') {
      activeLine.value.x2 = pt.x
      activeLine.value.y2 = pt.y
    }

    // подсветка зон (когда тянем от карточки)
    if (dragMode.value === 'from-card') {
      zones.forEach(z => {
        z.highlight = z.hitTest(pt.x, pt.y)
      })
    }

    // подсветка карточек (когда тянем от свободной зоны)
    if (dragMode.value === 'from-zone-new') {
      cards.forEach(c => {
        c.highlight = c.hitTest(pt.x, pt.y)
      })
    }
  }

  function onPointerUp(pt) {
    zones.forEach(z => { z.highlight = false })
    cards.forEach(c => { c.highlight = false })

    // === FROM-CARD ===
    if (dragMode.value === 'from-card' && activeLine.value) {
      const tmp = activeLine.value
      activeLine.value = null
      dragMode.value = null

      if (!selectedCard.value) {
        engine.remove(tmp)
        return
      }

      let targetZone = zones.find(z => z.hitTest(pt.x, pt.y))
      if (!targetZone) {
        let best = null, bestDist = Infinity
        for (const z of zones) {
          const d = Math.hypot(pt.x - z.x, pt.y - z.y)
          const effectiveR = z.shape === 'rect' ? Math.max(z.w, z.h) / 2 : z.r
          if (d <= effectiveR * 1.5 && d < bestDist) { best = z; bestDist = d }
        }
        targetZone = best
      }

      if (!targetZone) {
        animateLineTo(tmp, selectedCard.value.x + selectedCard.value.w / 2, selectedCard.value.y + selectedCard.value.h / 2, () => {
          engine.remove(tmp)
          if (returningLine === tmp) returningLine = null
        })
        returningLine = tmp
        selectedCard.value.highlight = false
        selectedCard.value = null
        return
      }

      const existingOnZone = byZone.get(targetZone.id)
      if (existingOnZone) detachConnection(existingOnZone, true)

      const existingOnCard = byCard.get(selectedCard.value.id)
      if (existingOnCard) detachConnection(existingOnCard, true)

      engine.remove(tmp)
      const isCorrect = isMatch(selectedCard.value, targetZone)
      const lineColor = autoCheck
        ? (isCorrect ? '#22c55e' : '#ef4444')
        : '#3b82f6'
      const line = new Line({
        x1: selectedCard.value.x + selectedCard.value.w / 2,
        y1: selectedCard.value.y + selectedCard.value.h / 2,
        x2: targetZone.x,
        y2: targetZone.y,
        color: lineColor,
        width: 4,
      })
      engine.add(line)

      const conn = {
        cardId: selectedCard.value.id,
        cardText: selectedCard.value.correctText,
        zoneId: targetZone.id,
        zoneText: targetZone.text,
        isCorrect,
        line,
        originalZoneId: targetZone.id,
      }
      byCard.set(conn.cardId, conn)
      byZone.set(conn.zoneId, conn)
      connections.value = [...byCard.values()]

      relocateCardFn(selectedCard.value, targetZone)

      selectedCard.value.highlight = false
      selectedCard.value = null
      return
    }

    // === FROM-ZONE (отвязываем конец существующей линии) ===
    if (dragMode.value === 'from-zone' && activeLine.value) {
      const conn = draggingConn.value
      const tmp = activeLine.value
      activeLine.value = null
      dragMode.value = null
      draggingConn.value = null

      if (!conn) {
        engine.remove(tmp)
        return
      }

      let targetZone = zones.find(z => z.hitTest(pt.x, pt.y))
      if (!targetZone) {
        let best = null, bestDist = Infinity
        for (const z of zones) {
          const d = Math.hypot(pt.x - z.x, pt.y - z.y)
          const effectiveR = z.shape === 'rect' ? Math.max(z.w, z.h) / 2 : z.r
          if (d <= effectiveR * 1.5 && d < bestDist) { best = z; bestDist = d }
        }
        targetZone = best
      }

      if (!targetZone || targetZone.id === conn.originalZoneId) {
        const origZone = zones.find(z => z.id === conn.originalZoneId)
        if (origZone) {
          animateLineTo(tmp, origZone.x, origZone.y, () => {
            tmp.isTemporary = false
            tmp.color = autoCheck
              ? (conn.isCorrect ? '#22c55e' : '#ef4444')
              : '#3b82f6'
            byZone.set(origZone.id, conn)
            connections.value = [...byCard.values()]
          })
        } else {
          byCard.delete(conn.cardId)
          connections.value = [...byCard.values()]
          engine.remove(tmp)
        }
        return
      }

      const existingOnZone = byZone.get(targetZone.id)
      if (existingOnZone) detachConnection(existingOnZone, true)

      conn.originalZoneId = targetZone.id
      conn.zoneId = targetZone.id
      conn.zoneText = targetZone.text
      conn.isCorrect = conn.cardText === targetZone.text
      tmp.x2 = targetZone.x
      tmp.y2 = targetZone.y
      tmp.color = autoCheck
        ? (conn.isCorrect ? '#22c55e' : '#ef4444')
        : '#3b82f6'
      tmp.isTemporary = false

      byZone.set(targetZone.id, conn)
      connections.value = [...byCard.values()]

      const card = cards.find(c => c.id === conn.cardId)
      if (card) relocateCardFn(card, targetZone)

      return
    }

    // === FROM-ZONE-NEW (от свободной зоны к карточке) ===
    if (dragMode.value === 'from-zone-new' && activeLine.value) {
      const tmp = activeLine.value
      activeLine.value = null
      dragMode.value = null

      if (!selectedZone.value) {
        engine.remove(tmp)
        return
      }

      let targetCard = cards.find(c => c.hitTest(pt.x, pt.y))

      // снап к ближайшей карточке
      if (!targetCard) {
        let best = null, bestDist = Infinity
        for (const c of cards) {
          const cx = c.x + c.w / 2
          const cy = c.y + c.h / 2
          const d = Math.hypot(pt.x - cx, pt.y - cy)
          if (d <= 60 && d < bestDist) { best = c; bestDist = d }
        }
        targetCard = best
      }

      if (!targetCard) {
        engine.remove(tmp)
        selectedZone.value.highlight = false
        selectedZone.value = null
        return
      }

      const existingOnZone = byZone.get(selectedZone.value.id)
      if (existingOnZone) detachConnection(existingOnZone, true)

      const existingOnCard = byCard.get(targetCard.id)
      if (existingOnCard) detachConnection(existingOnCard, true)

      engine.remove(tmp)

      const isCorrect = targetCard.correctText === selectedZone.value.text
      const lineColor = autoCheck
        ? (isCorrect ? '#22c55e' : '#ef4444')
        : '#3b82f6'
      const line = new Line({
        x1: targetCard.x + targetCard.w / 2,
        y1: targetCard.y + targetCard.h / 2,
        x2: selectedZone.value.x,
        y2: selectedZone.value.y,
        color: lineColor,
        width: 4,
      })
      engine.add(line)

      const conn = {
        cardId: targetCard.id,
        cardText: targetCard.correctText,
        zoneId: selectedZone.value.id,
        zoneText: selectedZone.value.text,
        isCorrect,
        line,
        originalZoneId: selectedZone.value.id,
      }
      byCard.set(conn.cardId, conn)
      byZone.set(conn.zoneId, conn)
      connections.value = [...byCard.values()]

      relocateCardFn(targetCard, selectedZone.value)

      selectedZone.value.highlight = false
      selectedZone.value = null
      return
    }

    // fallback
    if (activeLine.value) {
      engine.remove(activeLine.value)
      activeLine.value = null
    }
    dragMode.value = null
    draggingConn.value = null
    selectedCard.value = null
    selectedZone.value = null
  }

  function detachConnection(conn, animate = true) {
    if (!conn || !conn.line) return
    const line = conn.line
    byCard.delete(conn.cardId)
    byZone.delete(conn.zoneId)
    connections.value = [...byCard.values()]

    if (!animate) {
      engine.remove(line)
      return
    }

    const card = cards.find(c => c.id === conn.cardId)
    if (!card) {
      engine.remove(line)
      return
    }
    animateLineTo(line, card.x + card.w / 2, card.y + card.h / 2, () => engine.remove(line))
  }

  function checkAll() {
    let correct = 0
    byCard.forEach(conn => {
      const card = cards.find(c => c.id === conn.cardId)
      const zone = zones.find(z => z.id === conn.zoneId)
      if (!card || !zone) return
      const isCorrect = card.correctText === zone.text
      conn.isCorrect = isCorrect
      conn.line.color = isCorrect ? '#22c55e' : '#ef4444'
      if (isCorrect) correct++
    })
    return { correct, total: cards.length }
  }

  function animateLineTo(line, endX, endY, onDone) {
    line.isTemporary = false
    const startX = line.x2
    const startY = line.y2
    const duration = 220
    const t0 = performance.now()

    function frame(now) {
      const t = Math.min(1, (now - t0) / duration)
      const e = 1 - Math.pow(1 - t, 3)
      line.x2 = startX + (endX - startX) * e
      line.y2 = startY + (endY - startY) * e
      if (t < 1) requestAnimationFrame(frame)
      else onDone()
    }
    requestAnimationFrame(frame)
  }

  return {
    setup,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    checkAll,
    connections,
    activeLine,
    selectedCard,
    selectedZone,
    dragMode,
    draggingConn,
  }
}
