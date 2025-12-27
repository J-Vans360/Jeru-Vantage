import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SponsorSidebar from '@/components/sponsor/SponsorSidebar'

export default async function SponsorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/sponsor')
  }

  // Check if user is a sponsor admin
  const sponsorAdmin = await prisma.sponsorAdmin.findFirst({
    where: { userId: session.user.id },
    include: { sponsor: true }
  })

  if (!sponsorAdmin) {
    redirect('/setup-sponsor')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SponsorSidebar
        sponsor={sponsorAdmin.sponsor}
        role={sponsorAdmin.role}
        userName={session.user.name || 'Admin'}
      />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
