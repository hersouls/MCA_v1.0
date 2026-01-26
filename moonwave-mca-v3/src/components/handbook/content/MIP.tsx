import { EffortSection } from '../EffortSection';
import { HandbookAudio } from '../HandbookAudio';
import {
  Blockquote,
  CodeBlock,
  H2,
  H3,
  H4,
  Hr,
  IconH1,
  MermaidPlaceholder,
  P,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '../HandbookTypography';
import { SummaryCard } from '../SummaryCard';
import {
  ProtocolLink,
  ProtocolReferenceTable,
  RelatedLinks,
  TipBox,
  WarningBox,
  ZoneTable,
} from '../components';

export const MIP = () => {
  return (
    <div>
      {/* ========================================
            LOW: Quick Summary Card
        ======================================== */}
      <EffortSection level="low">
        <HandbookAudio
          id="mip-low"
          src="/audios/mip_7step_formula.m4a"
          autoPlay
          controls
          className="w-full mb-6"
        />
        <SummaryCard
          title="종목 선별 (MIP)"
          icon="ClipboardList"
          definition="MCA를 적용해도 되는 '안전한' 종목을 걸러내는 7단계 필터"
          keyPoints={[
            '7단계 스크리닝: 배당주 유니버스 → 펀더멘털 QA → 기술적 필터 → Zone 진입',
            'Grade C 이상(50점+)만 MCA 적용 가능',
            '120월선 멀티플 ≤ 1.2 = 매수 유효 구간',
            'Zone 3 진입 시 MCA, Zone 4 진입 시 DCA 실행',
          ]}
          actionItems={[
            '배당수익률 3% 이상 종목 추출',
            '리츠/금융업 제외, 펀더멘털 점수 50점 이상 확인',
            '120월선 우상향 + 멀티플 1.2 이하 필터링',
          ]}
          navigateTo="mip"
        />
      </EffortSection>

      {/* ========================================
            MEDIUM+: Full Content
        ======================================== */}
      <EffortSection level={['medium', 'high']}>
        <IconH1 icon="ClipboardList">Moonwave Investment Protocol v2.1</IconH1>
        <Blockquote>
          <strong>주식 종목 선별 및 자산 배분 전략 백서 v2.1</strong>
          <br />
          <strong>Core Principle</strong>: 감각 차단(Sensory Deprivation) + 데이터 신뢰(Data Trust)
        </Blockquote>

        <HandbookAudio
          id="mip-full"
          src="/audios/mip_7step_formula.m4a"
          autoPlay
          controls
          className="w-full my-4"
        />

        <P>
          MCA는 강력한 분할 매수 전략이지만, 아무 종목에나 적용하면 안 됩니다. 펀더멘털이 부실한
          종목은 하락 후 회복하지 못할 수 있기 때문입니다. 이 프로토콜은 MCA를 적용해도 되는
          '안전한' 종목을 걸러내는 7단계 필터입니다.
        </P>

        <WarningBox type="warning" id="check-mip-risk">
          <strong>잘못된 종목 선택의 위험</strong>
          <br />
          Grade D 종목(펀더멘털 50점 미만)에 MCA를 적용하면, 주가가 계속 하락하면서 손실이
          눈덩이처럼 불어날 수 있습니다. "싸게 샀다"고 생각했지만, 회사 자체가 무너지면 영영
          회복하지 못합니다.
          <br />
          <strong>
            안전한 투자를 위해 반드시 7단계 선별을 통과한 종목에만 MCA를 적용하는 것을 권장합니다.
          </strong>
        </WarningBox>

        <Hr />

        <H2 id="mip-summary">1. 핵심 요약 (Executive Summary)</H2>

        <H3>Moonwave 투자 철학 한 줄 정의</H3>
        <WarningBox type="info" id="check-mip-noise">
          <strong>
            "시장의 소음을 차단하고, 오직 데이터와 원칙에 의거하여 기계적으로 매매한다."
          </strong>
        </WarningBox>

        <H3 id="mip-funnel">1.1 7단계 프로세스 요약도</H3>
        <MermaidPlaceholder
          title="7-Step Screening Funnel"
          code={`flowchart TB
    subgraph FUNNEL[7-Step Screening Funnel]
        S1[Step 1: Sourcing<br/>배당주 유니버스]
        S2[Step 2: Filtering I<br/>리츠/금융 제외]
        S3[Step 3: Filtering II<br/>펀더멘털 QA]
        S4[Step 4: Tech Check I<br/>120월선 우상향]
        S5[Step 5: Tech Check II<br/>가격 위치 확인]
        S6[Step 6: Valuation<br/>멀티플 ≤1.2]
        S7[Step 7: Execution<br/>Zone 3/4 진입]

        S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7
    end

    S7 --> RESULT[최종 선별 종목<br/>극소수의 '진주']`}
        />

        <H3 id="mip-dashboard">1.2 핵심 수치 대시보드</H3>
        <Table>
          <Thead>
            <Tr>
              <Th>지표</Th>
              <Th>기준값</Th>
              <Th>의미</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>배당수익률</strong>
              </Td>
              <Td>≥ 3%</Td>
              <Td>1차 스크리닝 최소 조건</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>120월선 멀티플</strong>
              </Td>
              <Td>≤ 1.2</Td>
              <Td>Moonwave 매수 유효 구간</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>ZigZag Threshold</strong>
              </Td>
              <Td>±12%</Td>
              <Td>Zone 전환 기준</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Fundamental Score</strong>
              </Td>
              <Td>≥ 50점</Td>
              <Td>매수 최소 조건 (Grade C 이상)</Td>
            </Tr>
          </Tbody>
        </Table>

        <H3>1.3 Moonwave Protocol Suite</H3>
        <P>
          본 Investment Protocol은 4개의 하위 프로토콜과 함께 Moonwave Protocol Suite를 구성합니다.
        </P>
        <ProtocolReferenceTable />

        <H4>실행 순서 플로우</H4>
        <MermaidPlaceholder
          title="Execution Flow"
          code={`flowchart LR
    subgraph SUITE[Moonwave Protocol Suite 실행 흐름]
        A[1. 종목 선별<br/>본 문서 7단계] --> B[2. Grade 확인<br/>Fundamental Grade<br/>Grade C+ 필수]
        B --> C[3. Zone 판정<br/>ZigZag_Protocol<br/>12% 기준]
        C --> D{Zone?}
        D -->|Zone 3| E[4a. MCA 실행<br/>MCA_Protocol]
        D -->|Zone 4| F[4b. DCA 실행<br/>DCA_Protocol]
        E --> G[5. 매도 판단<br/>120월선 멀티플<br/>Section 7]
        F --> G
    end`}
        />

        <Hr />

        <H2 id="mip-philosophy">2. 서론 및 투자 철학 (Introduction & Philosophy)</H2>

        <H3>2.1 감각 차단(Sensory Deprivation) 원칙</H3>
        <Blockquote>
          "금융 시장은 본질적으로 인간의 심리를 시험하는 거대한 심리 실험장이다."
        </Blockquote>
        <P>
          매일 쏟아지는 뉴스, 실시간 점멸하는 호가창, 대중의 공포와 탐욕은 투자자의 이성을
          마비시킵니다. Moonwave는 이러한 <strong>시장의 소음(Noise)</strong>으로부터 투자자를
          격리합니다.
        </P>

        <H3>2.2 감정 vs 이성의 분리 프레임워크</H3>
        <ZoneTable showPsychology showMCA showDCA={false} />

        <Hr />

        <H2 id="mip-7-steps">3. 7단계 종목 선별 프로세스 (The 7-Step Screening)</H2>
        <P>"성공적인 투자의 8할은 '무엇을 사지 않을 것인가'를 결정하는 데 있습니다."</P>

        <Table>
          <Thead>
            <Tr>
              <Th>Step</Th>
              <Th>명칭</Th>
              <Th>목적</Th>
              <Th>통과 비율 (추정)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>Sourcing</Td>
              <Td>배당주 유니버스 구축</Td>
              <Td>100% → 20%</Td>
            </Tr>
            <Tr>
              <Td>2</Td>
              <Td>Filtering I</Td>
              <Td>리츠/금융상품 제외</Td>
              <Td>20% → 15%</Td>
            </Tr>
            <Tr>
              <Td>3</Td>
              <Td>Filtering II</Td>
              <Td>펀더멘털 QA</Td>
              <Td>15% → 8%</Td>
            </Tr>
            <Tr>
              <Td>4</Td>
              <Td>Tech Check I</Td>
              <Td>120월선 방향성 확인</Td>
              <Td>8% → 5%</Td>
            </Tr>
            <Tr>
              <Td>5</Td>
              <Td>Tech Check II</Td>
              <Td>가격 위치 분석</Td>
              <Td>5% → 3%</Td>
            </Tr>
            <Tr>
              <Td>6</Td>
              <Td>Valuation</Td>
              <Td>멀티플 1.2 이하 필터</Td>
              <Td>3% → 1%</Td>
            </Tr>
            <Tr>
              <Td>7</Td>
              <Td>Execution</Td>
              <Td>Zone 진입 및 주문 (MCA/DCA)</Td>
              <Td>최종 실행</Td>
            </Tr>
          </Tbody>
        </Table>

        <H3 id="mip-step1">Step 1: Sourcing (배당주 유니버스 구축)</H3>
        <P>
          <strong>목적:</strong> 전체 주식 시장에서 배당을 지급하는 종목만 추립니다.
        </P>
        <P>
          <strong>왜 배당주인가요?</strong> 배당을 꾸준히 지급하는 기업은 일정 수준 이상의 현금
          흐름과 수익성을 유지한다는 의미입니다. 적자 기업이나 성장만 강조하는 기업은 배당을
          지급하기 어렵습니다. 배당 여부 자체가 기업의 기본적인 건전성을 보여주는 1차 필터 역할을
          합니다.
        </P>
        <P>
          <strong>어떻게 하나요?</strong> 네이버 금융 &gt; 국내증시 &gt; 배당 순위 페이지에서
          배당수익률 3% 이상인 종목을 추출합니다. 또는 증권사 HTS/MTS의 조건검색 기능에서
          "배당수익률 3% 이상"으로 필터링하세요.
        </P>
        <P>
          <strong>통과 기준:</strong> 배당수익률 ≥ 3%
        </P>

        <H3 id="mip-step2">Step 2: Filtering I (리츠/금융 제외)</H3>
        <P>
          <strong>목적:</strong> 일반 기업과 사업 모델이 다른 특수 업종을 제외합니다.
        </P>
        <P>
          <strong>왜 제외하나요?</strong> 리츠(REITs)는 부동산 임대 수익을 배당하는 구조로, 일반
          기업과 재무제표 해석 방법이 다릅니다. 은행, 보험, 증권 등 금융업은 레버리지 구조가
          특수하고 규제 환경에 따라 실적 변동이 큽니다. 이런 종목들은 Moonwave의 펀더멘털 스코어링
          시스템으로 평가하기 어렵습니다.
        </P>
        <P>
          <strong>어떻게 하나요?</strong> 종목의 업종/섹터를 확인합니다. 리츠, 은행, 보험, 증권,
          카드사, 캐피탈 등은 제외합니다.
        </P>
        <P>
          <strong>통과 기준:</strong> 리츠/금융업 아님
        </P>

        <H3 id="mip-step3">Step 3: Filtering II (펀더멘털 QA)</H3>
        <P>
          <strong>목적:</strong> 재무 건전성과 주주환원 정책을 정량적으로 평가합니다.
        </P>
        <P>
          <strong>왜 필요한가요?</strong> 배당을 준다고 다 좋은 회사는 아닙니다. 일시적으로 배당을
          높였다가 다음 해에 삭감하는 경우도 있고, 적자를 내면서 배당을 유지하는 위험한 경우도
          있습니다. Fundamental Score는 이런 함정을 걸러내기 위한 100점 만점의 정량 평가
          시스템입니다.
        </P>
        <P>
          <strong>어떻게 하나요?</strong> Moonwave Fundamental Score를 계산합니다. 밸류에이션(35점),
          주주환원(40점), 성장/경영(25점) 세 카테고리로 구성됩니다. 자세한 평가 항목은 아래
          '펀더멘털 스코어링 시스템' 섹션을 참고하세요.
        </P>
        <P>
          <strong>통과 기준:</strong> Fundamental Score ≥ 50점 (Grade C 이상)
        </P>
        <WarningBox type="warning">
          Grade D(50점 미만)는 리스크가 크므로 MCA 적용 대상에서 제외하는 것이 좋습니다. 저렴해
          보이는 가격보다 중요한 것은 튼튼한 펀더멘털입니다.
        </WarningBox>

        <H3 id="mip-step4">Step 4: Tech Check I (120월선 방향성 확인)</H3>
        <P>
          <strong>목적:</strong> 장기 추세가 상승 또는 횡보인지 확인합니다.
        </P>
        <P>
          <strong>왜 120월선인가요?</strong> 120월선(10년 이동평균선)은 해당 기업의 장기적인 가치
          흐름을 보여줍니다. 120월선이 우상향이라면 기업 가치가 장기적으로 성장하고 있다는
          의미입니다. 반대로 하락 중이라면, 구조적인 문제가 있을 가능성이 높습니다.
        </P>
        <P>
          <strong>어떻게 하나요?</strong> 증권사 차트에서 월봉 차트를 열고, 이동평균선 설정에서
          120월선을 추가합니다. 선의 방향이 우상향 또는 평행인지 확인합니다.
        </P>
        <P>
          <strong>통과 기준:</strong> 120월선 우상향 또는 평행 (하락 시 제외)
        </P>

        <H3 id="mip-step5">Step 5: Tech Check II (가격 위치 분석)</H3>
        <P>
          <strong>목적:</strong> 현재 주가가 장기 평균 대비 어느 위치에 있는지 확인합니다.
        </P>
        <P>
          <strong>왜 필요한가요?</strong> 아무리 좋은 종목이라도 비싸게 사면 수익을 내기 어렵습니다.
          현재 주가가 120월선 근처이거나 아래에 있다면 상대적으로 저평가 구간입니다. 반대로
          120월선보다 훨씬 위에 있다면 이미 많이 오른 상태입니다.
        </P>
        <P>
          <strong>어떻게 하나요?</strong> 현재 주가와 120월선 값을 비교합니다. 현재가가 120월선
          근처(±20% 이내)이거나 아래에 있으면 통과입니다.
        </P>
        <P>
          <strong>통과 기준:</strong> 현재가 ≤ 120월선 × 1.2
        </P>

        <H3 id="mip-step6">Step 6: Valuation (멀티플 1.2 이하)</H3>
        <P>
          <strong>목적:</strong> 정량적인 저평가 기준을 적용합니다.
        </P>
        <P>
          <strong>멀티플이란?</strong> 현재 주가를 120월선으로 나눈 값입니다. 1.0이면 장기 평균과
          동일한 가격, 1.2면 평균보다 20% 비싼 가격입니다.
        </P>
        <P>
          <strong>왜 1.2 이하인가요?</strong> Moonwave는 멀티플 1.2 이하를 매수 유효 구간으로
          정의합니다. 역사적으로 우량주가 멀티플 1.2 이하로 내려오는 경우는 드물고, 그때가 바로 매수
          적기입니다.
        </P>
        <P>
          <strong>구간별 해석:</strong> 0.8 미만은 극단적 저평가로 적극 매수 구간입니다. 0.8~1.0은
          저평가로 매수 구간이고, 1.0~1.2는 적정가로 매수 가능합니다. 1.2 초과는 고평가로 관망해야
          합니다.
        </P>
        <P>
          <strong>통과 기준:</strong> 멀티플 ≤ 1.2
        </P>
        <CodeBlock>120월선 멀티플 = 현재 주가 / 120월 이동평균값</CodeBlock>
        <Table>
          <Thead>
            <Tr>
              <Th>멀티플</Th>
              <Th>구간</Th>
              <Th>조치</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>&lt; 0.8</strong>
              </Td>
              <Td>Deep Value</Td>
              <Td>
                <strong>적극 매수</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>0.8 - 1.0</strong>
              </Td>
              <Td>Value</Td>
              <Td>
                <strong>매수</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>1.0 - 1.2</strong>
              </Td>
              <Td>Fair</Td>
              <Td>
                <strong>매수 가능</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>&gt; 1.2</strong>
              </Td>
              <Td>Overvalued</Td>
              <Td>
                <strong>관망</strong>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <H3 id="mip-step7">Step 7: Execution (Zone 진입 및 주문)</H3>
        <P>
          <strong>목적:</strong> 적절한 타이밍에 MCA 또는 DCA를 실행합니다.
        </P>
        <P>
          <strong>왜 바로 매수하지 않나요?</strong> Step 1~6을 통과한 종목이라도 현재 Zone이 1이나
          2라면 아직 매수 타이밍이 아닙니다. Zone 3(고점 대비 -12% 이상 하락)에 진입해야 MCA를
          시작하고, Zone 4에서는 DCA로 전환합니다.
        </P>
        <P>
          <strong>어떻게 하나요?</strong> Zone 판정 섹션에서 설명한 방법으로 현재 Zone을 확인합니다.
          Zone 3이면 MCA 프로토콜에 따라 분할 매수를 시작하고, Zone 4면 DCA 프로토콜로 소량
          매수합니다.
        </P>
        <P>
          <strong>실행 기준:</strong> Zone 3 진입 시 MCA 실행(자금의 60~70% 배분), Zone 4 진입 시
          DCA 실행(자금의 30~40% 배분), Zone 1과 2에서는 매수 금지입니다.
        </P>
        <TipBox title="7단계 통과 후에도 인내가 필요합니다">
          모든 조건을 충족한 종목이라도 Zone 3에 진입하기까지 몇 달, 심지어 몇 년이 걸릴 수
          있습니다. 조급하게 Zone 1이나 2에서 매수하기보다, 가장 유리한 Zone 3를 기다리는 것이
          Moonwave의 전략입니다.
        </TipBox>

        <P>
          <br />
          <strong>Next Action:</strong> 선별한 종목의 현재 위치를 확인하세요 →{' '}
          <ProtocolLink protocol="ZIGZAG" />
        </P>

        <Hr />

        <H2 id="mip-zone-strategy">4. ZigZag Zone 전략 (Zone Strategy)</H2>

        <H3>4.1 Zone 식별 매트릭스</H3>
        <MermaidPlaceholder
          title="Zone Cycle"
          code={`flowchart LR
    subgraph CYCLE[ZigZag Zone Cycle]
        Z1[Zone 1: 과열<br/>저점 +12%↑<br/>매수 금지]
        Z2[Zone 2: 조정<br/>고점 -12%내<br/>관망]
        Z3[Zone 3: 심연<br/>고점 -12%↓<br/>MCA 가동]
        Z4[Zone 4: 반등<br/>저점 +12%↑<br/>DCA 가동]

        Z1 -->|하락 시작| Z2
        Z2 -->|-12% 돌파| Z3
        Z3 -->|+12% 반등| Z4
        Z4 -->|상승 지속| Z1
    end`}
        />

        <H3>4.2 Zone별 대응 전략 요약표</H3>
        <Table>
          <Thead>
            <Tr>
              <Th>항목</Th>
              <Th>Zone 1 (과열)</Th>
              <Th>Zone 2 (조정)</Th>
              <Th>Zone 3 (심연)</Th>
              <Th>Zone 4 (반등)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>감정</strong>
              </Td>
              <Td>탐욕</Td>
              <Td>불안</Td>
              <Td>공포</Td>
              <Td>희망</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Moonwave</strong>
              </Td>
              <Td>매수 금지</Td>
              <Td>관망</Td>
              <Td>
                <strong>MCA</strong>
              </Td>
              <Td>
                <strong>DCA</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>자금 배분</strong>
              </Td>
              <Td>0%</Td>
              <Td>0%</Td>
              <Td>60-70%</Td>
              <Td>30-40%</Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="mip-scoring">5. 펀더멘털 스코어링 시스템 (Scoring System)</H2>
        <P>
          <strong>Definition</strong>: 종목의 펀더멘털을 100점 만점으로 정량화한 Moonwave 고유 평가
          시스템 (Grade A~D).
        </P>

        <H3>5.1 스코어링 구조도</H3>
        <MermaidPlaceholder
          title="Scoring Structure"
          code={`flowchart TB
    subgraph SCORE[Moonwave Fundamental Score 100점]
        subgraph CAT1[Category 1: 밸류에이션 35점]
            PER[PER 15점]
            PBR[PBR 5점]
            SUSTAIN[이익 지속성 5점]
            DUAL[중복상장 5점]
            BRAND[글로벌 브랜드 5점]
        end

        subgraph CAT2[Category 2: 주주환원 40점]
            DIV[배당수익률 10점]
            QUARTER[분기배당 5점]
            INCREASE[배당연속인상 5점]
            BUYBACK[자사주매입/소각 20점]
        end

        subgraph CAT3[Category 3: 성장/경영 25점]
            GROWTH[성장잠재력 15점]
            MGMT[경영진리스크 10점]
        end
    end

    SCORE --> GRADE{등급 판정}
    GRADE -->|80+| A[Grade A: 적극 매수]
    GRADE -->|70-80| B[Grade B: 매수 고려]
    GRADE -->|50-70| C[Grade C: 신중 진입]
    GRADE -->|50미만| D[Grade D: 매수 금지]`}
        />

        <Hr />

        <H2 id="mip-exit">6. 매도 전략 (Exit Strategy)</H2>
        <H3>6.1 목표 가격 설정 공식</H3>
        <Table>
          <Thead>
            <Tr>
              <Th>종목 유형</Th>
              <Th>목표 멀티플</Th>
              <Th>계산 예시 (120월선 50,000원)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>대형주 / 가치주</strong>
              </Td>
              <Td>
                120월선 × <strong>2.0</strong>
              </Td>
              <Td>100,000원</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>중형 성장주</strong>
              </Td>
              <Td>
                120월선 × <strong>2.5</strong>
              </Td>
              <Td>125,000원</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>소형 성장주</strong>
              </Td>
              <Td>
                120월선 × <strong>3.0</strong>
              </Td>
              <Td>150,000원</Td>
            </Tr>
          </Tbody>
        </Table>
      </EffortSection>

      {/* ========================================
            ALL LEVELS: Related Links
        ======================================== */}
      <EffortSection level={['low', 'medium', 'high']}>
        <RelatedLinks currentSection="mip" />
      </EffortSection>
    </div>
  );
};
