import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/services/supabase'

interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalVendors: number
  totalNotes: number
  totalProjects: number
  totalEvents: number
  activeUsers: number
  newUsersThisMonth: number
  totalRevenue: number
}

interface PendingApproval {
  id: string
  type: 'note' | 'project' | 'vendor' | 'event'
  itemId: string
  submittedBy: string
  submitterName?: string
  title?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
}

interface FlaggedContent {
  id: string
  type: 'note' | 'project' | 'comment' | 'review'
  itemId: string
  reason: string
  reportedBy: string
  reporterName?: string
  reportedAt: string
  status: 'pending' | 'resolved' | 'dismissed'
}

interface AdminActivity {
  id: string
  adminId: string
  adminName?: string
  action: string
  targetType?: string
  targetId?: string
  timestamp: string
  details?: any
}

interface AdminContextType {
  stats: SystemStats | null
  pendingApprovals: PendingApproval[]
  flaggedContent: FlaggedContent[]
  activityLog: AdminActivity[]
  loading: boolean
  getSystemStats: () => Promise<void>
  getPendingApprovals: () => Promise<void>
  approveContent: (approvalId: string, itemType: string, itemId: string) => Promise<{ error?: any }>
  rejectContent: (approvalId: string, reason?: string) => Promise<{ error?: any }>
  resolveFlaggedContent: (flagId: string, action: 'remove' | 'keep', notes?: string) => Promise<{ error?: any }>
  dismissFlag: (flagId: string) => Promise<{ error?: any }>
  refreshAdminData: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, profile: authProfile } = useAuth()
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([])
  const [activityLog, setActivityLog] = useState<AdminActivity[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = authProfile?.role === 'admin'

  const fetchAdminData = async () => {
    if (!user?.id || !isAdmin || !supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      await Promise.all([
        fetchSystemStats(),
        fetchPendingApprovals(),
        fetchFlaggedContent(),
        fetchActivityLog(),
      ])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSystemStats = async () => {
    if (!supabase) return

    try {
      const [
        { count: totalUsers },
        { count: totalStudents },
        { count: totalVendors },
        { count: totalNotes },
        { count: totalProjects },
        { count: totalEvents },
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'vendor'),
        supabase.from('notes').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
      ])

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: activeUsers } = await supabase
        .from('student_activity')
        .select('student_id', { count: 'exact', head: true })
        .gte('timestamp', thirtyDaysAgo.toISOString())

      const { count: newUsersThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

      setStats({
        totalUsers: totalUsers || 0,
        totalStudents: totalStudents || 0,
        totalVendors: totalVendors || 0,
        totalNotes: totalNotes || 0,
        totalProjects: totalProjects || 0,
        totalEvents: totalEvents || 0,
        activeUsers: activeUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        totalRevenue: 0,
      })
    } catch (error) {
      console.error('Error fetching system stats:', error)
    }
  }

  const fetchPendingApprovals = async () => {
    if (!supabase) return

    try {
      const { data } = await supabase
        .from('approvals')
        .select(`
          *,
          users:submitted_by (
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false })

      if (data) {
        setPendingApprovals(data.map(item => ({
          id: item.id,
          type: item.type,
          itemId: item.item_id,
          submittedBy: item.submitted_by,
          submitterName: item.users ? `${item.users.first_name} ${item.users.last_name}` : undefined,
          title: item.title,
          status: item.status,
          submittedAt: item.submitted_at,
        })))
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error)
    }
  }

  const fetchFlaggedContent = async () => {
    if (!supabase) return

    try {
      const { data } = await supabase
        .from('flagged_content')
        .select(`
          *,
          users:reported_by (
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('reported_at', { ascending: false })

      if (data) {
        setFlaggedContent(data.map(item => ({
          id: item.id,
          type: item.type,
          itemId: item.item_id,
          reason: item.reason,
          reportedBy: item.reported_by,
          reporterName: item.users ? `${item.users.first_name} ${item.users.last_name}` : undefined,
          reportedAt: item.reported_at,
          status: item.status,
        })))
      }
    } catch (error) {
      console.error('Error fetching flagged content:', error)
    }
  }

  const fetchActivityLog = async () => {
    if (!supabase) return

    try {
      const { data } = await supabase
        .from('admin_activity')
        .select(`
          *,
          admins:admin_id (
            first_name,
            last_name
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(50)

      if (data) {
        setActivityLog(data.map(item => ({
          id: item.id,
          adminId: item.admin_id,
          adminName: item.admins ? `${item.admins.first_name} ${item.admins.last_name}` : undefined,
          action: item.action,
          targetType: item.target_type,
          targetId: item.target_id,
          timestamp: item.timestamp,
          details: item.details,
        })))
      }
    } catch (error) {
      console.error('Error fetching activity log:', error)
    }
  }

  const logAdminActivity = async (action: string, targetType?: string, targetId?: string, details?: any) => {
    if (!user?.id || !supabase) return

    try {
      await supabase.from('admin_activity').insert({
        admin_id: user.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        timestamp: new Date().toISOString(),
      })

      await fetchActivityLog()
    } catch (error) {
      console.error('Error logging admin activity:', error)
    }
  }

  const getSystemStats = async () => {
    await fetchSystemStats()
  }

  const getPendingApprovals = async () => {
    await fetchPendingApprovals()
  }

  const approveContent = async (approvalId: string, itemType: string, itemId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error: approvalError } = await supabase
        .from('approvals')
        .update({ 
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', approvalId)

      if (approvalError) {
        return { error: approvalError }
      }

      const tableMap: Record<string, string> = {
        note: 'notes',
        project: 'projects',
        vendor: 'vendors',
        event: 'events',
      }

      const tableName = tableMap[itemType]
      if (tableName) {
        await supabase
          .from(tableName)
          .update({ approved: true })
          .eq('id', itemId)
      }

      setPendingApprovals(prev => prev.filter(a => a.id !== approvalId))
      
      await logAdminActivity('approve_content', itemType, itemId, { approvalId })

      return {}
    } catch (error) {
      return { error }
    }
  }

  const rejectContent = async (approvalId: string, reason?: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('approvals')
        .update({ 
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', approvalId)

      if (error) {
        return { error }
      }

      setPendingApprovals(prev => prev.filter(a => a.id !== approvalId))
      
      await logAdminActivity('reject_content', 'approval', approvalId, { reason })

      return {}
    } catch (error) {
      return { error }
    }
  }

  const resolveFlaggedContent = async (flagId: string, action: 'remove' | 'keep', notes?: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const flag = flaggedContent.find(f => f.id === flagId)
      if (!flag) {
        return { error: 'Flag not found' }
      }

      if (action === 'remove') {
        const tableMap: Record<string, string> = {
          note: 'notes',
          project: 'projects',
          comment: 'comments',
          review: 'reviews',
        }

        const tableName = tableMap[flag.type]
        if (tableName) {
          await supabase
            .from(tableName)
            .delete()
            .eq('id', flag.itemId)
        }
      }

      const { error } = await supabase
        .from('flagged_content')
        .update({ 
          status: 'resolved',
          resolved_by: user.id,
          resolved_at: new Date().toISOString(),
          resolution: action,
          resolution_notes: notes,
        })
        .eq('id', flagId)

      if (error) {
        return { error }
      }

      setFlaggedContent(prev => prev.filter(f => f.id !== flagId))
      
      await logAdminActivity('resolve_flag', flag.type, flag.itemId, { flagId, action, notes })

      return {}
    } catch (error) {
      return { error }
    }
  }

  const dismissFlag = async (flagId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('flagged_content')
        .update({ 
          status: 'dismissed',
          resolved_by: user.id,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', flagId)

      if (error) {
        return { error }
      }

      setFlaggedContent(prev => prev.filter(f => f.id !== flagId))
      
      await logAdminActivity('dismiss_flag', 'flag', flagId)

      return {}
    } catch (error) {
      return { error }
    }
  }

  const refreshAdminData = async () => {
    await fetchAdminData()
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData()
    } else {
      setStats(null)
      setPendingApprovals([])
      setFlaggedContent([])
      setActivityLog([])
      setLoading(false)
    }
  }, [user?.id, isAdmin])

  useEffect(() => {
    if (!user?.id || !isAdmin || !supabase) return

    const approvalsChannel = supabase
      .channel('admin_approvals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'approvals',
        },
        () => {
          fetchPendingApprovals()
        }
      )
      .subscribe()

    const flagsChannel = supabase
      .channel('admin_flags')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'flagged_content',
        },
        () => {
          fetchFlaggedContent()
        }
      )
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(approvalsChannel)
        supabase.removeChannel(flagsChannel)
      }
    }
  }, [user?.id, isAdmin])

  const value: AdminContextType = {
    stats,
    pendingApprovals,
    flaggedContent,
    activityLog,
    loading,
    getSystemStats,
    getPendingApprovals,
    approveContent,
    rejectContent,
    resolveFlaggedContent,
    dismissFlag,
    refreshAdminData,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
