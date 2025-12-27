import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { checkSuperAdmin } from '@/lib/super-admin'
import SuperAdminSidebar from '@/components/super-admin/SuperAdminSidebar'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session?.user?.email) {
    redirect('/login?callbackUrl=/super-admin')
  }

  const access = await checkSuperAdmin(session.user.id, session.user.email)

  if (!access.isSuper) {
    redirect('/?error=access_denied')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SuperAdminSidebar
        user={{
          name: session.user.name || 'Admin',
          email: session.user.email,
          role: access.role || 'admin'
        }}
        permissions={access.permissions}
      />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
