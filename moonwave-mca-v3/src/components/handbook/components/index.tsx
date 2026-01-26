// ============================================
// Handbook Reusable Components
// 핸드북 재사용 컴포넌트
// ============================================

import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { IconH3 } from '../HandbookTypography';
import { Blockquote, Table, Tbody, Td, Th, Thead, Tr } from '../HandbookTypography';
import {
  DCA_PREREQUISITES,
  MCA_PREREQUISITES,
  PHILOSOPHY,
  PROTOCOLS,
  SECTION_RELATIONSHIPS,
  STRENGTH_GUIDES,
  type SectionId,
  ZONE_LIST,
} from '../constants/handbookContent';

// ============================================
// Section Link - 다른 핸드북 섹션으로 이동
// ============================================
interface SectionLinkProps {
  to: string;
  children: React.ReactNode;
}

function SectionLink({ to, children }: SectionLinkProps) {
  const setHandbookSection = useUIStore((state) => state.setHandbookSection);

  return (
    <button
      onClick={() => setHandbookSection(to)}
      className="text-primary-600 dark:text-primary-400 hover:underline font-medium inline-flex items-center gap-1"
    >
      {children} →
    </button>
  );
}

// ============================================
// Protocol Link - 프로토콜 참조 링크
// ============================================
interface ProtocolLinkProps {
  protocol: keyof typeof PROTOCOLS;
  showIcon?: boolean;
  showVersion?: boolean;
}

export function ProtocolLink({
  protocol,
  showIcon = true,
  showVersion = false,
}: ProtocolLinkProps) {
  const info = PROTOCOLS[protocol];
  const setHandbookSection = useUIStore((state) => state.setHandbookSection);

  return (
    <button
      onClick={() => setHandbookSection(info.sectionId)}
      className="text-primary-600 dark:text-primary-400 hover:underline font-medium inline-flex items-center gap-1"
    >
      {showIcon && <span className="text-sm">{info.iconName}</span>}
      <span>{info.name}</span>
      {showVersion && <span className="text-xs text-zinc-500">({info.version})</span>}
    </button>
  );
}

// ============================================
// Zone Table - Zone 테이블
// ============================================
interface ZoneTableProps {
  showPsychology?: boolean;
  showMCA?: boolean;
  showDCA?: boolean;
  showSell?: boolean;
}

