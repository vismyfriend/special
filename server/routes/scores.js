/**
 * ============================================================
 *  server/routes/scores.js
 * ------------------------------------------------------------
 *  Что это: GET /scores и POST /scores — рекорды игр.
 *  Аналог у Егорчика: index.js, блоки
 *   - app.get('/scores', authenticateToken, ...)   (~60–105)
 *   - app.post('/scores', authenticateToken, ...)  (~107–150)
 *
 *  Контракт 1-в-1 с Егорчиком.
 *
 *  ⚠️ ВАЖНО про wordSet:
 *  - В БД колонка называется `wordset` (всё маленькими, без кавычек).
 *    Это как у Егорчика — он пишет `wordSet` в SQL без кавычек, а
 *    Postgres приводит идентификаторы к lowercase → получается `wordset`.
 *  - В JS/JSON поле называется `wordSet` (camelCase) — так его ждёт фронт
 *    и так его отдаёт Егорчик (`wordSet: row.wordset`).
 *  - Это НЕ путаница, это так и задумано. При миграции с БД Егорчика
 *    pg_dump → импорт пройдёт без переименований.
 * ============================================================
 */

const express = require('express')
const pool = require('../db')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

// ---------- GET /scores ----------
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { game } = req.query

    let query = 'SELECT * FROM scores'
    let params = []

    if (game) {
      query += ' WHERE game_name = $1'
      params.push(game)
    }

    const { rows } = await pool.query(query, params)

    // Если запрошена конкретная игра — плоский массив
    if (game) {
      return res.json(
        rows.map((row) => ({
          agent: row.agent,
          time: row.time,
          mistakes: row.mistakes,
          wordSet: row.wordset, // как у Егорчика: row.wordset → wordSet
        }))
      )
    }

    // Иначе — сгруппировано по игре
    const scoresByGame = {}
    rows.forEach((row) => {
      if (!scoresByGame[row.game_name]) {
        scoresByGame[row.game_name] = []
      }
      scoresByGame[row.game_name].push({
        agent: row.agent,
        time: row.time,
        mistakes: row.mistakes,
        wordSet: row.wordset,
      })
    })

    res.json(scoresByGame)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// ---------- POST /scores ----------
router.post('/', authenticateToken, async (req, res) => {
  const { game, time, mistakes, agent, wordSet } = req.body

  // как у Егорчика: проверка «хотя бы одно поле задано» (поведение сохранено 1-в-1)
  if ((game ?? time ?? mistakes ?? agent ?? wordSet) === undefined) {
    return res
      .status(400)
      .json({ message: 'Game, time, mistakes and agent are required' })
  }

  try {
    // как у Егорчика: ищем существующий результат
    const existingResult = await pool.query(
      'SELECT * FROM scores WHERE game_name = $1 AND agent = $2 AND wordSet = $3',
      [game, agent, wordSet]
    )

    if (existingResult.rows.length > 0) {
      const currentRecord = existingResult.rows[0]

      if (time < currentRecord.time) {
        // Лучше — обновляем
        await pool.query(
          'UPDATE scores SET time = $1, mistakes = $2 WHERE id = $3',
          [time, mistakes, currentRecord.id]
        )
        res.json({
          message: 'Рекорд обновлен',
          record: { agent, time, mistakes },
        })
      } else {
        // Хуже — не трогаем
        res.json({ message: 'Рекорд не побит', record: currentRecord })
      }
    } else {
      // Нет записи — создаём
      await pool.query(
        'INSERT INTO scores (game_name, agent, time, mistakes, wordSet) VALUES ($1, $2, $3, $4, $5)',
        [game, agent, time, mistakes, wordSet]
      )
      res.json({ message: 'Рекорд добавлен', record: { agent, time, mistakes } })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
