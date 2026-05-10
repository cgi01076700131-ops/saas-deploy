'use client'

import { useActionState, useState } from 'react'
import { login, signup, loginWithProvider } from './actions'

const initialState = {
  message: '',
  type: ''
}

export default function LoginForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, initialState)
  const [showPassword, setShowPassword] = useState(false)

  // Example of using OAuth (you can hook these into the buttons)
  const handleGoogleLogin = () => loginWithProvider('google')
  const handleKakaoLogin = () => loginWithProvider('kakao')

  const currentAction = mode === 'login' ? formAction : signupAction
  const currentPending = mode === 'login' ? isPending : isSignupPending
  const currentState = mode === 'login' ? state : signupState

  return (
    <div className="w-full max-w-md space-y-10">
      {/* Mobile Brand Logo */}
      <div className="lg:hidden flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">cloud</span>
          <span className="text-xl font-black text-on-surface tracking-tighter">CloudNote</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex p-1 bg-surface-container-low rounded-2xl relative">
        <button 
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 z-10 ${mode === 'login' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}
        >
          로그인
        </button>
        <button 
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 z-10 ${mode === 'signup' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-secondary hover:bg-surface-container-high'}`}
        >
          회원가입
        </button>
      </div>

      {/* Login Form Canvas */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface korean-headline">
            {mode === 'login' ? '반가워요! 다시 오셨군요.' : '환영합니다! 만나서 반가워요.'}
          </h2>
          <p className="text-sm text-secondary font-medium">
            {mode === 'login' ? '서비스 이용을 위해 로그인해주세요.' : '서비스 가입을 위해 계정을 생성해주세요.'}
          </p>
        </div>

        <form action={currentAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider" htmlFor="email">이메일 주소</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg transition-colors group-focus-within:text-primary">mail</span>
              <input 
                className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all placeholder:text-outline" 
                id="email" 
                name="email"
                placeholder="example@cloudnote.com" 
                type="email"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant px-1 uppercase tracking-wider" htmlFor="password">비밀번호</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg transition-colors group-focus-within:text-primary">lock</span>
              <input 
                className="w-full pl-12 pr-12 py-4 bg-surface-container-high border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-fixed-dim transition-all placeholder:text-outline" 
                id="password" 
                name="password"
                placeholder="비밀번호를 입력하세요" 
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
          
          {currentState?.message && (
             <div className={`text-sm font-semibold p-3 rounded-lg ${currentState.type === 'error' ? 'bg-error-container text-error' : 'bg-green-100 text-green-800'}`}>
               {currentState.message}
             </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  name="remember"
                  className="w-5 h-5 rounded-md border-outline-variant text-primary focus:ring-primary-fixed-dim focus:ring-offset-0" 
                  type="checkbox"
                />
                <span className="text-sm text-on-surface-variant font-medium group-hover:text-on-surface transition-colors">로그인 상태 유지</span>
              </label>
              <a className="text-sm font-semibold text-primary hover:underline" href="#">비밀번호 찾기</a>
            </div>
          )}

          <button 
            type="submit" 
            disabled={currentPending}
            className="w-full py-4 mt-2 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold text-base shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            {currentPending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                <span>{mode === 'login' ? '로그인 중...' : '가입 처리 중...'}</span>
              </>
            ) : (mode === 'login' ? '로그인' : '회원가입')}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center gap-4 py-4">
          <div className="flex-1 h-[1px] bg-outline-variant opacity-15"></div>
          <span className="text-xs font-bold text-outline uppercase tracking-widest">간편 로그인</span>
          <div className="flex-1 h-[1px] bg-outline-variant opacity-15"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 py-3 bg-surface-container-lowest border border-outline-variant/15 rounded-xl hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-sm font-semibold text-on-surface">Google</span>
          </button>
          <button 
            type="button"
            onClick={handleKakaoLogin}
            className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <svg className="w-5 h-5" fill="#3C1E1E" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.27 6.054l-1.085 3.98c-.04.15.047.307.19.34.053.01.107.01.16 0l4.675-3.102c.26.026.524.043.79.043 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"></path>
            </svg>
            <span className="text-sm font-semibold text-[#3C1E1E]">카카오톡</span>
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-10 flex flex-col items-center gap-4 border-t border-outline-variant/15">
        <div className="flex gap-6">
          <a className="text-xs font-medium text-outline hover:text-primary transition-colors" href="#">이용약관</a>
          <a className="text-xs font-medium text-outline hover:text-primary transition-colors" href="#">개인정보처리방침</a>
          <a className="text-xs font-medium text-outline hover:text-primary transition-colors" href="#">고객지원</a>
        </div>
        <p className="text-[10px] text-outline/60 font-medium">© {new Date().getFullYear()} CloudNote. All rights reserved.</p>
      </div>
    </div>
  )
}
