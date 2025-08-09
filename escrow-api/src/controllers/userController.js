import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';
import { signupSchema, signinSchema, updateProfileSchema } from '../schema/user.schema.js';

export const signup = async (req, res) => {
  try {
    const body = req.body;
    const parsedBody = signupSchema.safeParse(body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: "Invalid Request", 
        error: parsedBody.error 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
        skills: body.skills ? JSON.stringify(body.skills) : "[]"
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        avatar: true,
        bio: true,
        location: true,
        skills: true,
        hourlyRate: true,
        rating: true,
        reviewCount: true,
        isVerified: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || "secret",
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: "User created successfully",
      token, 
      user 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  try {
    const body = req.body;
    const parsedBody = signinSchema.safeParse(body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: "Invalid Request", 
        error: parsedBody.error 
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Update online status
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        isOnline: true,
        lastSeen: new Date()
      }
    });

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || "secret",
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ 
      message: "Login successful",
      token, 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        avatar: true,
        bio: true,
        location: true,
        skills: true,
        hourlyRate: true,
        rating: true,
        reviewCount: true,
        isVerified: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: true,
            proposals: true,
            portfolio: true,
            reviews: true
          }
        }
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const body = req.body;
    const parsedBody = updateProfileSchema.safeParse(body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: "Invalid Request", 
        error: parsedBody.error 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: body.name,
        bio: body.bio,
        location: body.location,
        skills: body.skills ? JSON.stringify(body.skills) : undefined,
        hourlyRate: body.hourlyRate,
        avatar: body.avatar
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        avatar: true,
        bio: true,
        location: true,
        skills: true,
        hourlyRate: true,
        rating: true,
        reviewCount: true,
        isVerified: true,
        updatedAt: true
      }
    });

    res.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFreelancers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      skills, 
      location, 
      minRating,
      maxHourlyRate,
      isVerified 
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {
      userType: 'freelancer'
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { skills: { contains: search } }
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',');
      where.skills = { 
        contains: skillsArray.map(skill => `"${skill}"`).join('|')
      };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (maxHourlyRate) {
      where.hourlyRate = { lte: parseFloat(maxHourlyRate) };
    }

    if (isVerified === 'true') {
      where.isVerified = true;
    }

    const [freelancers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
          location: true,
          skills: true,
          hourlyRate: true,
          rating: true,
          reviewCount: true,
          isVerified: true,
          isOnline: true,
          lastSeen: true,
          createdAt: true,
          _count: {
            select: {
              portfolio: true,
              reviews: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { rating: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      freelancers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        isOnline: false,
        lastSeen: new Date()
      }
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
