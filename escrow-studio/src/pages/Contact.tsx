
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(20, { message: 'Message must be at least 20 characters' }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [freelancerInfo, setFreelancerInfo] = useState({
    id: searchParams.get('freelancer') || '',
    name: searchParams.get('name') || '',
  });
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      subject: freelancerInfo.name ? `Project inquiry for ${freelancerInfo.name}` : '',
      message: '',
    },
  });
  
  // Update form values when user or freelancer info changes
  useEffect(() => {
    form.setValue('name', user?.name || '');
    form.setValue('email', user?.email || '');
    if (freelancerInfo.name) {
      form.setValue('subject', `Project inquiry for ${freelancerInfo.name}`);
    }
  }, [user, freelancerInfo, form]);

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form data:', data);
    console.log('Sending message to freelancer ID:', freelancerInfo.id);
    
    toast({
      title: 'Message sent',
      description: 'Your message has been sent successfully.',
    });
    
    // If we came from a freelancer profile, go back there
    if (freelancerInfo.id) {
      navigate(`/profile/${freelancerInfo.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Contact {freelancerInfo.name || 'Us'}</h1>
          <p className="text-muted-foreground">
            {freelancerInfo.name 
              ? `Send a message to ${freelancerInfo.name} about your project.`
              : "Have a question or inquiry? Send us a message and we'll get back to you."}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll respond as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          placeholder="Enter your message here..."
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
