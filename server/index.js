/**
 * ============================================================
 *  server/index.js — точка входа
 * ------------------------------------------------------------
 *  Что это: Express-приложение, монтирует роуты и служебные
 *  эндпоинты /health, /test, /db.
 *
 *  Аналог у Егорчика: весь его index.js целиком.
 *  Отличия от Егорчика:
 *   - порт 3001 (у Егорчика 3000) — чтобы не конфликтовать
 *   - роуты /auth и /scores вынесены в отдельные файлы
 *   - пул БД вынесен в db.js
 *   - middleware вынесен в middleware/authenticateToken.js
 *  Контракт всех эндпоинтов — 1-в-1 с Егорчиком.
 * ============================================================
 */

const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db')
const authRouter = require('./routes/auth')
const scoresRouter = require('./routes/scores')

const app = express()
const port = process.env.PORT || 3001 // у Егорчика 3000, у нас 3001

app.use(cors({
  origin: [
    'http://localhost:9000',        // для локальной разработки
    'http://localhost:8080',        // на всякий случай (другой порт)
    'https://www.vismyfriend.ru',   // твой рабочий сайт
    'https://vismyfriend.ru'        // без www (тоже полезно)
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.options('*', cors()) // важно для preflight

app.use(express.json())

// ---------- Роуты ----------
app.use('/auth', authRouter)
app.use('/scores', scoresRouter)

// ---------- Служебные эндпоинты (как у Егорчика) ----------
app.get('/test', async (req, res) => {
  res.send('Test!')
})

app.get('/db', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users')
    const scores = await pool.query('SELECT * FROM scores')
    res.json({
      users: users.rows,
      scores: scores.rows,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.status(200).send('DB connection OK')
  } catch (err) {
    res.status(500).send('DB connection FAILED')
  }
})

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`)
})
