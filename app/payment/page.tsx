import PaymentCheckout from './PaymentCheckout';

export default function PaymentPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Title Section */}
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 headline tracking-[-0.02em]">구독 플랜 선택</h1>
          <p className="text-secondary text-lg max-w-2xl">생각의 흐름을 멈추지 마세요. 당신의 창의성을 위한 최적의 도구를 선택하세요.</p>
        </div>

        <PaymentCheckout />
      </main>
    </div>
  );
}
