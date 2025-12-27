import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAdminSchool } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/admin');
  }

  const adminRecord = await getAdminSchool(session.user.id);

  if (!adminRecord) {
    redirect('/signup'); // Redirect to signup page
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar
          school={adminRecord.school}
          role={adminRecord.role}
          userName={session.user.name || 'Admin'}
        />
        <main className="flex-1 p-8 ml-64">{children}</main>
      </div>
    </div>
  );
}
