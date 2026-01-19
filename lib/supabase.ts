import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Track page view for analytics
 */
export async function trackPageView(pagePath: string) {
  const { error } = await supabase.from('page_views').insert({
    bu_name: 'HughMann.life',
    page_path: pagePath,
    referrer: typeof window !== 'undefined' ? document.referrer : null,
    user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
  })

  if (error) {
    console.error('Failed to track page view:', error)
  }
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(email: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      email,
      bu_name: 'HughMann.life',
      status: 'pending', // Will be 'active' after email confirmation
    })
    .select()

  return { data, error }
}

/**
 * Get newsletter subscriber count for this BU
 */
export async function getSubscriberCount() {
  const { count, error } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('bu_name', 'HughMann.life')
    .eq('status', 'active')

  if (error) {
    console.error('Failed to get subscriber count:', error)
    return 0
  }

  return count || 0
}
