import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/services/supabase'

interface StudentProfile {
  id: string
  university?: string
  course?: string
  year?: string
  stream?: string
  subjects?: string[]
  bio?: string
}

interface PersonalizationFilters {
  stream?: string
  year?: string
  subjects?: string[]
  university?: string
}

interface SavedNote {
  id: string
  noteId: string
  savedAt: string
}

interface SavedProject {
  id: string
  projectId: string
  savedAt: string
}

interface RecentActivity {
  id: string
  type: 'note_view' | 'project_view' | 'event_rsvp' | 'vendor_bookmark'
  itemId: string
  timestamp: string
}

interface StudentContextType {
  profile: StudentProfile | null
  filters: PersonalizationFilters
  savedNotes: SavedNote[]
  savedProjects: SavedProject[]
  recentActivity: RecentActivity[]
  loading: boolean
  updateStudentProfile: (updates: Partial<StudentProfile>) => Promise<{ error?: any }>
  setPersonalizationFilters: (filters: PersonalizationFilters) => void
  addSavedNote: (noteId: string) => Promise<{ error?: any }>
  removeSavedNote: (noteId: string) => Promise<{ error?: any }>
  addSavedProject: (projectId: string) => Promise<{ error?: any }>
  removeSavedProject: (projectId: string) => Promise<{ error?: any }>
  refreshStudentData: () => Promise<void>
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: ReactNode }) {
  const { user, profile: authProfile } = useAuth()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [filters, setFilters] = useState<PersonalizationFilters>({})
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([])
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const isStudent = authProfile?.role === 'student'

  const fetchStudentData = async () => {
    if (!user?.id || !isStudent || !supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const studentProfile: StudentProfile = {
        id: user.id,
        university: authProfile?.university,
        course: authProfile?.course,
        year: authProfile?.year,
        stream: authProfile?.course,
        subjects: [],
      }

      setProfile(studentProfile)

      const storedFilters = localStorage.getItem(`student_filters_${user.id}`)
      if (storedFilters) {
        setFilters(JSON.parse(storedFilters))
      } else {
        setFilters({
          stream: studentProfile.stream,
          year: studentProfile.year,
          university: studentProfile.university,
        })
      }

      const { data: notesData } = await supabase
        .from('saved_notes')
        .select('*')
        .eq('student_id', user.id)
        .order('saved_at', { ascending: false })

      if (notesData) {
        setSavedNotes(notesData.map(item => ({
          id: item.id,
          noteId: item.note_id,
          savedAt: item.saved_at,
        })))
      }

      const { data: projectsData } = await supabase
        .from('saved_projects')
        .select('*')
        .eq('student_id', user.id)
        .order('saved_at', { ascending: false })

      if (projectsData) {
        setSavedProjects(projectsData.map(item => ({
          id: item.id,
          projectId: item.project_id,
          savedAt: item.saved_at,
        })))
      }

      const { data: activityData } = await supabase
        .from('student_activity')
        .select('*')
        .eq('student_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(20)

      if (activityData) {
        setRecentActivity(activityData.map(item => ({
          id: item.id,
          type: item.type,
          itemId: item.item_id,
          timestamp: item.timestamp,
        })))
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStudentProfile = async (updates: Partial<StudentProfile>) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          university: updates.university,
          course: updates.course,
          year: updates.year,
        })
        .eq('id', user.id)

      if (error) {
        return { error }
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      return {}
    } catch (error) {
      return { error }
    }
  }

  const setPersonalizationFilters = (newFilters: PersonalizationFilters) => {
    setFilters(newFilters)
    if (user?.id) {
      localStorage.setItem(`student_filters_${user.id}`, JSON.stringify(newFilters))
    }
  }

  const addSavedNote = async (noteId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { data, error } = await supabase
        .from('saved_notes')
        .insert({
          student_id: user.id,
          note_id: noteId,
          saved_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return { error }
      }

      setSavedNotes(prev => [{
        id: data.id,
        noteId: data.note_id,
        savedAt: data.saved_at,
      }, ...prev])

      return {}
    } catch (error) {
      return { error }
    }
  }

  const removeSavedNote = async (noteId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('saved_notes')
        .delete()
        .eq('student_id', user.id)
        .eq('note_id', noteId)

      if (error) {
        return { error }
      }

      setSavedNotes(prev => prev.filter(item => item.noteId !== noteId))
      return {}
    } catch (error) {
      return { error }
    }
  }

  const addSavedProject = async (projectId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { data, error } = await supabase
        .from('saved_projects')
        .insert({
          student_id: user.id,
          project_id: projectId,
          saved_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return { error }
      }

      setSavedProjects(prev => [{
        id: data.id,
        projectId: data.project_id,
        savedAt: data.saved_at,
      }, ...prev])

      return {}
    } catch (error) {
      return { error }
    }
  }

  const removeSavedProject = async (projectId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('saved_projects')
        .delete()
        .eq('student_id', user.id)
        .eq('project_id', projectId)

      if (error) {
        return { error }
      }

      setSavedProjects(prev => prev.filter(item => item.projectId !== projectId))
      return {}
    } catch (error) {
      return { error }
    }
  }

  const refreshStudentData = async () => {
    await fetchStudentData()
  }

  useEffect(() => {
    if (isStudent) {
      fetchStudentData()
    } else {
      setProfile(null)
      setFilters({})
      setSavedNotes([])
      setSavedProjects([])
      setRecentActivity([])
      setLoading(false)
    }
  }, [user?.id, isStudent])

  useEffect(() => {
    if (!user?.id || !isStudent || !supabase) return

    const notesChannel = supabase
      .channel(`saved_notes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_notes',
          filter: `student_id=eq.${user.id}`,
        },
        () => {
          fetchStudentData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(notesChannel)
    }
  }, [user?.id, isStudent])

  const value: StudentContextType = {
    profile,
    filters,
    savedNotes,
    savedProjects,
    recentActivity,
    loading,
    updateStudentProfile,
    setPersonalizationFilters,
    addSavedNote,
    removeSavedNote,
    addSavedProject,
    removeSavedProject,
    refreshStudentData,
  }

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return context
}
