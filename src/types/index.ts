export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: string;
  userId: string; // ID of the business user who owns this testimonial
  name: string;
  company?: string;
  title?: string;
  testimonial: string;
  rating?: number; // Optional rating (e.g., 1-5 stars)
  status: TestimonialStatus;
  createdAt: Date; // Or Firestore Timestamp
}

// Basic user structure, potentially expanded later
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add any other relevant user properties, e.g., subscription status
}
