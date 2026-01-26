import { EffortSection } from '../EffortSection';
import { H2, H3, Hr, IconH1, LI, P, UL } from '../HandbookTypography';
import { SummaryCard } from '../SummaryCard';
import { ProtocolLink, RelatedLinks, TipBox, WarningBox } from '../components';

export const MCAUserGuide = () => (
  <div>
    {/* ========================================
        LOW: Quick Summary Card
    ======================================== */}
    <EffortSection level="low">
      <SummaryCard
        title="Moonwave MCA 앱 사용법"
        icon="BookOpen"
        definition="주가 하락 시 체계적으로 분할 매수하는 투자 계획 도구"
        keyPoints={[
          '대시보드에서 종목 추가 → 파라미터 설정 → 계획표 자동 생성',
          '권장 설정: 시작 하락률 -12%, 분할 구간 20, Strength 1.0',
          'Zone 3 진입 시에만 MCA 시작 (고점 대비 -12% 이상 하락)',
          'Grade D 종목(50점 미만)에는 절대 적용 금지',
        ]}
        actionItems={[
          '대시보드에서 + 버튼으로 종목 추가',
          '고점 가격, Strength, 시작 하락률, 분할 구간 설정',
          '증권사 앱에서 예약 주문 후 체결 기록 관리',
        ]}
        navigateTo="guide"
      />
    </EffortSection>

    {/* ========================================
        MEDIUM+: Full Content
    ======================================== */}
    <EffortSection level={['medium', 'high']}>
      <IconH1 icon="BookOpen">Moonwave MCA 항해 지침서 (User Guide)</IconH1>

      <P>
        Moonwave MCA에 오신 것을 환영합니다. 이 앱은 주가 하락 시 체계적으로 분할 매수할 수 있도록
        도와주는 투자 계획 수립 도구입니다. 여러분이 설정한 파라미터를 기반으로 '언제, 얼마나, 어떤
        가격에 매수할지' 자동으로 계산해줍니다.
      </P>

      <WarningBox type="info">
        <strong>이 앱의 역할</strong>
        <br />
        MCA는 매매 계획을 수립하는 도구입니다. 실제 주문은 여러분이 사용하는 증권사 앱에서 직접
        진행해야 합니다. 계획을 세운 후 증권사에서 예약 주문을 넣고, 체결되면 이 앱에서 기록을
        관리하세요.
      </WarningBox>

      <Hr />

      <H2 id="mca-interface">앱이라는 배의 구조 (Interface)</H2>

      <P>
        Moonwave MCA는 크게 네 가지 영역으로 구성되어 있습니다. 각 영역이 어떤 역할을 하는지
        이해하면 앱을 더 효과적으로 활용할 수 있습니다.
      </P>

      <H3>대시보드</H3>
      <P>
        등록한 모든 종목을 한눈에 볼 수 있는 메인 화면입니다. 각 종목의 진행률, 투입 금액, 평균 단가
        등 핵심 지표를 카드 형태로 보여줍니다. 새 종목을 추가하거나 기존 종목을 선택해 상세 페이지로
        이동할 수 있습니다.
      </P>

      <H3>종목 상세</H3>
      <P>
        개별 종목의 MCA 계획을 설정하고 관리하는 핵심 화면입니다. 고점 가격, 투자 강도, 시작 하락률,
        분할 구간 등의 파라미터를 설정하면 자동으로 매매 계획표가 생성됩니다. 주문을 넣거나 체결되면
        해당 구간을 체크하여 진행 상황을 추적할 수 있습니다.
      </P>

      <H3>핸드북</H3>
      <P>
        지금 보고 계신 이 화면입니다. Moonwave 투자 철학, Zone 시스템, MCA/DCA 전략 등 앱을 제대로
        활용하기 위해 알아야 할 개념들을 설명합니다. 처음이라면 이 가이드를 먼저 읽고, 필요할 때마다
        다른 섹션을 참고하세요.
      </P>

      <H3>설정</H3>
      <P>
        테마 변경, 데이터 백업/복원, 초기 예수금 설정 등 앱 환경을 관리합니다. 특히 데이터 내보내기
        기능을 정기적으로 사용해 백업하는 것을 권장합니다.
      </P>

      <Hr />

      <H2 id="mca-quick-start">첫 번째 항해 시작하기 (Quick Start)</H2>

      <P>아래 단계를 따라하면 처음 사용하는 분도 쉽게 MCA 계획을 세울 수 있습니다.</P>

      <H3>Step 1: 새 종목 추가</H3>
      <P>
        대시보드 우측 상단의 + 버튼을 클릭하세요. 모바일에서는 하단 네비게이션의 '추가' 버튼을
        탭합니다.
      </P>

      <H3>Step 2: 종목 검색 및 선택</H3>
      <P>
        종목명(예: '삼성전자')이나 종목코드(예: '005930')를 입력하면 자동완성 목록이 나타납니다.
        원하는 종목을 선택하세요.
      </P>

      <H3>Step 3: 파라미터 설정</H3>
      <P>MCA 계획의 핵심인 네 가지 파라미터를 설정합니다. 처음이라면 아래 권장값으로 시작하세요.</P>
      <UL>
        <LI>
          <strong>고점 가격</strong>: 최근 고점 입력 (차트에서 확인)
        </LI>
        <LI>
          <strong>투자 강도(Strength)</strong>: 1.0 권장 (앱 내 '투자 강도'와 동일)
        </LI>
        <LI>
          <strong>시작 하락률</strong>: -12% 권장
        </LI>
        <LI>
          <strong>분할 구간</strong>: 20 권장
        </LI>
      </UL>

      <H3>Step 4: 저장 및 확인</H3>
      <P>
        저장 버튼을 클릭하면 자동으로 매매 계획표가 생성됩니다. 각 구간별 매수 가격, 수량, 금액이
        표시됩니다.
      </P>

      <TipBox title="파라미터를 잘 모르겠다면">
        일단 권장값으로 시작하세요. 아래 '파라미터 이해하기' 섹션에서 각각의 역할을 자세히
        설명합니다. 이해가 깊어지면 나중에 조정할 수 있습니다.
      </TipBox>

      <Hr />
    </EffortSection>

    {/* ========================================
        HIGH: Detailed Parameter Explanation
    ======================================== */}
    <EffortSection level="high">
      <H2 id="mca-parameters">파라미터 이해하기</H2>

      <P>
        MCA의 핵심은 네 가지 파라미터입니다. 각각이 무엇을 의미하고 왜 중요한지 이해하면 더 효과적인
        계획을 세울 수 있습니다.
      </P>

      <H3>고점 가격 (Peak Price)</H3>
      <P>
        <strong>정의:</strong> MCA 계산의 기준이 되는 최고점 가격입니다.
      </P>
      <P>
        <strong>왜 중요한가요?</strong> 모든 매수 가격은 이 고점에서 얼마나 하락했는지를 기준으로
        계산됩니다. 예를 들어 고점이 80,000원이고 시작 하락률이 -12%라면, 첫 매수가는 80,000 × 0.88
        = 70,400원이 됩니다.
      </P>
      <P>
        <strong>어떻게 설정하나요?</strong> 증권사 앱이나 네이버 금융에서 해당 종목의 최근 고점(52주
        최고가 또는 ZigZag 고점)을 확인하세요. Zone 시스템에 익숙해지면 ZigZag 지표의 고점을
        사용하는 것이 더 정확합니다.
      </P>

      <H3>투자 강도 (Strength)</H3>
      <P>
        <strong>정의:</strong> 각 구간의 매수 수량을 결정하는 승수입니다. 숫자가 클수록 하락 시 더
        많이 매수합니다.
      </P>
      <P>
        <strong>왜 중요한가요?</strong> MCA의 핵심 원리는 '하락할수록 더 많이 사는 것'입니다.
        Strength가 이 비율을 조절합니다. 1.0이면 표준, 2.0이면 두 배 적극적으로 매수합니다.
      </P>
      <P>
        <strong>어떻게 선택하나요?</strong> 0.5(보수적)는 MCA가 처음이거나 변동성 높은 종목, 투자
        여력이 제한적일 때 적합합니다. 1.0(표준)은 대부분의 경우 권장되며 Grade A-B 종목에
        적합합니다. 2.0(적극적)은 Grade A 종목에 충분한 투자 여력과 확신이 있을 때 선택합니다.
      </P>

      <H3>시작 하락률 (Start Drop)</H3>
      <P>
        <strong>정의:</strong> 고점 대비 몇 % 하락했을 때 첫 매수를 시작할지 결정합니다.
      </P>
      <P>
        <strong>왜 -12%를 권장하나요?</strong> Moonwave의 Zone 시스템에서 Zone 3(하락 진행 구간)는
        고점 대비 -12% 이상 하락한 구간으로 정의됩니다. 시작 하락률을 -12%로 설정하면 Zone 3 진입과
        동시에 MCA를 시작할 수 있어 전략적 일관성이 유지됩니다.
      </P>

      <H3>분할 구간 (Steps)</H3>
      <P>
        <strong>정의:</strong> 전체 투자를 몇 번에 나눠서 매수할지 결정합니다.
      </P>
      <P>
        <strong>왜 20구간을 권장하나요?</strong> 구간이 너무 적으면(예: 5구간) 한 번에 많은 금액을
        투입하게 되어 리스크가 커지고, 너무 많으면(예: 50구간) 관리가 복잡해집니다. 20구간은 충분히
        분산하면서도 관리 가능한 균형점입니다.
      </P>

      <Hr />
    </EffortSection>

    {/* ========================================
        MEDIUM+: Trade Management & Warnings
    ======================================== */}
    <EffortSection level={['medium', 'high']}>
      <H2>매매 체결 관리하기</H2>

      <P>MCA 계획을 세웠다면, 이제 실제로 주문을 넣고 체결 상황을 추적해야 합니다.</P>

      <H3>주문 등록</H3>
      <P>
        증권사 앱에서 해당 가격에 예약 주문을 넣었다면, 해당 구간의 '주문' 체크박스를 클릭하세요.
        주문 대기 상태가 표시됩니다.
      </P>

      <H3>체결 확인</H3>
      <P>
        주문이 실제로 체결되었다면, '체결' 체크박스를 클릭하세요. 체결 완료 상태가 표시되고,
        체결일과 메모를 기록할 수 있습니다.
      </P>

      <TipBox title="체결 메모 활용">
        각 구간마다 메모를 남길 수 있습니다. 체결 당시 시장 상황이나 느낀 점을 기록해두면 나중에
        복기할 때 유용합니다.
      </TipBox>

      <Hr />

      <H2>반드시 알아야 할 주의사항</H2>

      <WarningBox type="danger" id="check-mca-ban">
        <strong>Grade D 종목 MCA 금지</strong>
        <br />
        펀더멘털 점수가 50점 미만인 종목(Grade D)에는 절대로 MCA를 적용하지 마세요. 이런 종목은 하락
        후 회복하지 못할 위험이 높습니다.
      </WarningBox>

      <WarningBox type="warning" id="check-zone3">
        <strong>Zone 3 확인 필수</strong>
        <br />
        MCA는 Zone 3(고점 대비 -12% 이상 하락)에서만 시작해야 합니다. Zone 1이나 Zone 2에서 시작하면
        고점 추격 매수가 되어 위험합니다.
      </WarningBox>

      <TipBox title="정기 백업 권장">
        설정 메뉴의 데이터 내보내기 기능을 사용해 정기적으로 백업하세요. 브라우저 데이터가 삭제되면
        모든 기록이 사라질 수 있습니다.
      </TipBox>

      <Hr />

      <H2>더 깊은 바다로 (Next Steps)</H2>

      <P>
        이제 도구(App)를 다루는 법은 익혔습니다. 하지만 진정한 항해를 위해서는 나침반(이론)과
        지도(전략)가 필요합니다. 다음 순서로 읽어보시길 권장합니다.
      </P>

      <P>
        <strong>
          1. <ProtocolLink protocol="ZIGZAG" /> (Zone 시스템):
        </strong>
        "지금 내가 어디에 있는가?"를 파악하는 지도입니다. 언제 MCA를 시작하고 멈춰야 할지
        알려줍니다.
      </P>

      <P>
        <strong>
          2. <ProtocolLink protocol="MIP" /> (종목 선별):
        </strong>
        "어떤 배를 타야 하는가?"를 결정합니다. 아무 종목이나 MCA를 적용하면 침몰할 수 있습니다.
      </P>

      <P>
        <strong>3. Moonwave 철학:</strong>
        "우리는 왜 떠나는가?"에 대한 근원적인 질문과 대답입니다. 흔들리지 않는 멘탈을 위한 닻입니다.
      </P>

      <RelatedLinks currentSection="guide" />
    </EffortSection>
  </div>
);
