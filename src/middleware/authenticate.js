import { verifyToken } from '../utils/jwt.js'

const authenticate = (req, res, next) => {
  const token = req.headers.authorization
  if (!token || !token.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = verifyToken(token.split(' ')[1])
    if (!decoded) return res.status(401).json({ error: 'Invalid Token' })
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' })
  }
}

export default authenticate
