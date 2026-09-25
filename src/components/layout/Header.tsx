import { auth } from '@/lib/auth';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const session = await auth();
  
  return <HeaderClient session={session?.user as any} />;
}