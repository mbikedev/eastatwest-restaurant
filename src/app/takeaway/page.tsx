import { permanentRedirect } from 'next/navigation';

export default function TakeawayPage() {
  permanentRedirect('https://reservations.eastatwest.com/?tab=order');
}
