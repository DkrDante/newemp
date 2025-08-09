import { prisma } from '../lib/db.js';
import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  budget: z.number().positive(),
  minBudget: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateJobSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  budget: z.number().positive().optional(),
  minBudget: z.number().positive().optional(),
  maxBudget: z.number().positive().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
});

export const createJob = async (req, res) => {
  try {
    const body = req.body;
    const parsedBody = createJobSchema.safeParse(body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: "Invalid Request", 
        error: parsedBody.error 
      });
    }

    const job = await prisma.job.create({
      data: {
        ...body,
        userId: req.user.id,
        tags: body.tags ? JSON.stringify(body.tags) : "[]"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });

    res.status(201).json({ 
      message: "Job created successfully",
      job 
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      location, 
      minBudget,
      maxBudget,
      status,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search } }
      ];
    }

    if (category) {
      where.category = category;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minBudget) {
      where.budget = { gte: parseFloat(minBudget) };
    }

    if (maxBudget) {
      where.budget = { ...where.budget, lte: parseFloat(maxBudget) };
    }

    if (status) {
      where.status = status;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isVerified: true
            }
          },
          _count: {
            select: {
              proposals: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
            rating: true,
            reviewCount: true
          }
        },
        _count: {
          select: {
            proposals: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Increment view count
    await prisma.job.update({
      where: { id: parseInt(id) },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ job });
  } catch (error) {
    console.error('Get job by id error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const parsedBody = updateJobSchema.safeParse(body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: "Invalid Request", 
        error: parsedBody.error 
      });
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: body,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true
          }
        }
      }
    });

    res.json({ 
      message: "Job updated successfully",
      job: updatedJob 
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await prisma.job.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        _count: {
          select: {
            proposals: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobCategories = async (req, res) => {
  try {
    const categories = await prisma.job.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        category: { not: null }
      }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get job categories error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
