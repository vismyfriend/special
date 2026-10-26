/**
 * ============================================================
 *  server/routes/auth.js
 * ------------------------------------------------------------
 *  Что это: POST /auth — логин/регистрация по username.
 *  Аналог у Егорчика: index.js, блок `app.post('/auth', ...)`
 *  (строки ~20–40 в его файле).
 *
 *  Логика 1-в-1 с Егорчиком:
 *   - username нет        → 400 { message: 'Username is required' }
 *   - юзера нет в БД      → создаём
 *   - юзер есть           → берём существующего
 *   - возвращаем JWT с payload { userId, username }, expiresIn: '100y'
 *     (да, у Егорчика именно '100y' — «100 лет», оставляем как есть)
 * ============================================================
 */

const express = require('express')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const router = express.Router()

router.post('/', async (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({ message: 'Username is required' })
  }

  try {
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    let user = userQuery.rows[0]

    if (!user) {
      const newUserQuery = await pool.query(
        'INSERT INTO users (username) VALUES ($1) RETURNING *',
        [username]
      )
      user = newUserQuery.rows[0]
    }

    // как у Егорчика: expiresIn: '100y'
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '100y' }
    )

    res.json({ token })
  } catch (err) {
    console.error('Ошибка при авторизации/регистрации:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
