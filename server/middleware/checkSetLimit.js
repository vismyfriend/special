const pool = require('../db')

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const userQuery = await pool.query('SELECT role, subscription_tier FROM users WHERE id = $1', [userId])
    const user = userQuery.rows[0]

    // Если подписчик — пропускаем (безлимит)
    if (user.subscription_tier === 'best_friend') {
      return next()
    }

    // Считаем текущие наборы пользователя
    const countQuery = await pool.query('SELECT COUNT(*) FROM word_sets WHERE user_id = $1', [userId])
    const currentCount = parseInt(countQuery.rows[0].count)

    // Лимиты: гость — 2, зарегистрированный — 5, подписчик — безлимит
    let maxLimit = 2
    if (user.role === 'registered') maxLimit = 5

    if (currentCount >= maxLimit) {
      return res.status(403).json({
        message: `Достигнут лимит наборов для вашего статуса (${maxLimit}). Оформите подписку, чтобы снять ограничение.`
      })
    }

    next()
  } catch (err) {
    console.error('Ошибка проверки лимита:', err)
    res.status(500).send('Server error')
  }
}
