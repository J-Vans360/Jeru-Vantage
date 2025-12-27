import { prisma } from './prisma'

// Hardcoded owner emails (always have access - case insensitive)
const OWNER_EMAILS = [
  'reacher.ca@gmail.com',
  'bijilyr@gmail.com'
].map(email => email.toLowerCase())

// Initial admin emails
const ADMIN_EMAILS = [
  'jerushareacher@gmail.com'
].map(email => email.toLowerCase())

export type SuperAdminRole = 'owner' | 'admin' | 'support' | null

export interface SuperAdminAccess {
  isSuper: boolean
  role: SuperAdminRole
  permissions: SuperAdminPermissions
}

export interface SuperAdminPermissions {
  viewDashboard: boolean
  viewSchools: boolean
  viewSponsors: boolean
  viewStudents: boolean
  viewAnalytics: boolean
  viewRevenue: boolean
  verifySchools: boolean
  verifySponsors: boolean
  editLimits: boolean
  applyDiscounts: boolean
  createPromoCodes: boolean
  addNotes: boolean
  managePricing: boolean
  manageSettings: boolean
  manageTeam: boolean
  deleteEntities: boolean
}

const ROLE_PERMISSIONS: Record<string, SuperAdminPermissions> = {
  owner: {
    viewDashboard: true,
    viewSchools: true,
    viewSponsors: true,
    viewStudents: true,
    viewAnalytics: true,
    viewRevenue: true,
    verifySchools: true,
    verifySponsors: true,
    editLimits: true,
    applyDiscounts: true,
    createPromoCodes: true,
    addNotes: true,
    managePricing: true,
    manageSettings: true,
    manageTeam: true,
    deleteEntities: true
  },
  admin: {
    viewDashboard: true,
    viewSchools: true,
    viewSponsors: true,
    viewStudents: true,
    viewAnalytics: true,
    viewRevenue: false,
    verifySchools: true,
    verifySponsors: true,
    editLimits: true,
    applyDiscounts: true,
    createPromoCodes: true,
    addNotes: true,
    managePricing: false,
    manageSettings: false,
    manageTeam: false,
    deleteEntities: false
  },
  support: {
    viewDashboard: true,
    viewSchools: true,
    viewSponsors: true,
    viewStudents: true,
    viewAnalytics: false,
    viewRevenue: false,
    verifySchools: false,
    verifySponsors: false,
    editLimits: false,
    applyDiscounts: false,
    createPromoCodes: false,
    addNotes: true,
    managePricing: false,
    manageSettings: false,
    manageTeam: false,
    deleteEntities: false
  }
}

const EMPTY_PERMISSIONS: SuperAdminPermissions = {
  viewDashboard: false,
  viewSchools: false,
  viewSponsors: false,
  viewStudents: false,
  viewAnalytics: false,
  viewRevenue: false,
  verifySchools: false,
  verifySponsors: false,
  editLimits: false,
  applyDiscounts: false,
  createPromoCodes: false,
  addNotes: false,
  managePricing: false,
  manageSettings: false,
  manageTeam: false,
  deleteEntities: false
}

export async function checkSuperAdmin(userId: string, email: string): Promise<SuperAdminAccess> {
  const normalizedEmail = email.toLowerCase().trim()

  console.log('[super-admin] Checking email:', normalizedEmail)
  console.log('[super-admin] Owner emails:', OWNER_EMAILS)
  console.log('[super-admin] Is owner?', OWNER_EMAILS.includes(normalizedEmail))

  // Check 1: Hardcoded owners (always works, even if DB is empty)
  if (OWNER_EMAILS.includes(normalizedEmail)) {
    console.log('[super-admin] ✅ User is OWNER')
    return {
      isSuper: true,
      role: 'owner',
      permissions: ROLE_PERMISSIONS.owner
    }
  }

  // Check 2: Hardcoded admins (fallback)
  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    console.log('[super-admin] ✅ User is ADMIN')
    return {
      isSuper: true,
      role: 'admin',
      permissions: ROLE_PERMISSIONS.admin
    }
  }

  // Check 3: Database table (for future team members)
  try {
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { userId }
    })

    if (superAdmin && superAdmin.isActive) {
      console.log('[super-admin] ✅ User found in SuperAdmin table')
      const role = superAdmin.role as SuperAdminRole
      const basePermissions = ROLE_PERMISSIONS[role || 'support']

      return {
        isSuper: true,
        role,
        permissions: basePermissions
      }
    }
  } catch (error) {
    console.error('[super-admin] Database check error:', error)
  }

  console.log('[super-admin] ❌ User is NOT super admin')
  return {
    isSuper: false,
    role: null,
    permissions: EMPTY_PERMISSIONS
  }
}

export function hasPermission(
  access: SuperAdminAccess,
  permission: keyof SuperAdminPermissions
): boolean {
  return access.isSuper && access.permissions[permission] === true
}
