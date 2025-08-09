import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        avatar: true,
        isVerified: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireUserType = (userType) => {
  return (req, res, next) => {
    if (req.user.userType !== userType) {
      return res.status(403).json({ 
        message: `Access denied. ${userType} role required.` 
      });
    }
    next();
  };
};

export const updateUserStatus = async (req, res, next) => {
  if (req.user) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        isOnline: true,
        lastSeen: new Date()
      }
    });
  }
  next();
};
