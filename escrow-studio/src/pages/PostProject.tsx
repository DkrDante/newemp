
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

const projectFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  budgetType: z.enum(['fixed', 'hourly'], { required_error: 'Please select a budget type' }),
  budgetMin: z.string().min(1, { message: 'Please enter a minimum budget' }),
  budgetMax: z.string().min(1, { message: 'Please enter a maximum budget' }),
  duration: z.string().min(1, { message: 'Please select a duration' }),
  skills: z.string().min(3, { message: 'Please enter required skills' }),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

const categories = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing & Translation' },
  { value: 'marketing', label: 'Digital Marketing' },
  { value: 'video', label: 'Video & Animation' },
  { value: 'audio', label: 'Music & Audio' },
  { value: 'business', label: 'Business' },
  { value: 'programming', label: 'Programming & Tech' },
];

const durations = [
  { value: 'less-than-1-week', label: 'Less than 1 week' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '2-4-weeks', label: '2-4 weeks' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'more-than-6-months', label: 'More than 6 months' },
  { value: 'ongoing', label: 'Ongoing project' },
];

const PostProject = () => {
  const navigate = useNavigate();
  
  // Redirect if not logged in
  if (!user?.isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      budgetType: 'fixed',
      budgetMin: '',
      budgetMax: '',
      duration: '',
      skills: '',
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    console.log('Project data:', data);
    
    toast({
      title: 'Project posted successfully',
      description: 'Your project is now live and visible to freelancers',
    });
    
    navigate('/projects');
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Project</h1>
          <p className="text-muted-foreground">
            Describe your project to find the perfect freelancer
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide detailed information to attract the right talents for your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. WordPress Website Development for a Real Estate Agency"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Describe your project in detail, including goals, requirements, and any specific details freelancers should know."
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="budgetType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Budget Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <label htmlFor="fixed" className="text-sm font-medium leading-none">
                              Fixed Price
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hourly" id="hourly" />
                            <label htmlFor="hourly" className="text-sm font-medium leading-none">
                              Hourly Rate
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="budgetMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Budget ($)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" placeholder="500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budgetMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Budget ($)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" placeholder="1000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder="e.g. WordPress, PHP, Web Design, MySQL"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
                    Cancel
                  </Button>
                  <Button type="submit">Post Project</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostProject;
