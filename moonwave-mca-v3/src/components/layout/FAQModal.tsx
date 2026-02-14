import { Dialog } from '@/components/ui/Dialog';
import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { useState } from 'react';

// Comprehensive User Manual Data
const FAQ_ITEMS = [
  {
    category: '1. MCA 투자 전략 (Strategy)',
    questions: [
      {
        q: 'MCA 전략이란 무엇인가요?',
        a: `MCA(Maximum Drawdown Cost Averaging)는 주가가 하락할 때 정해진 수학적 비율로 분할 매수하여 평단가를 방어하고, 반등 시 수익을 극대화하는 전략입니다.
                단순히 '떨어질 때 사는 것'이 아니라, "고점 대비 하락폭(MDD)"에 비례하여 계획된 물량을 투입함으로써 감정적인 투자를 배제합니다.`,
        link: { section: 'mca', anchor: 'mca-summary', text: 'MCA 전략 상세 보기' },
      },
      {
        q: '분할 구간(Steps) 설정 가이드',
        a: `변동성이 큰 종목일수록 구간을 잘게 나누는 것이 안전합니다.
                • 대형주/지수: 20구간 권장
                • 중소형주/급등주: 30~40구간 권장
                구간이 많을수록 하락장에서 더 깊게 방어할 수 있습니다.`,
        link: { section: 'mca', anchor: 'mca-spec', text: '파라미터 상세 가이드' },
      },
      {
        q: '투자 강도(Strength) 선택 방법',
        a: `투자 강도는 자금 투입의 가속도를 결정합니다.
                • 1.0 (균등): 모든 하락 구간에 동일 금액 투입
                • 1.0 초과 (방어형): 하락이 깊어질수록 더 많은 금액 투입 (평단가 방어 유리)
                • 1.0 미만 (공격형): 초반 하락에 많은 금액 투입 (얕은 조정 후 반등 시 유리)`,
        link: { section: 'mca', anchor: 'mca-strength-guide', text: 'Strength 설정 가이드' },
      },
    ],
  },
  {
    category: '2. 대시보드 (Dashboard)',
    questions: [
      {
        q: '투입 총액(Total Invested)의 의미',
        a: `대시보드의 '투입 총액'은 다음 두 가지를 합산한 실제 운용 자금입니다.
                1. 기보유 주식(Legacy): MCA 시작 전 보유하고 있던 주식의 평가액
                2. 신규 체결액(Executed): MCA 전략에 따라 새로 매수한 금액
                따라서 '잔여 현금'은 '초기 예수금 - 투입 총액'으로 계산되어 실제 가용 현금을 보여줍니다.`,
        link: { section: 'guide', anchor: 'mca-interface', text: '대시보드 구조 보기' },
      },
      {
        q: '주문 괴리(Gap Warning) 경고란?',
        a: `설정된 MCA 계획상 '매수해야 하는 주문(Ordered)'과 '실제로 체결된 내역(Executed)' 차이가 클 때 발생합니다.
                주가가 급락하여 매수 주문이 체결되지 않고 지나갔거나, 사용자가 매수를 누락했을 경우 알림이 뜹니다.`,
      },
    ],
  },
  {
    category: '3. 포트폴리오 상세 (Portfolio)',
    questions: [
      {
        q: '평단가 방어선 차트 분석법',
        a: `차트의 파란색 선은 주가가 하락함에 따라 내 평단가가 어떻게 낮아지는지를 보여줍니다.
                • 현재 주가가 평단가 선보다 위에 있다면 수익 구간입니다.
                • 주가가 하락하더라도 추가 매수가 이루어지면 평단가 선이 따라 내려가며 손실을 방어합니다.`,
      },
      {
        q: '상태 뱃지(Status Badge) 설명',
        a: `• 정상 (Normal): 계획대로 매수가 진행 중인 상태
                • 매수 대기 (Pending): 주문을 등록했으나 아직 체결되지 않은 상태
                • 괴리 주의 (Gap Warning): 매수 계획보다 실제 매수가 부족한 상태 (추가 매수 필요)`,
      },
      {
        q: '목표가 시뮬레이션 활용',
        a: `현재 평단가와 보유 수량을 기준으로, 특정 가격 도달 시 예상되는 수익금과 ROE를 미리 계산해볼 수 있습니다. 매도 목표가를 설정할 때 유용합니다.`,
        link: { section: 'mip', anchor: 'mip-exit', text: '매도 전략 가이드' },
      },
    ],
  },
  {
    category: '4. Fundamental Grade',
    questions: [
      {
        q: 'Fundamental Grade 평가 기준',
        a: `단순 재무지표가 아닌, 기업의 질적 가치를 종합 평가하여 S~D 등급을 부여합니다.
                • Valuation (35점): PER, PBR 등 저평가 매력도
                • Global Growth (40점): 글로벌 확장성, 독점력, 미래 투자
                • Shareholder Return (25점): 배당, 자사주 소각 등 주주 환원 의지`,
        link: { section: 'mip', anchor: 'mip-scoring', text: '스코어링 시스템 상세' },
      },
      {
        q: '등급별 투자 가이드',
        a: `• S/A등급: 장기 투자 및 적극적 비중 확대 권장
                • B등급: 트레이딩 관점 접근, 중립 비중
                • C/D등급: 투자 유의, 단기 반등 시 비중 축소 권장`,
        link: { section: 'mip', anchor: 'check-mip-risk', text: '잘못된 종목 선택의 위험' },
      },
      {
        q: 'Gemini Gem 기능 사용법',
        a: `Google Gemini AI를 통해 기업의 정성적 분석(경영진 리스크, 브랜드 가치 등)을 수행합니다. 생성된 JSON 데이터를 붙여넣기하면 복잡한 평가 항목이 자동으로 입력됩니다.`,
      },
    ],
  },
  {
    category: '5. 설정 및 기타',
    questions: [
      {
        q: '컬러 팔레트 변경',
        a: `설정 메뉴에서 앱의 포인트 컬러를 변경할 수 있습니다. (라이트 모드 전용)
                기본 민트색 외에 오션, 로즈, 퍼플 등 다양한 테마를 제공합니다.`,
      },
      {
        q: '데이터 백업/복원',
        a: `모든 포트폴리오와 매매 기록은 브라우저 내부에 저장됩니다.
                데이터 손실을 방지하기 위해 설정 > 데이터 관리에서 주기적으로 JSON 파일로 백업하는 것을 권장합니다.`,
      },
    ],
  },
];