export function ZoneTable({
  showPsychology = true,
  showMCA = true,
  showDCA = true,
  showSell = false,
}: ZoneTableProps) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Zone</Th>
          <Th>구간</Th>
          <Th>범위</Th>
          {showPsychology && <Th>심리</Th>}
          <Th>전략</Th>
          {showMCA && <Th>MCA</Th>}
          {showDCA && <Th>DCA</Th>}
          {showSell && <Th>매도</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {ZONE_LIST.map((zone) => (
          <Tr key={zone.id}>
            <Td>
              <span className="font-semibold">
                {zone.iconName} {zone.name}
              </span>
            </Td>
            <Td>{zone.title}</Td>
            <Td>{zone.range}</Td>
            {showPsychology && (
              <Td>
                {zone.psychologyIcon} {zone.psychology}
              </Td>
            )}
            <Td>{zone.strategy}</Td>
            {showMCA && <Td>{zone.mcaAction}</Td>}
            {showDCA && <Td>{zone.dcaAction}</Td>}
            {showSell && <Td>{zone.sellAction}</Td>}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// ============================================
// Strength Guide Table - Strength 가이드 테이블
// ============================================
export function StrengthGuideTable() {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>투자 성향</Th>
          <Th>Strength</Th>
          <Th>1구간 수량</Th>
          <Th>5구간 수량</Th>
          <Th>총 투입 배수</Th>
        </Tr>
      </Thead>
      <Tbody>
        {STRENGTH_GUIDES.map((guide) => (
          <Tr key={guide.level}>
            <Td>
              <span className="font-semibold">
                {guide.iconName} {guide.level}
              </span>
            </Td>
            <Td>{guide.value}</Td>
            <Td>{guide.step1Qty}</Td>
            <Td>{guide.step5Qty}</Td>
            <Td>{guide.totalMultiple}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// ============================================
// Prerequisites Table - 전제조건 테이블
// ============================================
interface PrerequisitesTableProps {
  type: 'MCA' | 'DCA';
}

export function PrerequisitesTable({ type }: PrerequisitesTableProps) {
  const prerequisites = type === 'MCA' ? MCA_PREREQUISITES : DCA_PREREQUISITES;

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>요건</Th>
          <Th>기준</Th>
          <Th>참조</Th>
        </Tr>
      </Thead>
      <Tbody>
        {prerequisites.map((req, idx) => (
          <Tr key={idx}>
            <Td>
              <span className="font-semibold">
                {req.iconName} {req.requirement}
              </span>
            </Td>
            <Td>{req.criteria}</Td>
            <Td>{req.reference}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// ============================================
// Protocol Reference Table - 프로토콜 참조 테이블
// ============================================
export function ProtocolReferenceTable() {
  const protocolsToShow = ['MIP', 'ZIGZAG', 'MCA', 'DCA'] as const;

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>프로토콜</Th>
          <Th>버전</Th>
          <Th>역할</Th>
          <Th>필수 여부</Th>
          <Th>바로가기</Th>
        </Tr>
      </Thead>
      <Tbody>
        {protocolsToShow.map((key) => {
          const protocol = PROTOCOLS[key];
          return (
            <Tr key={protocol.id}>
              <Td>
                <span className="font-semibold">
                  {protocol.iconName} {protocol.name}
                </span>
              </Td>
              <Td>{protocol.version}</Td>
              <Td>{protocol.role}</Td>
              <Td>{protocol.required ? '⭐ 필수' : '선택'}</Td>
              <Td>
                <SectionLink to={protocol.sectionId}>이동</SectionLink>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

// ============================================
// Philosophy Quote - 철학 인용문
// ============================================
export function PhilosophyQuote() {
  return (
    <Blockquote>
      <strong>🌊 "{PHILOSOPHY.coreDeclaration}"</strong>
    </Blockquote>
  );
}

// ============================================
// Core Values List - 핵심 가치 목록
// ============================================
export function CoreValuesList() {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>핵심 가치</Th>
          <Th>투자 적용</Th>
        </Tr>
      </Thead>
      <Tbody>
        {PHILOSOPHY.coreValues.map((value) => (
          <Tr key={value.name}>
            <Td>
              <span className="font-semibold">
                {value.iconName} {value.korean} ({value.name})
              </span>
            </Td>
            <Td>{value.description}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// ============================================
// Warning Box - 경고 박스
// ============================================
interface WarningBoxProps {
  type?: 'warning' | 'danger' | 'info' | 'success';
  children: React.ReactNode;
  id?: string;
}

export function WarningBox({ type = 'warning', children, id }: WarningBoxProps) {
  const colorClasses = {
    warning:
      'border-warning-500 bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200',
    danger:
      'border-danger-500 bg-danger-50 dark:bg-danger-900/20 text-danger-800 dark:text-danger-200',
    info: 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200',
    success:
      'border-success-500 bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-200',
  };

  return (
    <div id={id} className={clsx('border-l-4 pl-4 py-3 my-4 rounded-r', colorClasses[type])}>
      {children}
    </div>
  );
}

// ============================================
// Tip Box - 팁 박스
// ============================================
interface TipBoxProps {
  title?: string;
  children: React.ReactNode;
  id?: string;
}

export function TipBox({ title = 'Tip', children, id }: TipBoxProps) {
  return (
    <div
      id={id}
      className="my-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
    >
      <p className="font-semibold text-primary-700 dark:text-primary-300 mb-2">{title}</p>
      <div className="text-sm text-primary-600 dark:text-primary-400">{children}</div>
    </div>
  );
}

// ============================================
// Related Links - 관련 문서 링크 섹션
// ============================================
interface RelatedLinksProps {
  currentSection: SectionId;
}

export function RelatedLinks({ currentSection }: RelatedLinksProps) {
  const relationship = SECTION_RELATIONSHIPS[currentSection];

  const hasContent =
    relationship.prerequisites.length > 0 ||
    relationship.relatedSections.length > 0 ||
    relationship.nextSteps.length > 0;

  if (!hasContent) return null;

  return (
    <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
      <IconH3 icon="Link">관련 문서</IconH3>

      {relationship.prerequisites.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">선행 학습:</span>
          <div className="flex flex-wrap gap-2">
            {relationship.prerequisites.map((id) => {
              const protocolKey = Object.keys(PROTOCOLS).find(
                (key) => PROTOCOLS[key].sectionId === id
              );
              return protocolKey ? (
                <ProtocolLink key={id} protocol={protocolKey as keyof typeof PROTOCOLS} showIcon />
              ) : null;
            })}
          </div>
        </div>
      )}

      {relationship.relatedSections.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">함께 보기:</span>
          <div className="flex flex-wrap gap-2">
            {relationship.relatedSections.map((id) => {
              const protocolKey = Object.keys(PROTOCOLS).find(
                (key) => PROTOCOLS[key].sectionId === id
              );
              return protocolKey ? (
                <ProtocolLink key={id} protocol={protocolKey as keyof typeof PROTOCOLS} showIcon />
              ) : null;
            })}
          </div>
        </div>
      )}

      {relationship.nextSteps.length > 0 && (
        <div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 block mb-2">다음 단계:</span>
          <div className="flex flex-wrap gap-2">
            {relationship.nextSteps.map((id) => {
              const protocolKey = Object.keys(PROTOCOLS).find(
                (key) => PROTOCOLS[key].sectionId === id
              );
              return protocolKey ? (
                <ProtocolLink key={id} protocol={protocolKey as keyof typeof PROTOCOLS} showIcon />
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Export all constants for direct use
// ============================================
export { PROTOCOLS };
