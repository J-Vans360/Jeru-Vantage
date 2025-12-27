import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudentNav from '@/components/StudentNav'
import { SessionProvider } from '@/components/SessionProvider'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50">
        <StudentNav />
        <main>{children}</main>
      </div>
    </SessionProvider>
  )
}
