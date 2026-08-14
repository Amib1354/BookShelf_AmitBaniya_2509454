import { verifyToken } from '../utils/jwt.js'

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies?.jwtToken

  if (!token)
    return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).json({ error: 'Invalid Token' })
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' })
  }
}

export default authenticate
