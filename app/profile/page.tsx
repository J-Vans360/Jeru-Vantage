import ProfileForm from '@/components/ProfileForm';
// For now, we'll use a hardcoded user ID
// Later, you'll get this from your auth system
const TEMP_USER_ID = 'test-user-123';
export default function ProfilePage() {
return (
<div>
<ProfileForm userId={TEMP_USER_ID} />
</div>
);
}