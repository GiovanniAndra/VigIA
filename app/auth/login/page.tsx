'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password })
    setBusy(false)
    if (authError) {
      const code = (authError as { code?: string }).code
      setError(code === 'email_not_confirmed' ? 'Confirme seu e-mail pelo link enviado à sua caixa de entrada.' : code === 'invalid_credentials' ? 'E-mail ou senha inválidos.' : authError.status === 429 ? 'Muitas tentativas. Aguarde um pouco e tente novamente.' : 'Não foi possível entrar. Tente novamente.')
      return
    }
    router.push(new URLSearchParams(window.location.search).get('next') || '/')
    router.refresh()
  }

  return <main className="auth-shell"><div className="auth-glow"/><Link href="/" className="auth-back"><ArrowLeft size={16}/> Voltar à demonstração</Link><section className="auth-card"><div className="brand-mark"><ShieldCheck size={22}/></div><div className="eyebrow">VIGIA · PROTEÇÃO DIGITAL</div><h1>Bem-vindo de volta</h1><p>Acesse sua conta e continue protegendo seu ambiente digital.</p><form onSubmit={submit} className="auth-form"><label>E-mail<input type="email" autoComplete="email" required placeholder="voce@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Senha<div className="password-input"><input type={showPassword?'text':'password'} autoComplete="current-password" required placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label><div className="auth-row"><span className="remember">Sessão protegida</span><Link href="/auth/recuperar">Esqueci minha senha</Link></div>{error&&<div className="form-error" role="alert">{error}</div>}<button className="primary-button auth-submit" disabled={busy}>{busy?'Entrando…':'Entrar na plataforma'}</button></form><div className="auth-foot">Ainda não tem uma conta? <Link href="/auth/cadastro">Criar conta gratuita</Link></div><div className="auth-secure"><ShieldCheck size={14}/> Seus dados são protegidos com segurança</div></section><div className="auth-aside"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="auth-shield"><ShieldCheck size={76}/></div><div className="auth-aside-copy"><span className="status-dot"/> Monitoramento ativo <span>Uma camada extra de cuidado para sua vida digital.</span></div></div></main>
}
