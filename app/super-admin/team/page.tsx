'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Shield, Mail, Trash2 } from 'lucide-react'

interface TeamMember {
  id: string
  email: string
  name: string | null
  role: 'owner' | 'admin' | 'support'
  createdAt: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'support'>('admin')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/super-admin/team')
      const data = await res.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Failed to fetch team:', error)
    } finally {
      setLoading(false)
    }
  }

  const inviteMember = async () => {
    if (!inviteEmail) return
    setInviting(true)
    try {
      await fetch('/api/super-admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      })
      setInviteEmail('')
      setShowInvite(false)
      fetchTeam()
    } catch (error) {
      console.error('Failed to invite:', error)
    } finally {
      setInviting(false)
    }
  }

  const removeMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return
    try {
      await fetch(`/api/super-admin/team/${id}`, { method: 'DELETE' })
      fetchTeam()
    } catch (error) {
      console.error('Failed to remove:', error)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      support: 'bg-gray-100 text-gray-800'
    }
    return styles[role as keyof typeof styles] || styles.support
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">Manage super admin access</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'admin' | 'support')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="admin">Admin - Full access</option>
                  <option value="support">Support - Read-only access</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={inviteMember}
                disabled={inviting || !inviteEmail}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {inviting ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Owners Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Owners</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">Owners are configured in the codebase and have full access.</p>
        <div className="space-y-3">
          {['reacher.ca@gmail.com', 'bijilyr@gmail.com'].map((email) => (
            <div key={email} className="flex items-center justify-between py-3 px-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">{email}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge('owner')}`}>
                Owner
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No additional team members yet</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{member.name || member.email}</p>
                    {member.name && <p className="text-sm text-gray-500">{member.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(member.role)}`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
