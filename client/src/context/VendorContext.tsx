import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '@/services/supabase'

interface VendorProfile {
  id: string
  businessName?: string
  businessType?: string
  description?: string
  location?: {
    address?: string
    city?: string
    state?: string
    latitude?: number
    longitude?: number
  }
  contactEmail?: string
  contactPhone?: string
  website?: string
  logo?: string
  categories?: string[]
  verified: boolean
}

interface Service {
  id: string
  vendorId: string
  title: string
  description?: string
  category?: string
  price?: number
  priceType?: 'fixed' | 'hourly' | 'negotiable'
  available: boolean
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: string
  serviceId: string
  studentId: string
  studentName?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  bookingDate: string
  notes?: string
  createdAt: string
}

interface Review {
  id: string
  vendorId: string
  studentId: string
  studentName?: string
  rating: number
  comment?: string
  createdAt: string
}

interface Analytics {
  totalViews: number
  totalBookings: number
  completedBookings: number
  averageRating: number
  totalRevenue: number
  viewsThisMonth: number
  bookingsThisMonth: number
  revenueThisMonth: number
}

interface VendorContextType {
  profile: VendorProfile | null
  services: Service[]
  bookings: Booking[]
  reviews: Review[]
  analytics: Analytics | null
  loading: boolean
  updateVendorProfile: (updates: Partial<VendorProfile>) => Promise<{ error?: any }>
  addService: (service: Omit<Service, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>) => Promise<{ error?: any }>
  updateService: (serviceId: string, updates: Partial<Service>) => Promise<{ error?: any }>
  removeService: (serviceId: string) => Promise<{ error?: any }>
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<{ error?: any }>
  getAnalytics: () => Promise<void>
  refreshVendorData: () => Promise<void>
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

export function VendorProvider({ children }: { children: ReactNode }) {
  const { user, profile: authProfile } = useAuth()
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  const isVendor = authProfile?.role === 'vendor'

  const fetchVendorData = async () => {
    if (!user?.id || !isVendor || !supabase) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', user.id)
        .single()

      if (vendorData) {
        setProfile({
          id: vendorData.id,
          businessName: vendorData.business_name || authProfile?.business_name,
          businessType: vendorData.business_type || authProfile?.business_type,
          description: vendorData.description,
          location: vendorData.location,
          contactEmail: vendorData.contact_email,
          contactPhone: vendorData.contact_phone,
          website: vendorData.website,
          logo: vendorData.logo,
          categories: vendorData.categories || [],
          verified: vendorData.verified || false,
        })
      } else {
        setProfile({
          id: user.id,
          businessName: authProfile?.business_name,
          businessType: authProfile?.business_type,
          verified: false,
        })
      }

      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })

