import { permanentRedirect } from 'next/navigation';

export default function ReservationsPage() {
  permanentRedirect('https://reservations.eastatwest.com/?tab=reserve');
}
