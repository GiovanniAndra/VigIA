import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import VigiaDashboard from '@/components/vigia-dashboard'
import { redirect } from 'next/navigation'

export default async function Home({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const [{ section }, cookieStore] = await Promise.all([searchParams, cookies()])
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookieOptions: { secure: process.env.NODE_ENV === 'production' },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => { try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && ['my-reports', 'settings', 'plans'].includes(section ?? '')) {
    redirect(`/auth/login?next=${encodeURIComponent(section === 'my-reports' ? '/minhas-denuncias' : section === 'settings' ? '/configuracoes' : '/meu-plano')}`)
  }
  return <VigiaDashboard initialSection={section} user={user ? { id:user.id, email:user.email??'', name:String(user.user_metadata?.display_name??user.user_metadata?.name??user.email?.split('@')[0]??'Pessoa') } : null}/>
}
