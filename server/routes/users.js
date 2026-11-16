const express = require('express')
const pool = require('../db')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

// Получить свой профиль
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { rows } = await pool.query(
      'SELECT id, username, email, phone, role, subscription_tier, subscription_end_date, avatar_url, avatar_preset_id FROM users WHERE id = $1',
      [userId]
    )
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' })

    const user = rows[0]
    // Добавим подсчет наборов
    const countQuery = await pool.query('SELECT COUNT(*) FROM word_sets WHERE user_id = $1', [userId])
    user.sets_count = parseInt(countQuery.rows[0].count)

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
