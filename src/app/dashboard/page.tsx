'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link as LinkIcon, Copy, Eye, Settings, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Testimonial, TestimonialStatus } from '@/types'; // Assuming types are defined
import { useToast } from '@/hooks/use-toast';


// Mock data - Replace with actual data fetching
const mockTestimonials: Testimonial[] = [
  { id: '1', userId: 'abc', name: 'Alice Smith', company: 'Acme Corp', title: 'CEO', testimonial: 'Testify is amazing! So easy to use.', status: 'approved', createdAt: new Date(2023, 10, 15) },
  { id: '2', userId: 'abc', name: 'Bob Johnson', testimonial: 'Helped us gather valuable feedback.', status: 'pending', createdAt: new Date(2023, 10, 20) },
  { id: '3', userId: 'abc', name: 'Charlie Brown', company: 'Innovate Ltd', testimonial: 'Great tool for social proof.', status: 'approved', createdAt: new Date(2023, 10, 18) },
  { id: '4', userId: 'abc', name: 'Diana Prince', testimonial: 'Needs more customization options.', status: 'rejected', createdAt: new Date(2023, 10, 22) },
];


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Mock state for testimonials - replace with actual state management (e.g., useState, useReducer, Zustand, React Query)
   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
   const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true); // Add loading state

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

   // Simulate data fetching
  useEffect(() => {
    if (user) {
      setIsLoadingTestimonials(true);
      // Replace with actual Firestore fetch
      setTimeout(() => {
         setTestimonials(mockTestimonials);
         setIsLoadingTestimonials(false);
      }, 1500); // Simulate network delay
    }
  }, [user]); // Fetch when user is available

  const getShareableLink = () => {
    // In a real app, this would fetch/generate the user-specific link
    return `${window.location.origin}/submit/${user?.uid || 'your-unique-id'}`;
  };

   const getEmbedCode = () => {
    // In a real app, this would fetch/generate the user-specific embed code
    const userId = user?.uid || 'your-unique-id';
    return `<script src="${window.location.origin}/widget.js" data-user-id="${userId}" async defer></script>`;
   }

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({ title: 'Copied!', description: message });
      })
      .catch(err => {
        toast({ title: 'Copy Failed', description: 'Could not copy to clipboard.', variant: 'destructive' });
        console.error('Clipboard copy failed:', err);
      });
  };

   // Mock action handlers - replace with actual Firestore updates
   const handleApprove = (id: string) => {
    console.log("Approving testimonial:", id);
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    toast({ title: "Testimonial Approved" });
    // Add Firestore update logic here
  };

  const handleReject = (id: string) => {
    console.log("Rejecting testimonial:", id);
     setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
     toast({ title: "Testimonial Rejected", variant: "destructive" });
    // Add Firestore update logic here
  };

   const handleDelete = (id: string) => {
    console.log("Deleting testimonial:", id);
    // Add confirmation dialog here in a real app
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast({ title: "Testimonial Deleted", variant: "destructive" });
    // Add Firestore delete logic here
  };


  if (loading || !user) {
    // Show loading state or redirect handled by useEffect
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
           <Skeleton className="h-96 w-full max-w-4xl" />
        </div>
        <Footer />
      </div>
    );
  }

  const shareableLink = getShareableLink();
  const embedCode = getEmbedCode();

  const getStatusBadgeVariant = (status: TestimonialStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'approved': return 'default'; // Greenish in default theme potentially via accent
      case 'pending': return 'secondary'; // Yellowish/Grayish
      case 'rejected': return 'destructive'; // Reddish
      default: return 'outline';
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold">Welcome, {user.displayName || 'User'}!</h1>

          {/* Quick Actions Section */}
          <section className="mb-8 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" /> Your Testimonial Link
                </CardTitle>
                <CardDescription>Share this link with your customers to collect testimonials.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Input type="text" value={shareableLink} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(shareableLink, 'Shareable link copied!')}>
                  <Copy className="h-4 w-4" />
                   <span className="sr-only">Copy Link</span>
                </Button>
                 <Button variant="outline" size="icon" asChild>
                   <a href={shareableLink} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Preview Link</span>
                   </a>
                 </Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                   Embed Widget Code
                </CardTitle>
                <CardDescription>Copy and paste this script into your website's HTML.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                 <Input type="text" value={embedCode} readOnly className="flex-1 text-xs" />
                 <Button variant="outline" size="icon" onClick={() => copyToClipboard(embedCode, 'Embed code copied!')}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy Code</span>
                </Button>
                 {/* Add Preview functionality if possible */}
              </CardContent>
            </Card>
          </section>

           {/* Testimonials Management Section */}
           <section>
            <Card>
              <CardHeader>
                <CardTitle>Manage Testimonials</CardTitle>
                 <CardDescription>Review, approve, or reject submitted testimonials.</CardDescription>
              </CardHeader>
              <CardContent>
                 {isLoadingTestimonials ? (
                   <div className="space-y-4">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                   </div>
                 ) : testimonials.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No testimonials submitted yet. Share your link!</p>
                 ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Company</TableHead>
                      <TableHead>Testimonial</TableHead>
                      <TableHead>Status</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell className="font-medium">{testimonial.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{testimonial.company || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{testimonial.testimonial}</TableCell>
                        <TableCell>
                           <Badge variant={getStatusBadgeVariant(testimonial.status)} className="capitalize">{testimonial.status}</Badge>
                        </TableCell>
                         <TableCell className="text-right space-x-1">
                           {testimonial.status === 'pending' && (
                              <>
                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleApprove(testimonial.id)}>
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleReject(testimonial.id)}>
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </>
                           )}
                             {testimonial.status !== 'pending' && (
                               <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" onClick={() => handleDelete(testimonial.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                             )}
                             {/* Add view/edit button maybe */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 )}
              </CardContent>
            </Card>
           </section>

            {/* Add other dashboard sections like Settings, Analytics etc. later */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
