import { EffortSection } from '../EffortSection';
import {
  Blockquote,
  CodeBlock,
  H2,
  H3,
  H4,
  Hr,
  IconH1,
  LI,
  MermaidPlaceholder,
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
  PhilosophyQuote,
  PrerequisitesTable,
  ProtocolLink,
  ProtocolReferenceTable,
  RelatedLinks,
  WarningBox,
  ZoneTable,
} from '../components';

export const DCAProtocol = () => (
  <div>
    {/* ========================================
            LOW: Quick Summary Card
        ======================================== */}
    <EffortSection level="low">
      <SummaryCard
        title="DCA (Dollar Cost Averaging)"
        icon="Coins"
        definition="일정 주기(매주/매월)로 일정 금액을 투자하여 시간을 분산하는 정액 매수 전략"
        keyPoints={[
          'Zone 4 (반등 초기)에서 시작 - MCA 종료 후 전환',
          '매주 1회, 일정 금액 투자 권장',
          'Grade C+ (50점 이상) 종목에만 적용',
          '증권사 자동주문으로 자동화 가능',
        ]}
        actionItems={[
          'Zone 4 진입 확인 (저점 대비 +12% 전)',
          '증권사 "주식모으기" 기능 설정',
          '월 투자금의 1/4씩 매주 투자',
        ]}
        navigateTo="dca"
      />
    </EffortSection>

    <EffortSection level={['medium', 'high']}>
      <IconH1 icon="Coins">DCA (Dollar Cost Averaging) Protocol Whitepaper v1.4</IconH1>
      <Blockquote>
        <strong>부제</strong>: 시간을 내 편으로 만드는 꾸준한 자산 축적 전략
        <br />
        <strong>전제 조건</strong>: DCA 대상 종목은 반드시{' '}
        <strong>Moonwave Investment Protocol 7단계 선별 프로세스</strong>를 통과한 종목(Grade C
        이상)이어야 합니다.
      </Blockquote>

      <Hr />

      <H2 id="dca-executive-summary">1. 핵심 요약 (Executive Summary)</H2>

      <H3>1.1 DCA Protocol 한 줄 정의</H3>
      <Blockquote>
        <strong>DCA (Dollar Cost Averaging)</strong>는 <strong>Zone 4 (반등 초기 구간)</strong>에서
        시작하여, <strong>일정 주기(매일/매주)</strong>로 <strong>일정 금액</strong>을 투자하여 평균
        매수 단가를 안정화하고 장기적으로 자산을 축적하는 전략입니다.
      </Blockquote>

      <H3 id="dca-vs-mca">1.2 DCA vs MCA 비교 (Zone 연계)</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>구분</Th>
            <Th>DCA (Dollar Cost Averaging)</Th>
            <Th>MCA (Moonwave Cost Averaging)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>철학</strong>
            </Td>
            <Td>시간 분산 투자</Td>
            <Td>가격 분산 투자</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>시작 Zone</strong>
            </Td>
            <Td>
              <strong>Zone 4</strong> (반등 초기)
            </Td>
            <Td>
              <strong>Zone 3</strong> (하락 진행)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>매수 조건</strong>
            </Td>
            <Td>
              <strong>무조건</strong> (정해진 주기)
            </Td>
            <Td>
              <strong>조건부</strong> (하락 시에만)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>매수 주기</strong>
            </Td>
            <Td>매일/매주/매월</Td>
            <Td>가격 하락률 도달 시</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>매수 금액</strong>
            </Td>
            <Td>
              <strong>일정 금액</strong>
            </Td>
            <Td>하락률에 따라 기하급수적 증가</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>적용 대상</strong>
            </Td>
            <Td>
              <strong>7단계 선별 통과 종목</strong> (Grade C+)
            </Td>
            <Td>
              <strong>7단계 선별 통과 종목</strong> (Grade C+)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>심리적 부담</strong>
            </Td>
            <Td>낮음 (자동화)</Td>
            <Td>중간 (하락 시 매수)</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>플랫폼</strong>
            </Td>
            <Td>증권사 자동주문</Td>
            <Td>수동 또는 MTS</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3>1.3 Quick Reference</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>항목</Th>
            <Th>Moonwave 표준 설정</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>전제 조건</strong>
            </Td>
            <Td>
              <strong>Moonwave Investment Protocol 7단계 선별 통과</strong> (Grade C 이상)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>시작 Zone</strong>
            </Td>
            <Td>
              <strong>Zone 4</strong> (저점 대비 +12% 전)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>투자 주기</strong>
            </Td>
            <Td>매주 1회 (권장) 또는 매일</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>투자 금액</strong>
            </Td>
            <Td>월 투자 가능 금액의 1/4 (주간)</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>플랫폼</strong>
            </Td>
            <Td>증권사 자동주문 (예: 토스증권 등)</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>수수료</strong>
            </Td>
            <Td>
              <strong>무료</strong> (2024.08~)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>대상 자산</strong>
            </Td>
            <Td>7단계 선별 통과 종목 (ETF, 배당주 등)</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3>1.4 Zone 연계 Quick Reference</H3>
      <ZoneTable showPsychology={false} showMCA showDCA />

      <Hr />

      <H2 id="dca-philosophy">2. 서론: DCA의 철학</H2>

      <H3>2.1 전제 조건: Moonwave Investment Protocol 7단계 선별</H3>
      <WarningBox type="info" id="check-dca-prereq">
        <strong>
          "DCA 대상 종목은 반드시 Moonwave Investment Protocol 7단계 선별 프로세스를 통과해야
          합니다."
        </strong>
      </WarningBox>
      <P>
        DCA의 핵심은 <strong>"좋은 자산을 꾸준히 모으는 것"</strong>입니다. 아무리 꾸준히 모아도{' '}
        <strong>질이 낮은 자산</strong>을 모으면 의미가 없습니다.
      </P>

      <H4>7단계 선별 프로세스 요약</H4>
      <P>
        <strong>상세 기준:</strong> 7단계 선별 프로세스의 자세한 정량적 기준은{' '}
        <ProtocolLink protocol="MIP" /> 문서를 참고하세요.
      </P>

      <H4>DCA 대상 종목 자격 요건</H4>
      <PrerequisitesTable type="DCA" />
      <WarningBox type="danger" id="check-grade-d-ban-dca">
        <strong>Grade D 종목 (50점 미만)</strong>은 DCA 대상에서 <strong>완전 배제</strong>됩니다.
      </WarningBox>
      <P className="text-sm italic">
        참고: 7단계 선별 프로세스 상세 내용은 <ProtocolLink protocol="MIP" /> 참조
      </P>
    </EffortSection>

    {/* ========================================
            HIGH: Philosophy & Protocol Links
        ======================================== */}
    <EffortSection level="high">
      <H3>2.2 관련 프로토콜 상호 연계</H3>
      <P>
        <strong>양방향 연계</strong>: 본 문서는 아래 프로토콜들과 상호 참조됩니다.
      </P>

      <H4>Protocol Suite 연계도</H4>
      <ProtocolReferenceTable />

      <Hr />

      <H3>2.3 Moonwave 투자 철학과 DCA</H3>
      <PhilosophyQuote />
      <P>
        DCA는 Moonwave 철학의 핵심 가치인 <strong>'지속가능한 성장(Sustainable Growth)'</strong>을
        실현하는 가장 단순하면서도 강력한 전략입니다.
      </P>
      <UL>
        <LI>
          <strong>파동적 균형</strong>: 시장의 상승과 하락에 흔들리지 않고 꾸준히 투자
        </LI>
        <LI>
          <strong>자동화와 효율성</strong>: 감정을 배제하고 시스템으로 투자
        </LI>
        <LI>
          <strong>흐름 중심의 사고</strong>: 단기 등락이 아닌 장기 흐름에 집중
        </LI>
      </UL>

      <H3>2.4 왜 DCA인가?</H3>
      <P>
        <strong>투자자의 딜레마:</strong> "지금이 살 때인가?", "더 떨어지면 어떡하지?", "올라갈 때
        샀어야 했나?"
      </P>
      <P>
        이러한 고민은 <strong>타이밍의 함정</strong>입니다. 연구에 따르면 전문 투자자도 시장
        타이밍을 정확히 맞추기 어렵습니다.
      </P>
      <P>
        <strong>DCA의 해답:</strong>
      </P>
      <UL>
        <LI>타이밍을 맞추려 하지 않음</LI>
        <LI>
          <strong>시간</strong>을 분산하여 가격 변동 리스크 완화
        </LI>
        <LI>높을 때는 적게, 낮을 때는 많이 자동으로 매수</LI>
      </UL>

      <H3>2.5 DCA의 수학적 원리</H3>
      <P>
        <strong>일정 금액 투자 시 자동 평균화:</strong>
      </P>
      <Table>
        <Thead>
          <Tr>
            <Th>월</Th>
            <Th>주가</Th>
            <Th>투자금</Th>
            <Th>매수 주수</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1월</Td>
            <Td>10,000원</Td>
            <Td>100,000원</Td>
            <Td>10주</Td>
          </Tr>
          <Tr>
            <Td>2월</Td>
            <Td>8,000원</Td>
            <Td>100,000원</Td>
            <Td>12.5주</Td>
          </Tr>
          <Tr>
            <Td>3월</Td>
            <Td>12,000원</Td>
            <Td>100,000원</Td>
            <Td>8.3주</Td>
          </Tr>
          <Tr>
            <Td>4월</Td>
            <Td>10,000원</Td>
            <Td>100,000원</Td>
            <Td>10주</Td>
          </Tr>
        </Tbody>
      </Table>
      <P>
        <strong>결과:</strong>
      </P>
      <UL>
        <LI>총 투자금: 400,000원</LI>
        <LI>총 보유 주수: 40.8주</LI>
        <LI>
          평균 매수 단가: 400,000 ÷ 40.8 = <strong>9,804원</strong>
        </LI>
        <LI>단순 평균 주가: 10,000원</LI>
      </UL>
      <P>
        <strong>핵심</strong>: 일정 금액 투자 시, 주가가 낮을 때 더 많은 주수를 매수하게 되어{' '}
        <strong>평균 단가가 단순 평균보다 낮아집니다.</strong>
      </P>

      <Hr />
    </EffortSection>

    {/* ========================================
            MEDIUM+: DCA Detailed Definition
        ======================================== */}
    <EffortSection level={['medium', 'high']}>
      <H2 id="dca-definition">3. DCA 상세 정의</H2>

      <H3>3.1 DCA의 5가지 핵심 원칙</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>원칙</Th>
            <Th>설명</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>1. 규칙성</strong>
            </Td>
            <Td>
              정해진 주기에 <strong>반드시</strong> 투자 (예외 없음)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>2. 일관성</strong>
            </Td>
            <Td>동일한 금액을 투자 (시장 상황 무관)</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>3. 자동화</strong>
            </Td>
            <Td>수동 개입 최소화, 시스템에 맡김</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>4. 장기성</strong>
            </Td>
            <Td>최소 1년 이상, 권장 3~5년 이상 유지</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>5. 분산성</strong>
            </Td>
            <Td>단일 종목보다 ETF 또는 복수 종목 권장</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3>3.2 DCA가 효과적인 상황</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>상황</Th>
            <Th>DCA 효과</Th>
            <Th>이유</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>횡보장</strong>
            </Td>
            <Td>★★★ 매우 효과적</Td>
            <Td>변동 속에서 평균화 극대화</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>하락 후 회복</strong>
            </Td>
            <Td>★★★ 매우 효과적</Td>
            <Td>하락 시 많이 매수, 회복 시 수익</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>완만한 상승</strong>
            </Td>
            <Td>★★ 효과적</Td>
            <Td>꾸준한 자산 축적</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>급격한 상승</strong>
            </Td>
            <Td>★ 보통</Td>
            <Td>초기 일괄 투자 대비 수익 낮음</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>지속적 하락</strong>
            </Td>
            <Td>⚠️ 주의</Td>
            <Td>자산 가치 자체가 하락 (종목 선택 중요)</Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="dca-auto-guide">4. 자동 적립식 투자 가이드</H2>
      <P>
        증권사(예: 토스증권, 미니스탁 등)의 '자동 모으기' 기능을 활용하면 DCA를 쉽게 자동화할 수
        있습니다.
      </P>

      <H3>4.1 설정 방법 (일반적 프로세스)</H3>
      <P>
        <strong>Step 1: 토스앱 접속</strong>
      </P>
      <CodeBlock>토스앱 실행 → 하단 '증권' 탭 → '주식모으기' 메뉴</CodeBlock>
      <P>
        <strong>Step 2: 종목 선택</strong>
      </P>
      <CodeBlock>모으기 할 종목 검색 → 종목 선택 → '모으기 설정'</CodeBlock>
      <P>
        <strong>Step 3: 주기 및 금액 설정</strong>
      </P>
      <CodeBlock>
        투자 주기 선택: 매일 / 매주(요일) / 매월(날짜){'\n'}투자 금액 설정: 국내(주 단위), 해외(금액
        단위)
      </CodeBlock>
      <P>
        <strong>Step 4: 자동이체 연결</strong>
      </P>
      <CodeBlock>결제 계좌 연결 → 자동이체 설정 → 완료</CodeBlock>

      <H3>4.2 자동 매수(모으기) vs 일반 매수 비교</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>구분</Th>
            <Th>자동 매수 (모으기)</Th>
            <Th>일반 매수</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>실행 방식</strong>
            </Td>
            <Td>자동</Td>
            <Td>수동</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>수수료</strong>
            </Td>
            <Td>
              <strong>무료</strong>
            </Td>
            <Td>국내 0.015%, 해외 0.1%</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>최소 단위</strong>
            </Td>
            <Td>해외 1,000원~</Td>
            <Td>1주</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>적합한 용도</strong>
            </Td>
            <Td>장기 적립식</Td>
            <Td>단기/중기 매매</Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="dca-strategy">5. Moonwave DCA 전략 설계</H2>

      <H3>5.1 투자 주기 선택 가이드</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>주기</Th>
            <Th>특징</Th>
            <Th>권장 대상</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>매일</strong>
            </Td>
            <Td>최대 분산, 심리 부담 최소</Td>
            <Td>변동성 높은 자산, 소액 투자자</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>매주</strong>
            </Td>
            <Td>균형잡힌 분산, 관리 용이</Td>
            <Td>
              <strong>대부분의 투자자 (권장)</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>매월</strong>
            </Td>
            <Td>최소 분산, 큰 금액 가능</Td>
            <Td>급여 기반 투자, 안정 자산</Td>
          </Tr>
        </Tbody>
      </Table>
      <P>
        <strong>Moonwave 권장: 매주 1회 (월요일)</strong>
      </P>

      <H3>5.2 120월선 멀티플 진입 조건</H3>
      <P>
        DCA 대상 종목은 <strong>120월선 멀티플 ≤ 1.2</strong> 조건도 권장합니다.
      </P>
      <Table>
        <Thead>
          <Tr>
            <Th>멀티플 범위</Th>
            <Th>진입 적합성</Th>
            <Th>DCA 비중</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>&lt; 0.8</strong>
            </Td>
            <Td>★★★ 최적</Td>
            <Td>최대</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>0.8 ~ 1.0</strong>
            </Td>
            <Td>★★ 양호</Td>
            <Td>표준</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>1.0 ~ 1.2</strong>
            </Td>
            <Td>★ 적합</Td>
            <Td>표준</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>&gt; 1.2</strong>
            </Td>
            <Td>⚠️ 고평가</Td>
            <Td>신중/대기</Td>
          </Tr>
        </Tbody>
      </Table>

      <H4>5.2.1 멀티플과 Zone의 조합</H4>
      <Table>
        <Thead>
          <Tr>
            <Th>Zone</Th>
            <Th>멀티플</Th>
            <Th>권장 행동</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Zone 4</Td>
            <Td>≤ 1.2</Td>
            <Td>
              <strong>DCA 적극 실행</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>Zone 4</Td>
            <Td>&gt; 1.2</Td>
            <Td>DCA 소량 또는 대기</Td>
          </Tr>
          <Tr>
            <Td>Zone 3</Td>
            <Td>≤ 1.2</Td>
            <Td>MCA 실행 (DCA 대기)</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3 id="dca-zone-cycle">5.3 Moonwave Zone Cycle: 완전한 매매 사이클</H3>
      <P>
        ZigZag Zone 1~4를 순환하며 MCA/DCA 전략을 체계적으로 실행하고, 120월선 멀티플 도달 시
        매도하는 완전한 매매 사이클입니다.
      </P>

      <MermaidPlaceholder
        title="Zone Cycle"
        code={`graph TD
    START[사이클 시작] --> Z3[Zone 3 진입<br/>고점 -12%]

    Z3 --> MCA_START[MCA 시작<br/>분할 매수]
    MCA_START --> Z4[Zone 4 진입<br/>반등 시작]

    Z4 --> SWITCH[MCA 종료<br/>DCA 시작]
    SWITCH --> Z1[Zone 1 진입<br/>저점 +12%]

    Z1 --> STOP_ALL[MCA/DCA 모두 종료<br/>홀딩 모드]
    STOP_ALL --> SELL_CHECK{120월선<br/>멀티플 도달?}

    SELL_CHECK -->|Yes| SELL[매도 실행]
    SELL --> SUCCESS[사이클 완료 🎯<br/>수익 실현]

    SELL_CHECK -->|No| Z2[Zone 2 진입<br/>관망]

    Z2 --> PROFIT_CHECK{계좌 평단가<br/>수익 상태?}

    PROFIT_CHECK -->|평단가 +| Z3
    PROFIT_CHECK -->|평단가 -| LOSS[손실 관리<br/>별도 전략]

    LOSS --> Z3

    SUCCESS --> NEW_CYCLE[새 종목/사이클<br/>시작 검토]`}
      />

      <H4>5.3.1 Zone별 전략 상세 매트릭스</H4>
      <Table>
        <Thead>
          <Tr>
            <Th>Zone</Th>
            <Th>진입 조건</Th>
            <Th>핵심 행동</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>Zone 3 시작</strong>
            </Td>
            <Td>고점 대비 -12% 돌파</Td>
            <Td>MCA 분할 매수 실행</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Zone 4 시작</strong>
            </Td>
            <Td>저점 대비 상승 시작</Td>
            <Td>MCA→DCA 전환</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Zone 1 진입</strong>
            </Td>
            <Td>저점 대비 +12% 돌파</Td>
            <Td>홀딩, 120월선 멀티플 매도</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Zone 2 진입</strong>
            </Td>
            <Td>고점 형성 후 하락</Td>
            <Td>평단가 확인, 다음 사이클 준비</Td>
          </Tr>
        </Tbody>
      </Table>

      <H4>5.3.2 120월선 멀티플 매도 전략</H4>
      <CodeBlock>
        매도 목표가 = 120월선 × 멀티플 배수{'\n'}
        예시) 120월선 80,000원 × 멀티플 1.3 = 104,000원
      </CodeBlock>

      <Hr />
    </EffortSection>

    {/* ========================================
            HIGH: Appendix & Version History
        ======================================== */}
    <EffortSection level="high">
      <H2>Appendix</H2>

      <H3>A. 용어 정의집 (Glossary)</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>용어</Th>
            <Th>정의</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>DCA</Td>
            <Td>정기적 일정 금액 투자 전략</Td>
          </Tr>
          <Tr>
            <Td>평균 매수 단가</Td>
            <Td>총 투자금 ÷ 총 보유 수량</Td>
          </Tr>
          <Tr>
            <Td>주식모으기</Td>
            <Td>토스증권의 자동 적립식 투자 서비스</Td>
          </Tr>
          <Tr>
            <Td>Zone 4</Td>
            <Td>저점에서 +12% 전까지의 반등 초기 구간 (DCA 시작점)</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3>B. 자동 투자 플랫폼 요약</H3>
      <Blockquote>
        최근 대부분의 증권사(토스, 카카오페이, 미니스탁 등)에서 소수점/금액 단위 투자를 지원합니다.
        <br />
        수수료 혜택이 있는 플랫폼을 선택하여 거래 비용을 최소화하세요.
      </Blockquote>

      <H3>C. 버전 히스토리</H3>
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
            <Td>2026-01-21</Td>
            <Td>초기 문서 생성, 토스증권 주식모으기 가이드 포함</Td>
          </Tr>
          <Tr>
            <Td>v1.1</Td>
            <Td>2026-01-21</Td>
            <Td>Zone 4 시작 개념 추가, ZigZag Protocol 연계</Td>
          </Tr>
          <Tr>
            <Td>v1.2</Td>
            <Td>2026-01-21</Td>
            <Td>Moonwave Zone Cycle 완전 매매 사이클 추가</Td>
          </Tr>
          <Tr>
            <Td>v1.3</Td>
            <Td>2026-01-21</Td>
            <Td>Moonwave Investment Protocol 7단계 선별 프로세스 통과 종목 전제 조건 추가</Td>
          </Tr>
          <Tr>
            <Td>v1.4</Td>
            <Td>2026-01-21</Td>
            <Td>양방향 상호참조 추가, Protocol Suite 통합 흐름도 추가</Td>
          </Tr>
        </Tbody>
      </Table>
    </EffortSection>

    {/* ========================================
            ALL LEVELS: Related Links
        ======================================== */}
    <EffortSection level={['low', 'medium', 'high']}>
      <RelatedLinks currentSection="dca" />
    </EffortSection>
  </div>
);
