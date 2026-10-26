/**
 * ============================================================
 *  server/middleware/authenticateToken.js
 * ------------------------------------------------------------
 *  Что это: middleware проверки JWT. Читает заголовок
 *  `Authorization: Bearer <token>`, проверяет подпись,
 *  кладёт payload в `req.user`.
 *  Аналог у Егорчика: index.js, блок `const authenticateToken = ...`
 *  (строки ~42–58 в его файле).
 *
 *  Контракт 1-в-1 с Егорчиком:
 *   - нет токена         → 401 { message: 'Token is required' }
 *   - токен невалиден    → 403 { message: 'Invalid token' }
 *   - валиден            → req.user = { userId, username }, next()
 * ============================================================
 */

const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token is required' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

module.exports = authenticateToken
