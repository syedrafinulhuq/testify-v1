'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, User, Building, Briefcase, Star } from 'lucide-react'; // Import icons
import { Rating } from '@/components/ui/rating'; // Assume Rating component exists

// Placeholder function for submitting data - replace with actual Firestore write
async function submitTestimonialToDB(userId: string, data: any) {
  console.log(`Submitting for user ${userId}:`, data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Throw error randomly to test error handling
  // if (Math.random() > 0.7) {
  //   throw new Error("Failed to submit testimonial. Please try again.");
  // }
  return { success: true };
}


export default function TestimonialSubmitPage() {
  const params = useParams();
  const userId = params.userId as string; // Get userId from URL
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined); // Optional rating state
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonial.trim() || !name.trim()) {
       toast({
        title: 'Missing Information',
        description: 'Please provide your name and testimonial.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
       const submissionData = {
         name,
         company,
         title,
         testimonial,
         rating,
         status: 'pending', // Default status
         createdAt: new Date(),
       };
      await submitTestimonialToDB(userId, submissionData); // Pass userId
      setSubmitted(true);
      toast({ title: 'Thank You!', description: 'Your testimonial has been submitted successfully.' });
    } catch (error: any) {
      console.error('Submission Error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Could not submit your testimonial. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

   if (!userId) {
     return (
       <div className="flex min-h-screen items-center justify-center p-4">
         <p>Invalid submission link.</p>
       </div>
     );
   }


  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background p-4 text-center">
         <Card className="w-full max-w-md shadow-lg">
           <CardHeader>
              <CardTitle className="text-2xl text-accent">Success!</CardTitle>
               <CardDescription>Your feedback is valuable.</CardDescription>
           </CardHeader>
           <CardContent>
            <p className="text-lg">Thank you for submitting your testimonial!</p>
            <p className="text-muted-foreground mt-2">It will be reviewed shortly.</p>
            {/* Optionally link back to the business's website */}
           </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Share Your Experience</CardTitle>
          <CardDescription className="text-center">
            Your feedback helps others and is greatly appreciated!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <div className="space-y-2">
                  <Label htmlFor="name"><User className="mr-2 inline-block h-4 w-4 text-primary" /> Your Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company"><Building className="mr-2 inline-block h-4 w-4 text-primary" /> Company (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="e.g., Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={loading}
                  />
                </div>
             </div>
             <div className="space-y-2">
              <Label htmlFor="title"><Briefcase className="mr-2 inline-block h-4 w-4 text-primary" /> Your Title (Optional)</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Marketing Manager"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testimonial"><Send className="mr-2 inline-block h-4 w-4 text-primary" /> Your Testimonial *</Label>
              <Textarea
                id="testimonial"
                placeholder="Tell us about your experience..."
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                required
                rows={5}
                disabled={loading}
              />
            </div>
             <div className="space-y-2">
              <Label><Star className="mr-2 inline-block h-4 w-4 text-primary" /> Rating (Optional)</Label>
              {/* Replace with actual Rating component */}
               <Rating value={rating} onChange={setRating} disabled={loading} />
              {/* <p className="text-sm text-muted-foreground">Placeholder for Rating Component</p> */}
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={loading}>
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-accent-foreground"></div>
              ) : (
                <>
                  Submit Testimonial
                </>
              )}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground text-center">
           <p className="w-full">Your submission will be reviewed before publishing.</p>
         </CardFooter>
      </Card>
    </div>
  );
}