      if (servicesData) {
        setServices(servicesData.map(item => ({
          id: item.id,
          vendorId: item.vendor_id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          priceType: item.price_type,
          available: item.available,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })))
      }

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          students:student_id (
            first_name,
            last_name
          )
        `)
        .eq('vendor_id', user.id)
        .order('booking_date', { ascending: false })

      if (bookingsData) {
        setBookings(bookingsData.map(item => ({
          id: item.id,
          serviceId: item.service_id,
          studentId: item.student_id,
          studentName: item.students ? `${item.students.first_name} ${item.students.last_name}` : undefined,
          status: item.status,
          bookingDate: item.booking_date,
          notes: item.notes,
          createdAt: item.created_at,
        })))
      }

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          students:student_id (
            first_name,
            last_name
          )
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })

      if (reviewsData) {
        setReviews(reviewsData.map(item => ({
          id: item.id,
          vendorId: item.vendor_id,
          studentId: item.student_id,
          studentName: item.students ? `${item.students.first_name} ${item.students.last_name}` : undefined,
          rating: item.rating,
          comment: item.comment,
          createdAt: item.created_at,
        })))
      }

      await fetchAnalytics()
    } catch (error) {
      console.error('Error fetching vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    if (!user?.id || !supabase) return

    try {
      const { data: analyticsData } = await supabase
        .from('vendor_analytics')
        .select('*')
        .eq('vendor_id', user.id)
        .single()

      if (analyticsData) {
        setAnalytics({
          totalViews: analyticsData.total_views || 0,
          totalBookings: analyticsData.total_bookings || 0,
          completedBookings: analyticsData.completed_bookings || 0,
          averageRating: analyticsData.average_rating || 0,
          totalRevenue: analyticsData.total_revenue || 0,
          viewsThisMonth: analyticsData.views_this_month || 0,
          bookingsThisMonth: analyticsData.bookings_this_month || 0,
          revenueThisMonth: analyticsData.revenue_this_month || 0,
        })
      } else {
        setAnalytics({
          totalViews: 0,
          totalBookings: bookings.length,
          completedBookings: bookings.filter(b => b.status === 'completed').length,
          averageRating: reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0,
          totalRevenue: 0,
          viewsThisMonth: 0,
          bookingsThisMonth: 0,
          revenueThisMonth: 0,
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const updateVendorProfile = async (updates: Partial<VendorProfile>) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('vendors')
        .upsert({
          id: user.id,
          business_name: updates.businessName,
          business_type: updates.businessType,
          description: updates.description,
          location: updates.location,
          contact_email: updates.contactEmail,
          contact_phone: updates.contactPhone,
          website: updates.website,
          logo: updates.logo,
          categories: updates.categories,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        return { error }
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      return {}
    } catch (error) {
      return { error }
    }
  }

  const addService = async (service: Omit<Service, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          vendor_id: user.id,
          title: service.title,
          description: service.description,
          category: service.category,
          price: service.price,
          price_type: service.priceType,
          available: service.available,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return { error }
      }

      setServices(prev => [{
        id: data.id,
        vendorId: data.vendor_id,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        priceType: data.price_type,
        available: data.available,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }, ...prev])

      return {}
    } catch (error) {
      return { error }
    }
  }

  const updateService = async (serviceId: string, updates: Partial<Service>) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('services')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          price: updates.price,
          price_type: updates.priceType,
          available: updates.available,
          updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId)
        .eq('vendor_id', user.id)

      if (error) {
        return { error }
      }

      setServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      ))

      return {}
    } catch (error) {
      return { error }
    }
  }

  const removeService = async (serviceId: string) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('vendor_id', user.id)

      if (error) {
        return { error }
      }

      setServices(prev => prev.filter(s => s.id !== serviceId))
      return {}
    } catch (error) {
      return { error }
    }
  }

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    if (!user?.id || !supabase) {
      return { error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .eq('vendor_id', user.id)

      if (error) {
        return { error }
      }

      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status } : b
      ))

      return {}
    } catch (error) {
      return { error }
    }
  }

  const getAnalytics = async () => {
    await fetchAnalytics()
  }

  const refreshVendorData = async () => {
    await fetchVendorData()
  }

  useEffect(() => {
    if (isVendor) {
      fetchVendorData()
    } else {
      setProfile(null)
      setServices([])
      setBookings([])
      setReviews([])
      setAnalytics(null)
      setLoading(false)
    }
  }, [user?.id, isVendor])

  useEffect(() => {
    if (!user?.id || !isVendor || !supabase) return

    const servicesChannel = supabase
      .channel(`services_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
          filter: `vendor_id=eq.${user.id}`,
        },
        () => {
          fetchVendorData()
        }
      )
      .subscribe()

    const bookingsChannel = supabase
      .channel(`bookings_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `vendor_id=eq.${user.id}`,
        },
        () => {
          fetchVendorData()
        }
      )
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(servicesChannel)
        supabase.removeChannel(bookingsChannel)
      }
    }
  }, [user?.id, isVendor])

  const value: VendorContextType = {
    profile,
    services,
    bookings,
    reviews,
    analytics,
    loading,
    updateVendorProfile,
    addService,
    updateService,
    removeService,
    updateBookingStatus,
    getAnalytics,
    refreshVendorData,
  }

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
}

export function useVendor() {
  const context = useContext(VendorContext)
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider')
  }
  return context
}