export function FAQModal() {
  const isOpen = useUIStore((state) => state.isFAQModalOpen);
  const onClose = useUIStore((state) => state.closeFAQModal);
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="2xl">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            사용자 메뉴얼 & FAQ
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-border">
        <div className="p-4 bg-surface-hover rounded-xl border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Moonwave MCA는 감정을 배제한 기계적 분할 매수 시스템입니다. 아래 메뉴얼을 통해 각 기능의
            정확한 의미와 활용법을 확인하세요.
          </p>
        </div>

        {FAQ_ITEMS.map((section, catIdx) => (
          <div key={catIdx}>
            <h3 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              {section.category}
            </h3>
            <div className="space-y-2">
              {section.questions.map((item, qIdx) => {
                const id = `${catIdx}-${qIdx}`;
                const isExpanded = openIndex === id;

                return (
                  <div
                    key={qIdx}
                    className="border border-border rounded-lg overflow-hidden bg-card transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleItem(id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircleQuestion
                          className={clsx(
                            'w-5 h-5 flex-shrink-0 mt-0.5 transition-colors',
                            isExpanded ? 'text-indigo-500' : 'text-muted-foreground'
                          )}
                        />
                        <span className="font-medium text-foreground">
                          {item.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={clsx(
                          'w-4 h-4 text-muted-foreground transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pl-12 bg-white dark:bg-transparent">
                        <p className="text-sm text-muted-foreground leading-relaxed bg-surface-hover p-3 rounded-lg whitespace-pre-line">
                          {item.a}
                        </p>
                        {item.link && (
                          <button
                            onClick={() => {
                              onClose(); // Close FAQ
                              useUIStore
                                .getState()
                                .openHandbook(item.link.section, item.link.anchor);
                            }}
                            className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
                          >
                            <span>{item.link.text}</span>
                            <span>→</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
