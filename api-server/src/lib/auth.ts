import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function getUserFromToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (e) {
    return null;
  }
}