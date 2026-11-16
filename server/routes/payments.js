const express = require('express')
const pool = require('../db')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

// ЗАГЛУШКА: Имитация успешной оплаты подписки
// В будущем здесь будет интеграция с ЮKassa и вебхуки
router.post('/mock-success', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Ставим подписку на 30 дней
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)

    await pool.query(
      `UPDATE users
       SET subscription_tier = 'best_friend', subscription_end_date = $1
       WHERE id = $2`,
      [endDate, userId]
    )

    // Записываем "платеж" в историю
    await pool.query(
      `INSERT INTO payments (user_id, amount, status, external_id)
       VALUES ($1, 0, 'success', 'mock_payment_123')`,
      [userId]
    )

    res.json({ message: 'Подписка Best Friend успешно активирована (тест)', endDate })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
