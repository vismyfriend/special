import { ref } from 'vue'
import { Line } from '../specialEngine/objects'
import { setupBoard } from './useConnectLineBoard'
import { createRelocate } from './useRelocate'
import { useSpellingCheck } from 'src/composables/specialSpellingCheck'

export function useConnectLineHardcore(engine, gameData) {
  const { lightCheck } = useSpellingCheck()

  const cards = []
  const zones = []
  let sideLists = { left: [], right: [], top: [] }
  let layoutSideFn = () => {}
  let estimateXFn = () => 0
  let estimateYFn = () => 0
  let isMobile = false
  let relocateCardFn = () => {}

  const inputs = ref({})
  const results = ref({})
  const zoneOwners = {}
  const cardLines = new Map()

  async function setup() {
    const difficulty = ref('hardcore')
    const board = await setupBoard(engine, gameData, {
      difficulty,
      hideCardText: true,
    })
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
      getLine: (cardId) => cardLines.get(cardId),
    })
    relocateCardFn = reloc.relocateCard

    cards.forEach(card => {
      inputs.value[card.id] = ''
      results.value[card.id] = undefined
    })
  }

  function getInputClass(cardId) {
    const r = results.value[cardId]
    if (r === true) return 'correct'
    if (r === false) return 'incorrect'
    return ''
  }

  function setInput(cardId, value) {
    inputs.value[cardId] = value
    results.value[cardId] = undefined
  }

  function clearCard(cardId) {
    inputs.value[cardId] = ''
    results.value[cardId] = undefined
    const line = cardLines.get(cardId)
    if (line) {
      engine.remove(line)
      cardLines.delete(cardId)
    }
    for (const zoneId in zoneOwners) {
      if (zoneOwners[zoneId] === cardId) {
        delete zoneOwners[zoneId]
      }
    }
  }

  function checkCard(cardId) {
    const card = cards.find(c => c.id === cardId)
    if (!card) return false

    const user = (inputs.value[cardId] || '').trim()

    if (!user) {
      clearCard(cardId)
      return false
    }

    let matchedZone = null
    for (const zone of zones) {
      if (lightCheck(user, [zone.text])) {
        matchedZone = zone
        break
      }
    }

    if (!matchedZone) {
      results.value[cardId] = false
      const oldLine = cardLines.get(cardId)
      if (oldLine) {
        engine.remove(oldLine)
        cardLines.delete(cardId)
      }
      for (const zoneId in zoneOwners) {
        if (zoneOwners[zoneId] === cardId) {
          delete zoneOwners[zoneId]
        }
      }
      return false
    }

    const previousOwner = zoneOwners[matchedZone.id]
    if (previousOwner && previousOwner !== cardId) {
      clearCard(previousOwner)
    }

    zoneOwners[matchedZone.id] = cardId
    results.value[cardId] = true

    let line = cardLines.get(cardId)
    if (line) {
      line.x1 = card.x + card.w
      line.y1 = card.y + card.h / 2
      line.x2 = matchedZone.x
      line.y2 = matchedZone.y
      line.color = '#22c55e'
    } else {
      line = new Line({
        x1: card.x + card.w,
        y1: card.y + card.h / 2,
        x2: matchedZone.x,
        y2: matchedZone.y,
        color: '#22c55e',
        width: 4,
      })
      cardLines.set(cardId, line)
      engine.add(line)
    }

    relocateCardFn(card, matchedZone)

    return true
  }

  function checkAll() {
    let correct = 0
    cards.forEach(card => {
      if (checkCard(card.id)) correct++
    })
    return { correct, total: cards.length }
  }

  return {
    setup,
    cards,
    zones,
    inputs,
    results,
    getInputClass,
    setInput,
    checkCard,
    checkAll,
  }
}
