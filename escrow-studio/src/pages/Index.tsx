
import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ProfileCard } from '@/components/shared/ProfileCard';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { ContestCard } from '@/components/shared/ContestCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserMode } from '@/context/UserModeContext';

// Sample data for demonstration
const topFreelancers = [
  {
    id: '1',
    name: 'Jessica Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    title: 'UI/UX Designer & Brand Strategist',
    rating: 4.9,
    reviewCount: 156,
    location: 'San Francisco, USA',
    hourlyRate: 85,
    tags: ['UI/UX Design', 'Branding', 'Wireframing'],
    featured: true
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    title: 'Full Stack Developer',
    rating: 4.8,
    reviewCount: 142,
    location: 'Toronto, Canada',
    hourlyRate: 75,
    tags: ['React', 'Node.js', 'MongoDB'],
    featured: false
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    title: 'Content Strategist & Copywriter',
    rating: 4.7,
    reviewCount: 98,
    location: 'London, UK',
    hourlyRate: 65,
    tags: ['Copywriting', 'Content Strategy', 'SEO'],
    featured: false
  }
];

const topProjects = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Looking for an experienced UI/UX designer to redesign our e-commerce platform with a focus on improving conversion rates and user experience.',
    budget: { min: 2000, max: 5000 },
    duration: '2-4 weeks',
    location: 'Remote',
    tags: ['UI/UX Design', 'E-commerce', 'Figma'],
    proposals: 12,
    postedTime: '2 days ago',
    clientInfo: {
      name: 'TechSolutions Inc.',
      avatar: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
      verified: true
    },
    featured: true
  },
  {
    id: '2',
    title: 'Mobile App Development - iOS & Android',
    description: 'We need a skilled developer to build native mobile applications for both iOS and Android platforms for our fitness tracking service.',
    budget: { min: 5000, max: 10000 },
    duration: '2-3 months',
    location: 'Remote',
    tags: ['Mobile Development', 'iOS', 'Android'],
    proposals: 8,
    postedTime: '3 days ago',
    clientInfo: {
      name: 'FitTrack',
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      verified: true
    },
    featured: false
  },
  {
    id: '3',
    title: 'Content Writing for Tech Blog',
    description: 'Seeking a content writer with technology background to create weekly blog posts about emerging tech trends and innovations.',
    budget: { min: 500, max: 1000 },
    duration: 'Ongoing',
    location: 'Remote',
    tags: ['Content Writing', 'Technology', 'SEO'],
    proposals: 15,
    postedTime: '1 day ago',
    clientInfo: {
      name: 'TechInsider',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      verified: false
    },
    featured: false
  }
];

const activeContests = [
  {
    id: '1',
    title: 'Logo Design for Sustainable Fashion Brand',
    description: 'Create a modern, minimalist logo for our sustainable fashion brand that embodies eco-friendly values and premium quality.',
    prize: 1000,
    deadline: 'Jul 15, 2023',
    timeLeft: '5 days left',
    entries: 24,
    category: 'Logo Design',
    featured: true
  },
  {
    id: '2',
    title: 'Mobile App UI Design',
    description: 'Design a clean, intuitive user interface for a wellness and meditation mobile application targeting young professionals.',
    prize: 800,
    deadline: 'Jul 10, 2023',
    timeLeft: '8 hours left',
    entries: 15,
    category: 'UI Design',
    featured: false
  },
  {
    id: '3',
    title: 'Product Name and Tagline',
    description: 'Help us name our new smart home device and create a catchy tagline that highlights its innovative features and benefits.',
    prize: 500,
    deadline: 'Jul 20, 2023',
    timeLeft: '10 days left',
    entries: 42,
    category: 'Naming & Taglines',
    featured: false
  }
];

const Index = () => {
  const { mode } = useUserMode();
  
  return (
    <>
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      
      {/* Top Freelancers Section */}
      {mode === 'client' && (
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Top Freelancers</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Discover our highest-rated freelancers with proven skills and experience in their fields.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/freelancers">
                  View All Freelancers
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {topFreelancers.map((freelancer) => (
                <ProfileCard 
                  key={freelancer.id}
                  {...freelancer}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Top Projects Section */}
      {mode === 'freelancer' && (
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Browse our selection of high-quality projects looking for skilled freelancers like you.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/projects">
                  View All Projects
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {topProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  {...project}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Active Contests Section */}
      <section className="py-20 bg-secondary">
        <div className="container px-4 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Active Contests</h2>
              <p className="text-muted-foreground max-w-2xl">
                {mode === 'client' 
                  ? 'Start a contest to receive multiple creative options for your project.' 
                  : 'Showcase your skills and win prizes in our active design and creative contests.'}
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/contests">
                {mode === 'client' ? 'Start a Contest' : 'View All Contests'}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeContests.map((contest) => (
              <ContestCard 
                key={contest.id}
                {...contest}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-20 bg-primary/5 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-background -z-10"></div>
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {mode === 'client' 
                ? 'Ready to find the perfect freelancer for your project?' 
                : 'Ready to showcase your skills and find great projects?'}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {mode === 'client' 
                ? 'Join thousands of businesses who have already found and hired top talent on EscrowStudio.' 
                : 'Join our community of freelancers and start earning from projects that match your skills and interests.'}
            </p>
            <Button size="lg" className="rounded-full px-8">
              {mode === 'client' ? 'Post a Project Now' : 'Create Your Profile'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
