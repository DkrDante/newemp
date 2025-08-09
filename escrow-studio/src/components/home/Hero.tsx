
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useUserMode } from '@/context/UserModeContext';
import { cn } from '@/lib/utils';

export function Hero() {
  const { mode } = useUserMode();
  const [searchQuery, setSearchQuery] = useState('');
  
  const heroPoints = {
    client: [
      'KYC verified Indian freelancers',
      'Secure payments with UPI/Razorpay integration',
      'AI-powered matching for better results'
    ],
    freelancer: [
      'Local and remote opportunities',
      'Guaranteed payments via escrow system',
      'Skill-based job recommendations'
    ]
  };
  
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background -z-10"></div>
      <div className="absolute right-0 top-1/4 w-1/2 aspect-square rounded-full bg-primary/5 blur-3xl -z-10"></div>
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
            {mode === 'client' ? 
              'Hire skilled freelancers from across India' : 
              'Discover your next gig opportunity in India'}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {mode === 'client' ? 
              'Connect with talented professionals in design, development, writing, photography and more. Secure payments through escrow, guaranteed quality.' : 
              'Join India\'s fastest-growing freelance platform. Find projects that match your skills with secure payments and local support.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className={cn(
              "relative flex items-center w-full max-w-md",
              "subtle-shadow rounded-full bg-card border border-border transition-all duration-300 overflow-hidden",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
            )}>
              <input
                type="text"
                placeholder={mode === 'client' ? "Search for designers, developers, writers..." : "Search for web development, logo design..."}
                className="flex-1 px-6 py-3 bg-transparent border-0 outline-none focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1 rounded-full">
                Search
              </Button>
            </div>
            
            <Button asChild size="lg" className="rounded-full px-6 gap-2 whitespace-nowrap">
              <Link to={mode === 'client' ? "/post-project" : "/projects"}>
                {mode === 'client' ? "Post a Project" : "Find Jobs"}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {heroPoints[mode].map((point, index) => (
              <div key={index} className="flex items-center text-sm text-muted-foreground">
                <CheckCircle size={16} className="text-primary mr-2" />
                {point}
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative max-w-5xl mx-auto animate-scale-in">
          <div className="glass rounded-2xl overflow-hidden subtle-shadow">
            <img 
              src="/hero-image.jpg" 
              alt="Empleaadora" 
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-full subtle-shadow">
            <p className="text-sm font-medium text-center">
              Trusted by over <span className="text-primary">25,000+</span> freelancers and clients across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
