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
  LI,
  OL,
  P,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UL,
} from '../HandbookTypography';
import { SummaryCard } from '../SummaryCard';
import {
  CoreValuesList,
  PhilosophyQuote,
  PrerequisitesTable,
  ProtocolLink,
  ProtocolReferenceTable,
  RelatedLinks,
  StrengthGuideTable,
  TipBox,
  WarningBox,
  ZoneTable,
} from '../components';

export const MCAProtocol = () => {
  return (
    <div>
      {/* ========================================
            LOW: Quick Summary Card
        ======================================== */}
      <EffortSection level="low">
        <HandbookAudio
          id="mca-low"
          src="/audios/mca_strategy.m4a"
          autoPlay
          controls
          className="w-full mb-6"
        />
        <SummaryCard
          title="MCA (Moonwave Cost Averaging)"
          icon="TrendingUp"
          definition="가격 하락 시 피보나치-지수 공식에 따라 매수량을 기하급수적으로 늘리는 분할 매수 전략"
          keyPoints={[
            'Zone 3 (고점 -12% 이상 하락)에서만 실행',
            '수량 공식: Qi = TRUNC(Strength × e^(i/3))',
            'Grade C+ (50점 이상) 종목에만 적용',
            'Zone 4 진입 시 → DCA로 전환',
          ]}
          actionItems={[
            'MIP 7단계 선별로 Grade C+ 종목 확인',
            'Zone 3 진입 확인 후 MCA 시작',
            'Strength 설정: Grade A(1.0~2.0), B(0.5~1.0), C(0.5이하)',
          ]}
          navigateTo="mca"
        />
        <img
          src="/images/handbook/mca_structure_diagram.png"
          alt="MCA Structure"
          className="w-full h-auto rounded-xl shadow-lg mt-8 border border-zinc-200 dark:border-zinc-800"
        />
      </EffortSection>

      <EffortSection level={['medium', 'high']}>
        <IconH1 icon="TrendingUp">Moonwave Cost Averaging (MCA) Protocol Whitepaper v2.1</IconH1>
        <Blockquote>
          <strong>부제</strong>: 초정밀 자산 매집을 위한 파동적 균형(Wave-like Balance) 전략
        </Blockquote>

        <HandbookAudio
          id="mca-full"
          src="/audios/mca_strategy.m4a"
          autoPlay
          controls
          className="w-full my-4"
        />

        <Hr />

        <H2 id="mca-summary">1. 핵심 요약 (Executive Summary)</H2>

        <H3>1.1 전제 조건: Moonwave Investment Protocol 7단계 선별</H3>
        <WarningBox type="warning" id="check-mip7">
          <strong>MUST</strong>: 본 MCA 프로토콜은 다음 조건을 <strong>모두</strong> 만족하는
          종목에만 적용됩니다.
        </WarningBox>

        <PrerequisitesTable type="MCA" />

        <WarningBox type="danger" id="check-grade-d-ban">
          <strong>Grade D 종목 (50점 미만)</strong>: MCA 적용 절대 금지
        </WarningBox>
        <P>
          7단계 선별 프로세스 상세 → <ProtocolLink protocol="MIP" />
        </P>

        <H3>1.2 MCA 핵심 요약</H3>
        <Table>
          <Thead>
            <Tr>
              <Th>항목</Th>
              <Th>설명</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>적용 Zone</strong>
              </Td>
              <Td>Zone 3 (고점 대비 -12% 이상 하락 구간)</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>수량 공식</strong>
              </Td>
              <Td>Qi = TRUNC(Strength × e^(i/3))</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>가격 공식</strong>
              </Td>
              <Td>Pi = Peak × (1 - Di/100)</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>전환 조건</strong>
              </Td>
              <Td>Zone 4 진입 시 → DCA 전략 전환</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>매도 조건</strong>
              </Td>
              <Td>Zone 1 + 120월선 멀티플 ×2.0 도달 시</Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="mca-methodology">2. 왜 하락할수록 더 많이 사나요?</H2>

        <P>
          MCA의 핵심 원리는 간단합니다. 주가가 떨어질수록 더 많은 수량을 매수하는 것입니다. 왜
          이렇게 해야 할까요?
        </P>

        <H3>2.1 일반 분할 매수의 한계</H3>
        <P>
          대부분의 투자자는 "분할 매수"를 한다고 하면서 매번 같은 금액이나 수량을 삽니다. 예를 들어
          100만원씩 10번에 나눠서 매수하는 방식입니다. 이 방법의 문제는 주가가 많이 떨어졌을 때나
          조금 떨어졌을 때나 같은 금액을 투입한다는 점입니다. 결과적으로 평균 단가를 충분히 낮추지
          못합니다.
        </P>

        <H3>2.2 MCA의 차별점</H3>
        <P>
          MCA는 다르게 접근합니다. 주가가 고점에서 12% 떨어졌을 때는 1주를 사고, 15% 떨어졌을 때는
          2주, 20% 떨어졌을 때는 5주, 25% 떨어졌을 때는 8주를 삽니다. 이 패턴이 익숙하다면 맞습니다.
          자연계의 성장 패턴인 피보나치 수열(1, 1, 2, 3, 5, 8...)을 따르는 것입니다.
        </P>

        <H3>2.3 왜 이게 유리한가요?</H3>
        <P>
          주가가 가장 많이 떨어졌을 때, 즉 가장 "싸게" 살 수 있을 때 가장 많은 수량을 사게 됩니다.
          결과적으로 평균 매수 단가가 균등 분할 매수보다 훨씬 빠르게 낮아집니다. 주가가 반등하면
          수익 실현이 더 쉬워집니다.
        </P>

        <H3>2.4 시각적 예시</H3>
        <P>삼성전자 고점 80,000원, Strength 1.0, 20구간 기준:</P>
        <Table>
          <Thead>
            <Tr>
              <Th>구간</Th>
              <Th>매수가</Th>
              <Th>하락률</Th>
              <Th>매수 수량</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1구간</Td>
              <Td>70,400원</Td>
              <Td>-12%</Td>
              <Td>1주</Td>
            </Tr>
            <Tr>
              <Td>5구간</Td>
              <Td>66,400원</Td>
              <Td>-17%</Td>
              <Td>5주</Td>
            </Tr>
            <Tr>
              <Td>10구간</Td>
              <Td>61,600원</Td>
              <Td>-23%</Td>
              <Td>15주</Td>
            </Tr>
            <Tr>
              <Td>15구간</Td>
              <Td>56,800원</Td>
              <Td>-29%</Td>
              <Td>39주</Td>
            </Tr>
            <Tr>
              <Td>20구간</Td>
              <Td>52,000원</Td>
              <Td>-35%</Td>
              <Td>102주</Td>
            </Tr>
          </Tbody>
        </Table>
        <P>
          하락 초기에는 조심스럽게, 하락이 깊어질수록 과감하게 매수합니다. 이것이 MCA의 핵심입니다.
        </P>

        <TipBox title="MCA 적용 전 필수 확인" id="tip-mca-prereq">
          이 전략은 "좋은 종목"에만 적용해야 합니다. 펀더멘털이 부실한 종목은 하락 후 영영 회복하지
          못할 수 있습니다. 반드시 MIP 7단계를 통과한 Grade C 이상 종목에만 MCA를 적용하세요.
        </TipBox>

        <Hr />
      </EffortSection>

      {/* ========================================
            HIGH: Philosophy & Mathematical Details
        ======================================== */}
      <EffortSection level="high">
        <H2 id="mca-philosophy">3. 서론: Moonwave의 철학 - 나만의 파동으로 흐르는 투자</H2>

        <H3>3.1 Moonwave 투자 철학 선언</H3>
        <PhilosophyQuote />
        <P>
          혼란스러운 금융 시장의 파도 속에서 가장 큰 적은 인간의 '감정'입니다. 가격이 떨어질 때
          도망치고 싶은 공포(Fear)와, 오를 때 계획 없이 추격 매수하는 포모(FOMO)는 자산을 갉아먹는
          주원인입니다.
        </P>
        <P>
          Moonwave는 이러한 감정의 소용돌이에 휩쓸리지 않습니다. 대신{' '}
          <strong>자신만의 파동으로, 자신만의 흐름으로, 자신만의 속도로</strong> 투자합니다.
          누구와도 비교하지 않으며, 세상의 어떤 잣대로도 측정될 수 없는 유일무이한 투자 철학을
          지향합니다.
        </P>

        <H3>3.2 MCA를 지탱하는 Moonwave 핵심 가치</H3>
        <CoreValuesList />

        <H3>3.3 MCA 프로토콜의 본질</H3>
        <P>
          <strong>Moonwave/MCA (Moonwave Cost Averaging)</strong> 프로토콜은 시장 심리가 바닥일 때
          오히려 공격적으로 매집을 수행하는 알고리즘 프레임워크입니다. 수학적 엄밀함을 바탕으로 매수
          과정을 시스템화함으로써, MCA는 변동성을 위협이 아닌 '전략적 자산'으로 변화시킵니다.
        </P>
        <P>
          <strong>핵심 미션</strong>: 자산 가격이 선형적으로 하락할 때 자산 배분을 기하급수적으로
          늘리는 "스케일 트레이딩(Scale-Trading)" 전략을 실행하여, 수학적으로 우월한 평균 단가를
          달성하는 것입니다.
        </P>

        <Hr />

        <H2 id="mca-math">4. 수학적 아키텍처: 피보나치-지수 가교 (Fibonacci-Exponential Bridge)</H2>
        <P>
          MCA의 핵심 엔진은 <strong>황금비(Golden Ratio)</strong>와{' '}
          <strong>피보나치 수열(Fibonacci Sequence)</strong>에 기반을 두고 있습니다. 솔방울에서
          은하계까지, 자연의 성장 패턴은 피보나치 수열(1, 1, 2, 3, 5, 8...)을 따르며, 이는 에너지와
          자원의 가장 효율적인 분배를 나타냅니다.
        </P>
        <P>
          MCA는 이 우주의 법칙을 자본 배분에 적용합니다. 가격이 고점에서 멀어질수록 해당 자산의
          "기회 가치"는 증가합니다. 따라서 우리의 자본 투입은 선형적(1, 1, 1...)이어서는 안 되며,
          거래의 확장되는 잠재력을 반영하여 기하급수적이어야 합니다.
        </P>

        <H3>4.1 피보나치 로직 (The Fibonacci Logic)</H3>
        <P>
          전통적인 마틴게일 전략은 리스크를 2배로 늘리지만(1, 2, 4, 8...), 이는 파산 위험을 초래할
          수 있습니다. MCA는 피보나치에서 영감을 받은 더 부드럽고 지속 가능한 성장 곡선을
          채택합니다:
        </P>
        <CodeBlock>
          Seq = {'{'}1, 2, 3, 5, 8, 13, ...{'}'}
        </CodeBlock>
        <P className="text-sm italic">*참고: 매매 효율성을 위해 수열을 약간 조정하여 적용합니다.</P>

        <H3>4.2 지수 가교 공식 (The Exponential Bridge Formula)</H3>
        <P>
          이 자연 성장 곡선을 알고리즘적으로 구현하기 위해, MCA는 피보나치 수열에 근사하는 지수
          함수를 사용합니다. 이를 통해 Strength(투자강도) 변수를 통한 연속적인 계산과 조정이
          가능해집니다.
        </P>

        <P>
          <strong>마스터 공식:</strong>
        </P>
        <CodeBlock>Qi = TRUNC(Strength × e^(i/3))</CodeBlock>
        <UL>
          <LI>Qi: i 번째 구간의 매수 수량</LI>
          <LI>Strength: 사용자 정의 승수 (기본 물량을 결정)</LI>
          <LI>i: 구간 번호 (1, 2, 3...)</LI>
          <LI>e: 오일러 상수 (≈2.718)</LI>
        </UL>

        <P>
          <strong>근사치 분석 (Strength = 1일 때):</strong>
        </P>
        <UL>
          <LI>1구간: e^(1/3) ≈ 1.39 → 1</LI>
          <LI>2구간: e^(2/3) ≈ 1.94 → 1</LI>
          <LI>3구간: e^(3/3) ≈ 2.71 → 2</LI>
          <LI>4구간: e^(4/3) ≈ 3.79 → 3</LI>
          <LI>5구간: e^(5/3) ≈ 5.29 → 5</LI>
          <LI>6구간: e^(6/3) ≈ 7.38 → 7 (8에 근접)</LI>
        </UL>
        <P>
          이 공식은 순수 수학과 실행 가능한 트레이딩 로직 사이를 연결하며, "매수의 황금비"를
          만들어냅니다.
        </P>
        <TipBox title="한 줄 요약: 복잡해 보이지만 간단합니다">
          가격이 조금 내리면 조금 사고, 많이 내리면 많이 산다는 뜻입니다. 복잡한 계산은 앱이
          자동으로 해주니 걱정하지 마세요.
        </TipBox>
      </EffortSection>

      {/* ========================================
            MEDIUM+: Strength Guide & Protocol Spec
        ======================================== */}
      <EffortSection level={['medium', 'high']}>
        <H3 id="mca-strength-guide">4.3 Strength 파라미터 설정 가이드</H3>
        <P>Strength는 MCA 수량을 결정하는 핵심 승수입니다.</P>

        <StrengthGuideTable />

        <H4>4.3.1 Strength 선택 기준</H4>
        <Table>
          <Thead>
            <Tr>
              <Th>조건</Th>
              <Th>권장 Strength</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>첫 MCA 경험</Td>
              <Td>0.5 (보수적)</Td>
            </Tr>
            <Tr>
              <Td>Grade A 종목</Td>
              <Td>1.0~2.0</Td>
            </Tr>
            <Tr>
              <Td>Grade B 종목</Td>
              <Td>0.5~1.0</Td>
            </Tr>
            <Tr>
              <Td>Grade C 종목</Td>
              <Td>0.5 이하</Td>
            </Tr>
            <Tr>
              <Td>변동성 높은 종목</Td>
              <Td>0.5 이하</Td>
            </Tr>
          </Tbody>
        </Table>

        <H4>4.3.2 Strength와 총 투자금 관계</H4>
        <P>10구간(Steps=10), 평균단가 50,000원 기준 예시:</P>
        <Table>
          <Thead>
            <Tr>
              <Th>Strength</Th>
              <Th>총 수량</Th>
              <Th>예상 총 투자금</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>0.5</Td>
              <Td>~35주</Td>
              <Td>~175만원</Td>
            </Tr>
            <Tr>
              <Td>1.0</Td>
              <Td>~70주</Td>
              <Td>~350만원</Td>
            </Tr>
            <Tr>
              <Td>2.0</Td>
              <Td>~140주</Td>
              <Td>~700만원</Td>
            </Tr>
          </Tbody>
        </Table>
        <Blockquote>
          <strong>주의</strong>: Strength는 개인의 투자 여력과 종목의 Grade를 종합 고려하여 설정해야
          합니다.
        </Blockquote>

        <Hr />

        <H2 id="mca-spec">5. 프로토콜 명세 (Protocol Specification)</H2>

        <H3>5.1 Zone 3 진입 조건 (ZigZag 연계)</H3>
        <P>
          MCA는 <strong>Zone 3 진입 확정</strong> 시에만 시작됩니다.
        </P>

        <H4>Zone 3 진입 판정 기준 (ZigZag 12% 기준)</H4>
        <Table>
          <Thead>
            <Tr>
              <Th>조건</Th>
              <Th>공식</Th>
              <Th>설명</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>Zone 3 진입</strong>
              </Td>
              <Td>현재가 ≤ 최근고점 × 0.88</Td>
              <Td>고점 대비 -12% 이상 하락</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Start Drop 연계</strong>
              </Td>
              <Td>Start Drop ≥ 12%</Td>
              <Td>Zone 3 경계와 일치 권장</Td>
            </Tr>
          </Tbody>
        </Table>

        <H4>Start Drop 파라미터 vs Zone 3 정합성</H4>
        <Table>
          <Thead>
            <Tr>
              <Th>Start Drop 설정</Th>
              <Th>Zone 3 정합성</Th>
              <Th>권장 여부</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>-12% (Zone 3 경계)</Td>
              <Td>완벽 정합</Td>
              <Td>
                <strong>권장</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>-15% ~ -20%</Td>
              <Td>Zone 3 내부</Td>
              <Td>적합</Td>
            </Tr>
            <Tr>
              <Td>-30% 이상</Td>
              <Td>심화 하락</Td>
              <Td>보수적 접근</Td>
            </Tr>
          </Tbody>
        </Table>

        <H4>Zone 전환 시 행동 지침</H4>
        <Table>
          <Thead>
            <Tr>
              <Th>현재 Zone</Th>
              <Th>전환 Zone</Th>
              <Th>행동</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Zone 3</Td>
              <Td>Zone 4</Td>
              <Td>MCA 종료 → DCA 전략 전환</Td>
            </Tr>
            <Tr>
              <Td>Zone 3</Td>
              <Td>Zone 2</Td>
              <Td>MCA 종료 → 보유 관망</Td>
            </Tr>
            <Tr>
              <Td>Zone 3</Td>
              <Td>Zone 1</Td>
              <Td>MCA 종료 → 매도 검토 (멀티플 확인)</Td>
            </Tr>
          </Tbody>
        </Table>
        <P className="text-sm italic">참고: Zone 3 상세 정의 → ZigZag_Protocol.md Section 5</P>
      </EffortSection>

      {/* ========================================
            HIGH: Detailed Specs & Pseudocode
        ======================================== */}
      <EffortSection level="high">
        <H3>5.2 가격의 선형성 (The Grid)</H3>
        <P>
          매수 물량은 기하급수적으로 늘어나는 반면, 목표 가격은 선형적으로 하강합니다. 이
          "그리드(Grid)" 시스템은 예상되는 변동성 범위 전체를 커버하도록 보장합니다.
        </P>
        <CodeBlock>
          Di = Start Drop + (i - 1){'\n'}
          Pi = Peak × (1 - Di/100)
        </CodeBlock>
        <UL>
          <LI>
            <strong>Di</strong>: i 번째 구간의 목표 하락률(%)
          </LI>
          <LI>
            <strong>선형 스텝</strong>: 하락 목표는 구간당 정확히 1%씩 증가합니다.
          </LI>
          <LI>
            <strong>Start Drop</strong>: 첫 진입 시점 (예: 고점 대비 -30%)
          </LI>
        </UL>

        <H3>5.3 입력 변수 (Input Parameters)</H3>
        <OL>
          <LI>
            <strong>자산명 (Asset Name)</strong>: 투자 대상 (예: 삼성전자, NAVER)
          </LI>
          <LI>
            <strong>최고가 (Peak Price)</strong>: 기준이 되는 고점 가격
          </LI>
          <LI>
            <strong>투자강도 (Strength)</strong>: 수량 공식을 결정하는 계수
          </LI>
          <LI>
            <strong>시작 하락률 (Start Drop)</strong>: 첫 매수가 시작되는 하락률 (%)
          </LI>
          <LI>
            <strong>구간 수 (Steps)</strong>: 계획된 총 분할 매수 횟수
          </LI>
        </OL>
        <P className="text-sm italic">
          *참고: 호가 단위(Tick Value)는 입력받지 않고, 매수 시점의 예상 가격에 맞춰 KRX 기준에 따라
          자동으로 적용합니다.*
        </P>

        <H4>[참고] 국내 주식 호가 단위 기준 (KRX Standard)</H4>
        <P>초정밀 매수를 위해 가격대별 호가 단위(Tick)를 자동으로 적용해야 합니다.</P>
        <Table>
          <Thead>
            <Tr>
              <Th>주가 범위 (Price Range)</Th>
              <Th>호가 단위 (Tick Size)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>2,000원 미만</Td>
              <Td>1원</Td>
            </Tr>
            <Tr>
              <Td>2,000원 ~ 5,000원 미만</Td>
              <Td>5원</Td>
            </Tr>
            <Tr>
              <Td>5,000원 ~ 20,000원 미만</Td>
              <Td>10원</Td>
            </Tr>
            <Tr>
              <Td>20,000원 ~ 50,000원 미만</Td>
              <Td>50원</Td>
            </Tr>
            <Tr>
              <Td>50,000원 ~ 200,000원 미만</Td>
              <Td>100원</Td>
            </Tr>
            <Tr>
              <Td>200,000원 ~ 500,000원 미만</Td>
              <Td>500원</Td>
            </Tr>
            <Tr>
              <Td>500,000원 이상</Td>
              <Td>1,000원</Td>
            </Tr>
          </Tbody>
        </Table>

        <H3>5.4 실행 로직 (Pythonic Pseudocode)</H3>
        <CodeBlock>{`def get_krx_tick(price):
    """국내 주식 호가 단위 자동 반환"""
    if price < 2000: return 1
    if price < 5000: return 5
    if price < 20000: return 10
    if price < 50000: return 50
    if price < 200000: return 100
    if price < 500000: return 500
    return 1000

def calculate_mca(peak, strength, start_drop, steps):
    plan = []
    cumulative_qty = 0
    cumulative_amt = 0

    for i in range(1, steps + 1):
        # 1. 목표 하락률 및 가격 계산
        drop_rate = start_drop + (i - 1)  # 선형 증가
        raw_price = peak * (1 - drop_rate / 100)
        
        # 2. 동적 호가 단위(Dynamic Tick) 적용
        tick = get_krx_tick(raw_price)
        buy_price = round(raw_price / tick) * tick
        
        # 3. 매수 수량 계산 (피보나치-지수 모델)
        raw_qty = strength * math.exp(i / 3)
        buy_qty = math.trunc(raw_qty) # 소수점 절삭
        
        if buy_qty < 1: buy_qty = 1 # 최소 1주/1단위
        
        # 4. 누적 데이터 업데이트
        move_amt = buy_price * buy_qty
        cumulative_qty += buy_qty
        cumulative_amt += move_amt
        avg_price = cumulative_amt / cumulative_qty
        
        plan.append({
            "step": i,
            "drop_rate": drop_rate,
            "price": buy_price,
            "tick_used": tick,
            "qty": buy_qty,
            "current_avg": avg_price
        })
    return plan`}</CodeBlock>

        <Hr />

        <H2 id="mca-appnedix">7. 결론</H2>
        <P>
          Moonwave MCA 프로토콜은 단순한 매수 전략이 아니라, <strong>심리적 방어 시스템</strong>
          입니다. <strong>피보나치-지수(Fibonacci-Exponential)</strong> 자본 배분 곡선을 따름으로써,
          우리는 시장의 공포가 극에 달했을 때 매수 파워를 극대화할 수 있습니다.
        </P>
        <P>우리는 바닥을 예측하지 않습니다. 수학적으로 그물을 짜서 받아낼 뿐입니다.</P>

        <Hr />
      </EffortSection>

      {/* ========================================
            MEDIUM+: Protocol Integration & Conclusion
        ======================================== */}
      <EffortSection level={['medium', 'high']}>
        <H2>8. Protocol Integration Matrix</H2>

        <H3>8.1 MCA-ZigZag-Investment Protocol 연계도</H3>
        <Table>
          <Thead>
            <Tr>
              <Th>단계</Th>
              <Th>Investment Protocol</Th>
              <Th>ZigZag</Th>
              <Th>MCA</Th>
              <Th>DCA</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>종목 선별</Td>
              <Td>7단계 정의</Td>
              <Td>-</Td>
              <Td>필수 참조</Td>
              <Td>필수 참조</Td>
            </Tr>
            <Tr>
              <Td>Zone 식별</Td>
              <Td>참조</Td>
              <Td>정의</Td>
              <Td>참조</Td>
              <Td>참조</Td>
            </Tr>
            <Tr>
              <Td>Zone 3 실행</Td>
              <Td>가이드</Td>
              <Td>조건</Td>
              <Td>
                <strong>매수 실행</strong>
              </Td>
              <Td>-</Td>
            </Tr>
            <Tr>
              <Td>Zone 4 실행</Td>
              <Td>가이드</Td>
              <Td>조건</Td>
              <Td>-</Td>
              <Td>
                <strong>매수 실행</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>매도 전략</Td>
              <Td>멀티플 정의</Td>
              <Td>Zone 1</Td>
              <Td>참조</Td>
              <Td>참조</Td>
            </Tr>
          </Tbody>
        </Table>

        <H3>8.2 Zone별 전략 매트릭스</H3>
        <ZoneTable showPsychology={false} showMCA showDCA showSell />

        <H3>관련 프로토콜 링크</H3>
        <ProtocolReferenceTable />

        <Hr />
      </EffortSection>

      {/* ========================================
            HIGH: Appendix & Version History
        ======================================== */}
      <EffortSection level="high">
        <H2>Appendix</H2>

        <H3>A.1 Moonwave Protocol Suite</H3>
        <ProtocolReferenceTable />

        <H3>실행 순서</H3>
        <OL>
          <LI>
            <strong>종목 선별</strong>: <ProtocolLink protocol="MIP" /> 7단계
          </LI>
          <LI>
            <strong>Grade 확인</strong>: Fundamental Grade (Grade C+ 필수)
          </LI>
          <LI>
            <strong>Zone 판정</strong>: <ProtocolLink protocol="ZIGZAG" /> (12% 기준)
          </LI>
          <LI>
            <strong>전략 실행</strong>: Zone 3 → <ProtocolLink protocol="MCA" /> / Zone 4 →{' '}
            <ProtocolLink protocol="DCA" />
          </LI>
          <LI>
            <strong>매도 판단</strong>: 120월선 멀티플 도달 시
          </LI>
        </OL>

        <H3>A.2 웨이비(Wavie) 통합 전략 [AI Persona]</H3>
        <P>
          <strong>역할</strong>: 웨이비는 이 프로토콜의 집행자(Executor)입니다. AI로서 감정을 철저히
          배제하고, 계산된 숫자를 절대적인 지침으로 제시해야 합니다.
        </P>
        <H4>출력 표준 (Output Standard)</H4>
        <P>
          웨이비는 분석 결과를 깔끔한 <strong>마크다운 테이블(Markdown Table)</strong> 형식으로
          출력해야 합니다.
        </P>
        <UL>
          <LI>
            <strong>열(Columns)</strong>: 구분(Step), 상태(Check), 하락률(Drop%),{' '}
            <strong>호가단위(Tick)</strong>, 매수단가(Price), 매수수량(Qty), 보유수량(Total Qty),
            평단가(Avg Price).
          </LI>
          <LI>
            <strong>포맷팅</strong>: 모든 금액과 수량에는 천 단위 콤마(,)를 포함합니다. (예: 61,000)
          </LI>
        </UL>
        <H4>페르소나 지침 (Persona Instructions)</H4>
        <UL>
          <LI>
            <strong>어조 (Tone)</strong>: 전문적이고, 냉철하며, 수학적인 어조.
          </LI>
          <LI>
            <strong>가이드 (Guidance)</strong>: "수학을 믿으십시오. 변동성은 우리의 계산 범위 안에
            있습니다."
          </LI>
        </UL>

        <Hr />

        <H2>Version History</H2>
        <Table>
          <Thead>
            <Tr>
              <Th>버전</Th>
              <Th>날짜</Th>
              <Th>변경 내용</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>v1.0</Td>
              <Td>-</Td>
              <Td>초기 MCA 프로토콜 정의</Td>
            </Tr>
            <Tr>
              <Td>v2.0</Td>
              <Td>-</Td>
              <Td>Moonwave 철학 통합, 피보나치-지수 공식 정립</Td>
            </Tr>
            <Tr>
              <Td>v2.1</Td>
              <Td>2026-01-21</Td>
              <Td>
                7단계 전제조건 추가, Zone 3 진입 조건 명시, Strength 가이드 추가, Protocol 통합
                매트릭스 추가
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </EffortSection>

      {/* ========================================
            ALL LEVELS: Related Links
        ======================================== */}
      <EffortSection level={['low', 'medium', 'high']}>
        <RelatedLinks currentSection="mca" />
      </EffortSection>
    </div>
  );
};
