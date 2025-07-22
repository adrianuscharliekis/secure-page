// app/not-found.js
import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect any 'not found' paths to the unauthorized page.
  redirect('/unauthorized');
  
  return null;
}