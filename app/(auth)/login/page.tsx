import LoginForm from './LoginForm'
import Image from 'next/image'

export const metadata = {
  title: '로그인 | CloudNote',
  description: 'CloudNote 서비스에 로그인하세요.',
}

export default function LoginPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex overflow-hidden">
      {/* Left Side: Service Intro */}
      <section className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-primary to-primary-container">
        
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,100 C30,80 70,120 100,100 L100,0 L0,0 Z" fill="white"></path>
          </svg>
        </div>
        
        {/* Logo/Brand */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-primary text-4xl" data-weight="fill">cloud</span>
          <span className="text-2xl font-black text-on-primary tracking-tighter">CloudNote</span>
        </div>
        
        {/* Content */}
        <div className="relative z-10 space-y-8 max-w-xl">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold text-on-primary korean-headline">
              생각을 정리하는<br/>새로운 방법
            </h1>
            <p className="text-xl text-primary-fixed-dim korean-body font-medium opacity-90">
              흩어진 아이디어를 클라우드 위에서 체계적으로 큐레이션하세요. 복잡한 생각도 CloudNote와 함께라면 단순해집니다.
            </p>
          </div>
          
          <div className="flex items-center gap-4 py-8">
            <div className="flex -space-x-3">
              <Image className="w-12 h-12 rounded-full border-2 border-primary object-cover" width={48} height={48} alt="user 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZL_Cz5RoyfLeypG4xDkq3H-CT0JvO9yWCToObZeZcVH-ZxoGMywlZUy1OPUVBN4AvHmDEibz5KcVLOy-B3uQP8RY-VkRkqHSogSUqrDdEkbJAWO0X2DAu9IDdP64vemsyfSnUGNOez1h67OJ00VSIZ6dtgZa-Lw8n2Ilhc2vVmBil9MFx141iKSSun9AkXhd5FFxldqfOHQUw-omQx6oezkb8d_3YCVBJXMuBsixz9Upxep_w3uiKNTREnShwVcm0lt2dQJze1sBl"/>
              <Image className="w-12 h-12 rounded-full border-2 border-primary object-cover" width={48} height={48} alt="user 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC28URCNAzqzXEFVQqi_d5_FJbAxdRdnJ9cuAahnOlMrHPkHUOnTC0En12oK3p5c4XCzUfAqPJF5L6rIMrkM63lo8-O1H5wVqZI0kgosjafy1GXsicV_mRj-W_8sYRMuFyZsOA-qnkq-ORHyLq1RyrpV7AivxriA_PvUYbBPmUAVe66L04lxJZtyGWSVnEOBDAIrJWjJ4f5GXwFGSSFBdTrcy9rJoxoJC40wYidvlvP4vWIDdmrDBO5-5KDH4ARGq7qmQeK5IfoFE79"/>
              <Image className="w-12 h-12 rounded-full border-2 border-primary object-cover" width={48} height={48} alt="user 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb3841HZbuWd5RFkugeyBqyQxe_DFfvWnQQk-JESV2WswTzC8v-vRpXn6wFSWLXGpeYnN--UfV4CGPi5fr2kjoz8RzUHt4I84w7PXrfZW3R00vtEWQUFTQO9uNg7e2JWcXQrKv2aNAa0zpVKxqECpWGIeBTdEVMkpyKtiD52i4MZqjZ2ISz8SudThW3116bQ1e0FLQzCR17W0atZdljKbcrGDtMrf1BsJCcIg7ijNy968jMhLAzZ5JlGy7BNiOCBOxejiBrM_iwkg9"/>
              <div className="w-12 h-12 rounded-full bg-on-primary-fixed-variant flex items-center justify-center text-xs text-on-primary font-bold border-2 border-primary">
                +10만
              </div>
            </div>
            <p className="text-on-primary font-semibold text-sm">
              10만 명의 사용자가 선택한 지능형 노트 서비스
            </p>
          </div>
        </div>
        
        {/* Footer Visual */}
        <div className="relative z-10">
          <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl p-6 border border-on-primary/10">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-on-primary opacity-60">format_quote</span>
              <p className="text-on-primary italic text-lg leading-relaxed opacity-80">
                &quot;노트 필기 그 이상입니다. 매일의 워크플로우가 훨씬 부드러워졌어요.&quot;
              </p>
            </div>
          </div>
        </div>
        
      </section>
      
      {/* Right Side: Auth Forms */}
      <main className="w-full lg:w-1/2 flex items-center justify-center bg-surface p-8 overflow-y-auto">
        <LoginForm />
      </main>
    </div>
  )
}
