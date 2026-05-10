'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

type ActionState = { message?: string, type?: string } | null;

export async function login(prevState: ActionState, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return {
      message: '이메일 주소 또는 비밀번호가 올바르지 않습니다.',
      type: 'error'
    }
  }

  redirect('/dashboard')
}

export async function signup(prevState: ActionState, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return {
      message: '회원가입에 실패했습니다. 이미 가입된 이메일이거나 오류가 발생했습니다.',
      type: 'error'
    }
  }

  return {
    message: '회원가입이 완료되었습니다. 이메일 인증을 확인하시거나 바로 로그인해 주세요.',
    type: 'success'
  }
}

export async function loginWithProvider(provider: 'google' | 'kakao') {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data?.url) {
    redirect(data.url)
  }
}

