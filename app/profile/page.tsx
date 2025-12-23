import ProfileForm from '@/components/ProfileForm';

// TODO: Replace with actual user authentication
// For now, we'll use a test user ID
const TEMP_USER_ID = 'test-user-123';

export default function ProfilePage() {
  return <ProfileForm userId={TEMP_USER_ID} />;
}