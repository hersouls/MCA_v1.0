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
  PhilosophyQuote,
  ProtocolLink,
  RelatedLinks,
  TipBox,
  WarningBox,
  ZoneTable,
} from '../components';

export const ZigZagProtocol = () => (
  <div>
    {/* ========================================
            LOW: Quick Summary Card
        ======================================== */}
    <EffortSection level="low">
      <SummaryCard
        title="Zone 판정 (ZigZag Protocol)"
        icon="BarChart3"
        definition="12% 이상 가격 변동을 기준으로 현재 시장 위치(Zone 1~4)를 판정하는 기술적 분석 도구"
        keyPoints={[
          'Zone 1 (상승 확정): 저점 +12% 이상 → 추격 매수 자제',
          'Zone 2 (고점 근처): 고점 ~ -12% → 관망',
          'Zone 3 (하락 진행): 고점 -12% 이하 → MCA 매집',
          'Zone 4 (반등 초기): 저점 ~ +12% → DCA 전환',
        ]}
        actionItems={[
          'ZigZag 지표 설정: Deviation 12%, Depth 12, Backstep 3',
          '현재가가 고점/저점 대비 몇 % 위치인지 계산',
          'Zone에 맞는 전략 실행',
        ]}
        navigateTo="zigzag"
      />
      <img
        src="/images/handbook/zone_diagram.png"
        alt="ZigZag Zone Diagram"
        className="w-full rounded-lg shadow-md mb-6 border border-zinc-200 dark:border-zinc-700"
      />
    </EffortSection>

    <EffortSection level={['medium', 'high']}>
      <IconH1 icon="BarChart3">ZigZag Protocol Whitepaper v2.2</IconH1>
      <Blockquote>
        <strong>부제</strong>: 주식 차트는 직선이 아니라 '파동(Wave)'으로 움직인다
      </Blockquote>

      <Hr />

      <H2 id="zigzag-summary">1. 핵심 요약</H2>

      <H3>1.1 ZigZag Protocol 한 줄 정의</H3>
      <Blockquote>
        <strong>ZigZag 지표</strong>는 12% 이상의 의미 있는 가격 변동만을 연결하여 차트의 노이즈를
        제거하고, 핵심 파동의 고점과 저점을 시각화하는 기술적 분석 도구입니다.
      </Blockquote>

      <H3>1.2 Moonwave 표준 설정</H3>
      <Table>
        <Thead>
          <Tr>
            <Th>항목</Th>
            <Th>설정값</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>Deviation (편차)</strong>
            </Td>
            <Td>
              <strong>12%</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Depth (깊이)</strong>
            </Td>
            <Td>12</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Backstep (백스텝)</strong>
            </Td>
            <Td>3</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>적용 대상</strong>
            </Td>
            <Td>중장기 투자, 대세 파악</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3>1.3 Zone System Quick Reference</H3>
      <ZoneTable showPsychology={false} showMCA showDCA />

      <H3>1.4 전제 조건: Moonwave Investment Protocol 연계</H3>
      <WarningBox type="warning" id="check-zigzag-mip-link">
        <strong>중요</strong>: ZigZag 지표는 기술적 분석 도구이나,{' '}
        <strong>
          Zone 3 <ProtocolLink protocol="MCA" /> 실행
        </strong>{' '}
        및{' '}
        <strong>
          Zone 4 <ProtocolLink protocol="DCA" /> 실행
        </strong>{' '}
        시 반드시 <ProtocolLink protocol="MIP" /> 7단계 선별 완료 종목에만 적용해야 합니다. (Grade C
        이상)
      </WarningBox>

      <Hr />

      <H2 id="zigzag-philosophy">2. 서론: 왜 내가 사면 떨어지고, 팔면 오를까?</H2>

      <H3>2.1 선형적 사고의 함정</H3>
      <P>
        주식 시장에 갓 진입한 투자자들이 범하는 가장 치명적인 오류는{' '}
        <strong>'선형적 사고(Linear Thinking)'</strong>입니다.
      </P>
      <UL>
        <LI>호재가 나오면 주가가 수직 상승할 것이라 기대</LI>
        <LI>조금만 떨어져도 추세가 꺾였다고 공포에 휩싸임</LI>
        <LI>상승이 계속되면 영원히 오를 것 같은 착각</LI>
      </UL>
      <CodeBlock>
        [선형적 사고의 악순환]{'\n'}
        호재 발생 → "오른다!" → 추격 매수 (고점){'\n'}↓{'\n'}
        조정 시작 → "꺾였다!" → 공포 매도 (저점){'\n'}↓{'\n'}
        반등 시작 → "다시 오른다!" → 추격 매수 (고점)
      </CodeBlock>

      <H3>2.2 파동적 현실 (Wave Reality)</H3>
      <P>
        하지만 <strong>주식 차트는 '파동(Wave)'으로 이루어져 있습니다.</strong>
      </P>
      <Blockquote>
        산이 높으면 골이 깊다는 말처럼, 상승 에너지가 분출되면 조정이 오고, 하락이 깊어지면 반발
        매수세에 의한 반등이 옵니다.
      </Blockquote>

      <H3>2.3 해결책: 파동의 객관적 시각화</H3>
      <P>
        이 악순환을 끊기 위해서는 주관적인 '감'을 배제하고,{' '}
        <strong>파동을 객관적으로 시각화할 수 있는 도구</strong>가 필요합니다. 그 도구가 바로{' '}
        <strong>ZigZag 지표</strong>입니다.
      </P>

      <Hr />

      <H2 id="zigzag-definition">3. ZigZag 지표란 무엇인가?</H2>
      <Table>
        <Thead>
          <Tr>
            <Th>항목</Th>
            <Th>내용</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>Definition</strong>
            </Td>
            <Td>
              설정된 비율(%) 이상의 가격 변동만을 연결하여 차트으 노이즈를 제거하고 핵심 파동만
              시각화하는 기술적 지표
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>핵심 원리</strong>
            </Td>
            <Td>설정된 임계값(%) 미만의 가격 변동은 무시하고, 의미 있는 전환점만 직선으로 연결</Td>
          </Tr>
        </Tbody>
      </Table>

      <H3>3.1 ZigZag가 필요한 5가지 이유</H3>
      <OL>
        <LI>
          <strong>노이즈 제거</strong>: 12% 미만의 작은 변동은 무시
        </LI>
        <LI>
          <strong>고점/저점의 객관적 식별</strong>: 수치 기반의 객관적 판단
        </LI>
        <LI>
          <strong>현재 위치 인식</strong>: 파동의 어느 위치에 있는지 파악
        </LI>
        <LI>
          <strong>패턴 분석 용이</strong>: 더블 탑, 더블 바텀 패턴 식별
        </LI>
        <LI>
          <strong>감정 배제</strong>: 숫자(12%) 기준의 의사결정
        </LI>
      </OL>

      <Hr />

      <H2 id="zigzag-parameters">4. ZigZag 파라미터 상세 가이드</H2>
      <H3>4.1 Deviation (편차) - 가장 중요한 파라미터</H3>
      <P>
        <strong>Moonwave가 12%를 선택한 이유:</strong>
      </P>
      <OL>
        <LI>
          <strong>노이즈 최소화</strong>: 일상적인 5~10% 변동은 무시
        </LI>
        <LI>
          <strong>중장기 관점</strong>: 단기 등락에 흔들리지 않고 큰 그림 파악
        </LI>
        <LI>
          <strong>감정 배제</strong>: 작은 조정에 공포 매도하는 실수 방지
        </LI>
        <LI>
          <strong>MCA 연계</strong>: MCA 프로토콜의 시작 하락률(-12%)과 조화
        </LI>
      </OL>

      <Hr />

      <H2 id="zigzag-zone-system">5. ZigZag Zone System: 파동의 4구간 분류</H2>
      <P>
        ZigZag의 12% Deviation을 기준으로, 파동은 <strong>4개의 구간(Zone)</strong>으로 나뉩니다.
      </P>

      <CodeBlock>
        ┌─────────────────┐{'\n'}│ 고점 (Peak) │{'\n'}
        └────────┬────────┘{'\n'}│{'\n'}
        ┌────────────────────────┼────────────────────────┐{'\n'}│ │ │{'\n'}│ Zone 2 │ Zone 2 │
        {'\n'}│ (고점~-12%) │ (고점~-12%) │{'\n'}│ │ │{'\n'}
        ├────────────────────────┤ ← -12% 라인 ───────────┤{'\n'}│ │ │{'\n'}│ Zone 3 │ Zone 3 │
        {'\n'}│ (-12%~저점) │ (-12%~저점) │{'\n'}│ │ │{'\n'}
        └────────────────────────┼────────────────────────┘{'\n'}│{'\n'}
        ┌────────┴────────┐{'\n'}│ 저점 (Low) │{'\n'}
        └────────┬────────┘{'\n'}│{'\n'}
        ┌────────────────────────┼────────────────────────┐{'\n'}│ │ │{'\n'}│ Zone 4 │ Zone 4 │
        {'\n'}│ (저점~+12%) │ (저점~+12%) │{'\n'}│ │ │{'\n'}
        ├────────────────────────┤ ← +12% 라인 ───────────┤{'\n'}│ │ │{'\n'}│ Zone 1 │ Zone 1 │
        {'\n'}│ (+12% 이상) │ (+12% 이상) │{'\n'}│ │ │{'\n'}
      </CodeBlock>

      <H3>5.1 Zone 상세 정의</H3>

      <H4>Zone 1: 상승 확정 구간</H4>
      <P>
        <strong>정의:</strong> 저점에서 <strong>+12% 이상</strong> 반등한 구간입니다. ZigZag 지표가
        새로운 저점을 확정하고, 상승 추세로 전환되었음을 의미합니다.
      </P>
      <P>
        <strong>시장 심리:</strong> 이 구간에서 대부분의 투자자들은 탐욕에 휩싸입니다. "더 오를 것
        같다", "지금 안 사면 늦는다"는 생각이 지배합니다. 뉴스에는 낙관적인 전망이 쏟아지고,
        주변에서도 "그 주식 올랐더라"는 이야기가 들려옵니다.
      </P>
      <P>
        <strong>왜 매수하면 안 되나요?</strong> 이미 저점에서 12% 이상 올랐다는 것은 '쉽게 살 수
        있는 타이밍'이 지났다는 의미입니다. 이 시점에 매수하면 고점 추격이 될 가능성이 높습니다.
        설령 더 오르더라도, 조정이 오면 심리적으로 버티기 어렵습니다.
      </P>
      <P>
        <strong>Moonwave 전략:</strong> 이미 보유 중이라면 유지합니다. 신규 매수는 자제하고, 120월선
        멀티플이 목표치(2.0~3.0)에 도달하면 분할 매도를 검토합니다.
      </P>

      <H4>Zone 2: 고점 근처 구간</H4>
      <P>
        <strong>정의:</strong> 고점에서 <strong>-12% 이내</strong>의 구간입니다. 아직 의미 있는
        하락이 시작되지 않은 상태로, 고점 부근에서 횡보하거나 소폭 조정 중인 구간입니다.
      </P>
      <P>
        <strong>시장 심리:</strong> 불안감이 시작되는 구간입니다. "혹시 떨어지나?", "고점에서
        팔걸"이라는 후회가 스멀스멀 올라옵니다. 하지만 아직 -12%를 넘지 않았기 때문에 "곧 다시
        오르겠지"라는 희망도 공존합니다.
      </P>
      <P>
        <strong>왜 관망해야 하나요?</strong> 이 구간은 방향성이 불명확합니다. 다시 상승할 수도 있고,
        본격적인 하락이 시작될 수도 있습니다. 확률적으로 유리하지 않은 구간에서 베팅하는 것은
        Moonwave 철학에 맞지 않습니다.
      </P>
      <P>
        <strong>Moonwave 전략:</strong> 신규 매수 금지. 기존 보유분은 유지하되, 포지션 축소(분할
        매도)를 고려할 수 있습니다.
      </P>

      <H4>Zone 3: 하락 진행 구간 (MCA 핵심 구간)</H4>
      <P>
        <strong>정의:</strong> 고점 대비 <strong>-12% 이상</strong> 하락한 구간입니다. ZigZag 지표
        기준으로 의미 있는 하락이 확정되었으며, 새로운 저점을 향해 진행 중인 구간입니다.
      </P>
      <P>
        <strong>시장 심리:</strong> 공포가 지배하는 구간입니다. "더 떨어지면 어떡하지", "손절해야
        하나", "이 회사 망하는 거 아냐?"라는 생각이 머릿속을 가득 채웁니다. 뉴스에는 비관적인 전망이
        쏟아지고, 주변에서도 "주식은 위험해"라는 말이 들려옵니다.
      </P>
      <P>
        <strong>왜 이때 매수하나요?</strong> 역설적으로 이때가 기회입니다. 모두가 팔고 싶어할 때
        사는 것이 저렴하게 살 수 있는 유일한 방법입니다. 물론 아무 종목이나 사면 안 됩니다. MIP
        7단계를 통과한 펀더멘털이 탄탄한 종목(Grade C 이상)만 매수 대상입니다. 좋은 회사는 하락해도
        결국 회복합니다.
      </P>
      <P>
        <strong>Moonwave 전략:</strong> MCA 매집 실행. 주가가 떨어질수록 더 많이 사는 분할 매수를
        통해 평균 단가를 낮춥니다.
        <br />
        <br />
        <strong>Next Action:</strong> <ProtocolLink protocol="MCA" />
      </P>
      <TipBox title="Zone 3 진입 전 체크리스트" id="check-zigzag-zone3-checklist">
        Zone 3에 진입했다고 바로 매수하지 마세요. 먼저 해당 종목이 MIP 7단계 선별을 통과했는지(Grade
        C 이상), 120월선이 우상향인지, 멀티플이 1.2 이하인지 반드시 확인하세요.
      </TipBox>

      <H4>Zone 4: 반등 초기 구간</H4>
      <P>
        <strong>정의:</strong> 저점에서 <strong>+12% 이내</strong>로 반등한 구간입니다. 바닥을 찍고
        상승하기 시작했지만, 아직 상승 추세가 확정되지 않은 상태입니다.
      </P>
      <P>
        <strong>시장 심리:</strong> 희망이 싹트는 구간입니다. "바닥 찍었나?", "이제 오르려나?"라는
        기대가 생기지만, 동시에 "또 떨어지면 어떡하지"라는 불안도 남아있습니다. 확신이 없는
        상태입니다.
      </P>
      <P>
        <strong>왜 MCA에서 DCA로 전환하나요?</strong> Zone 3에서 적극적으로 매집했다면, Zone 4에서는
        속도를 늦춥니다. 이미 상당량을 저점 근처에서 매수했기 때문에, 추가 매수는 소량으로
        진행합니다. 만약 다시 하락하면 Zone 3로 돌아가 MCA를 재개하고, 계속 상승하면 Zone 1로
        전환되어 매수를 종료합니다.
      </P>
      <P>
        <strong>Moonwave 전략:</strong> MCA 종료, DCA(정액 매수)로 전환하여 소량 매수. 또는 관망하며
        Zone 1 전환을 대기합니다.
        <br />
        <br />
        <strong>Next Action:</strong> <ProtocolLink protocol="DCA" />
      </P>

      <H3>5.2 Zone 판정 플로우차트</H3>
      <MermaidPlaceholder
        title="Zone Flow"
        code={`graph TD
    START[현재가 분석] --> Q1{직전 전환점 유형?}

    Q1 -->|고점 이후| HIGH_PATH[고점 기준 분석]
    Q1 -->|저점 이후| LOW_PATH[저점 기준 분석]

    HIGH_PATH --> Q2{고점 대비 하락률?}
    Q2 -->|"-12% 미만"| Z2[Zone 2<br/>고점 근처]
    Q2 -->|"-12% 이상"| Z3[Zone 3<br/>하락 진행]

    LOW_PATH --> Q3{저점 대비 상승률?}
    Q3 -->|"+12% 미만"| Z4[Zone 4<br/>반등 초기]
    Q3 -->|"+12% 이상"| Z1[Zone 1<br/>상승 확정]

    Z1 --> S1[전략: 보유 유지<br/>추격 매수 자제]
    Z2 --> S2[전략: 매수 금지<br/>매도 고려]
    Z3 --> S3[전략: MCA 매집<br/>분할 매수]
    Z4 --> S4[전략: 관망<br/>소량 매수]`}
      />

      <H3>5.3 Zone 판정 실전 가이드</H3>

      <P>
        "내 종목이 지금 어느 Zone인지 어떻게 알 수 있나요?" 가장 많이 받는 질문입니다. 아래 3단계를
        따라하면 누구나 Zone을 판정할 수 있습니다.
      </P>

      <H4>Step 1: 최근 고점과 저점 찾기</H4>
      <P>
        증권사 앱이나 네이버 금융에서 해당 종목의 차트를 엽니다. 주봉 또는 월봉 차트에서 최근 의미
        있는 고점과 저점을 찾습니다. '의미 있다'는 것은 이전 가격에서 12% 이상 변동한 전환점을
        말합니다. 작은 등락(5~10%)은 무시하고, 명확하게 꺾인 지점을 찾으세요.
      </P>

      <H4>Step 2: 직전 전환점 유형 확인</H4>
      <P>현재 가격 기준으로 가장 최근의 전환점이 고점인지 저점인지 확인합니다.</P>
      <UL>
        <LI>
          <strong>고점 이후라면:</strong> 고점에서 하락 중인 상태입니다. 현재가가 그 고점에서 얼마나
          떨어졌는지 계산합니다.
        </LI>
        <LI>
          <strong>저점 이후라면:</strong> 저점에서 반등 중인 상태입니다. 현재가가 그 저점에서 얼마나
          올랐는지 계산합니다.
        </LI>
      </UL>

      <H4>Step 3: Zone 판정</H4>
      <P>
        <strong>고점 기준 분석 시:</strong>
      </P>
      <UL>
        <LI>
          고점 대비 -12% 미만 하락 → <strong>Zone 2</strong> (관망)
        </LI>
        <LI>
          고점 대비 -12% 이상 하락 → <strong>Zone 3</strong> (MCA 실행)
        </LI>
      </UL>
      <P>
        <strong>저점 기준 분석 시:</strong>
      </P>
      <UL>
        <LI>
          저점 대비 +12% 미만 상승 → <strong>Zone 4</strong> (DCA 또는 관망)
        </LI>
        <LI>
          저점 대비 +12% 이상 상승 → <strong>Zone 1</strong> (매도 검토)
        </LI>
      </UL>

      <H4>계산 예시</H4>
      <P>
        <strong>예시 1 - Zone 3 판정:</strong>
      </P>
      <P>삼성전자 최근 고점 80,000원, 현재가 65,000원</P>
      <CodeBlock>
        하락률 = (65,000 - 80,000) / 80,000 × 100 = -18.75%{'\n'}
        -12% 이상 하락했으므로 → Zone 3 (MCA 실행 가능)
      </CodeBlock>

      <P>
        <strong>예시 2 - Zone 4 판정:</strong>
      </P>
      <P>삼성전자 최근 저점 60,000원, 현재가 65,000원</P>
      <CodeBlock>
        상승률 = (65,000 - 60,000) / 60,000 × 100 = +8.33%{'\n'}
        +12% 미만 상승이므로 → Zone 4 (DCA 또는 관망)
      </CodeBlock>

      <TipBox title="애매할 때는 보수적으로" id="check-zigzag-ambiguous">
        Zone 판정이 애매할 때는 보수적으로 판단하세요. Zone 2인지 Zone 3인지 헷갈리면 Zone 2로
        간주하고 관망합니다. 확실한 Zone 3 진입을 확인한 후 MCA를 시작해도 늦지 않습니다.
      </TipBox>

      <Hr />

      <H2 id="zigzag-trading-philosophy">6. 파동 매매 철학: 파도를 타는 서퍼처럼</H2>
      <PhilosophyQuote />
      <P>
        파동을 이해한다는 것은 <strong>시장의 리듬을 읽는 것</strong>입니다. 서퍼가 파도의 움직임을
        읽고 최적의 타이밍에 보드에 올라타듯, 투자자도 파동의 흐름을 읽고 매매해야 합니다.
      </P>

      <H2 id="zigzag-conclusion">7. 결론: 파동을 읽는 자가 시장을 이긴다</H2>
      <P>
        주식 시장에서 살아남는 투자자는 '예측하는 자'가 아니라 <strong>'적응하는 자'</strong>입니다.
        ZigZag 지표는 복잡한 시장의 노이즈를 걷어내고 핵심 파동만을 드러내어, 우리가 시장의 리듬에
        맞춰 춤출 수 있도록 도와줍니다.
      </P>
      <TipBox title="Moonwave 철학" id="check-moonwave-philosophy">
        <strong>"파동은 멈추지 않고 흐르며, 그 흐름 속에서 우리는 영원히 진동합니다."</strong>
      </TipBox>
    </EffortSection>

    {/* ========================================
            ALL LEVELS: Related Links
        ======================================== */}
    <EffortSection level={['low', 'medium', 'high']}>
      <RelatedLinks currentSection="zigzag" />
    </EffortSection>
  </div>
);
