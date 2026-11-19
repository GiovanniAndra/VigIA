'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function SignUpPage() {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [accepted,setAccepted]=useState(false)
  const [visible,setVisible]=useState(false)
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')
  const router=useRouter()
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setError('');if(password!==confirm){setError('As senhas não coincidem.');return}if(password.length<8){setError('Use ao menos 8 caracteres na senha.');return}if(!accepted){setError('Aceite os termos para continuar.');return}setBusy(true);const {data,error:authError}=await createClient().auth.signUp({email,password,options:{emailRedirectTo:process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL??`${window.location.origin}/auth/callback`,data:{display_name:name}}});setBusy(false);if(authError){const code=(authError as {code?:string;status?:number}).code;setError(authError.message.toLowerCase().includes('password')?'Use uma senha mais forte.':code==='over_request_rate_limit'?'Muitas tentativas. Aguarde um pouco e tente novamente.':'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.');return}if(data.session){router.push('/');router.refresh()}else setMessage('Conta criada. Confira seu e-mail para confirmar o cadastro e acessar a plataforma.')}
  return <main className="auth-shell"><div className="auth-glow"/><Link href="/" className="auth-back"><ArrowLeft size={16}/> Voltar à demonstração</Link><section className="auth-card"><div className="brand-mark"><ShieldCheck size={22}/></div><div className="eyebrow">SEU ESPAÇO MAIS SEGURO</div><h1>Crie sua conta</h1><p>Comece com o plano gratuito do VigIA.</p><form onSubmit={submit} className="auth-form"><label>Nome completo<input required autoComplete="name" placeholder="Como podemos te chamar?" value={name} onChange={e=>setName(e.target.value)}/></label><label>E-mail<input required type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Senha<div className="password-input"><input required minLength={8} type={visible?'text':'password'} autoComplete="new-password" placeholder="Mínimo de 8 caracteres" value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?'Ocultar senha':'Mostrar senha'}>{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label><label>Confirmar senha<input required type="password" autoComplete="new-password" placeholder="Digite a senha novamente" value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><label className="remember terms"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> Li e aceito os Termos de Uso e a Política de Privacidade.</label>{error&&<div className="form-error" role="alert">{error}</div>}{message&&<div className="form-success" role="status">{message}</div>}<button className="primary-button auth-submit" disabled={busy}>{busy?'Criando conta…':'Criar minha conta'}</button></form><div className="auth-foot">Já tem conta? <Link href="/auth/login">Entrar</Link></div><div className="auth-secure"><ShieldCheck size={14}/> Plano gratuito para começar</div></section><div className="auth-aside"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="auth-shield"><ShieldCheck size={76}/></div><div className="auth-aside-copy"><span className="status-dot"/> Segurança que começa com informação <span>Aprenda a reconhecer sinais antes que virem riscos.</span></div></div></main>
}
