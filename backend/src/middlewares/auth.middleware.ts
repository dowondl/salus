import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../dtos/auth.dto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export interface CustomRequest extends Request {
  user?: TokenPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

export default authMiddleware;