
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
      'Verified freelancers with proven skills',
      'Secure escrow payment protection',
      'Professional moderation to ensure quality'
    ],
    freelancer: [
      'Access to high-quality projects',
      'Fair payment guaranteed by escrow',
      'Professional support from moderators'
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
              'Find the perfect freelancer for your next project' : 
              'Find the perfect projects to showcase your skills'}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {mode === 'client' ? 
              'Connect with top talent in a secure environment with escrow payment protection and professional moderation.' : 
              'Get hired by clients looking for your specific skills, with guaranteed payments and professional support.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <div className={cn(
              "relative flex items-center w-full max-w-md",
              "subtle-shadow rounded-full bg-white border border-input transition-all duration-300 overflow-hidden",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
            )}>
              <input
                type="text"
                placeholder={mode === 'client' ? "What type of freelancer do you need?" : "What skills are you offering?"}
                className="flex-1 px-6 py-3 bg-transparent border-0 outline-none focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1 rounded-full">
                Search
              </Button>
            </div>
            
            <Button asChild size="lg" className="rounded-full px-6 gap-2 whitespace-nowrap">
              <Link to={mode === 'client' ? "/projects" : "/projects"}>
                {mode === 'client' ? "Post a Project" : "Find Work"}
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
              Trusted by over <span className="text-primary">50,000+</span> freelancers and clients worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
