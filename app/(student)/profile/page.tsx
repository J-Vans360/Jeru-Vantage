import ProfileForm from '@/components/ProfileForm';
import { getCurrentUserId } from '@/lib/auth-utils';

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  return <ProfileForm userId={userId} />;
}