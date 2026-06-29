import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

type Severity = 'none' | 'low' | 'medium' | 'high';
type Role =
  | 'Tech Lead'
  | 'Senior Dev'
  | 'Junior Dev'
  | 'Product Manager'
  | 'Legal';

interface Permission {
  apps: string[];
  urls: string[];
  devices: string[];
}

interface Worker {
  id: number;
  name: string;
  role: Role;
  avatar: string;
  severity: Severity;
  permissions: Permission;
}

const WORKERS: Worker[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Tech Lead',
    avatar: 'SC',
    severity: 'high',
    permissions: {
      apps: ['GitHub', 'Figma', 'AWS Console', 'Datadog'],
      urls: ['github.com', 'aws.amazon.com'],
      devices: ['MacBook Pro', 'YubiKey'],
    },
  },
  {
    id: 2,
    name: 'Marco Díaz',
    role: 'Junior Dev',
    avatar: 'MD',
    severity: 'medium',
    permissions: {
      apps: ['GitHub', 'Slack', 'Linear'],
      urls: ['github.com', 'linear.app'],
      devices: ['MacBook Air'],
    },
  },
  {
    id: 3,
    name: 'Priya Nair',
    role: 'Product Manager',
    avatar: 'PN',
    severity: 'none',
    permissions: {
      apps: ['Figma', 'Linear', 'Notion', 'Slack'],
      urls: ['figma.com', 'notion.so'],
      devices: ['MacBook Pro', 'iPad'],
    },
  },
  {
    id: 4,
    name: 'James Wu',
    role: 'Senior Dev',
    avatar: 'JW',
    severity: 'low',
    permissions: {
      apps: ['GitHub', 'AWS Console', 'Slack', 'Datadog'],
      urls: ['github.com', 'datadog.com'],
      devices: ['MacBook Pro', 'YubiKey'],
    },
  },
  {
    id: 5,
    name: 'Elena Rossi',
    role: 'Legal',
    avatar: 'ER',
    severity: 'none',
    permissions: {
      apps: ['Notion', 'Slack', 'DocuSign'],
      urls: ['notion.so', 'docusign.com'],
      devices: ['MacBook Air'],
    },
  },
];

// box-shadow rings expand outward from the card border
// using box-shadow means the card itself is the origin — no clipping possible
// two rings per severity = two waves, offset by delay
const SEV: Record<
  Severity,
  {
    // RGB only — opacity controlled in keyframes
    rgb: string;
    duration: number; // one full double-tap cycle
    delay: string; // delay for the second ring
    gap: number; // wrapper padding at rest
    gapOpen: number; // wrapper padding when expanded
    chip: string;
    label: string;
  }
> = {
  none: {
    rgb: '0,0,0',
    duration: 0,
    delay: '0s',
    gap: 4,
    gapOpen: 4,
    chip: '',
    label: '',
  },
  low: {
    rgb: '234,179,8',
    duration: 3.8,
    delay: '1.4s',
    gap: 10,
    gapOpen: 14,
    chip: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    label: 'Low',
  },
  medium: {
    rgb: '249,115,22',
    duration: 3.2,
    delay: '1.1s',
    gap: 14,
    gapOpen: 18,
    chip: 'text-orange-700 bg-orange-50 border-orange-200',
    label: 'Medium',
  },
  high: {
    rgb: '220,80,80',
    duration: 2.6,
    delay: '0.9s',
    gap: 18,
    gapOpen: 22,
    chip: 'text-red-600 bg-red-50 border-red-100',
    label: 'High',
  },
};

const ROLE: Record<Role, string> = {
  'Tech Lead': 'text-violet-700 bg-violet-50 border-violet-200',
  'Senior Dev': 'text-blue-700 bg-blue-50 border-blue-200',
  'Junior Dev': 'text-sky-700 bg-sky-50 border-sky-200',
  'Product Manager': 'text-teal-700 bg-teal-50 border-teal-200',
  Legal: 'text-slate-600 bg-slate-50 border-slate-200',
};

function ExpandContent({ permissions }: { permissions: Permission }) {
  const rows = [
    { label: 'Apps', values: permissions.apps },
    { label: 'URLs', values: permissions.urls },
    { label: 'Devices', values: permissions.devices },
  ];
  return (
    <div
      className='grid gap-y-3 pt-4 pb-1'
      style={{ gridTemplateColumns: '72px 1fr' }}
    >
      {rows.map(({ label, values }) => (
        <>
          <span
            key={label + 'l'}
            className='text-xs text-slate-400 font-medium leading-5 pt-0.5'
          >
            {label}
          </span>
          <div key={label + 'v'} className='flex flex-wrap gap-1.5'>
            {values.map((v) => (
              <span
                key={v}
                className='text-xs text-slate-600 bg-slate-100 border border-slate-200 rounded-md px-2 py-0.5'
              >
                {v}
              </span>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}

function WorkerRow({ worker }: { worker: Worker }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const s = SEV[worker.severity];
  const isFlagged = worker.severity !== 'none';

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (expanded) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
    }
  }, [expanded]);

  const py = isFlagged
    ? expanded
      ? s.gapOpen
      : s.gap
    : hovered || expanded
      ? 12
      : 4;

  // Animation name is unique per severity so keyframes don't collide
  const animName = `wave-${worker.severity}`;

  return (
    <div
      className='relative cursor-pointer select-none'
      style={{
        paddingTop: py,
        paddingBottom: py,
        transition: 'padding 280ms ease',
      }}
      onClick={() => setExpanded((p) => !p)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className='relative bg-white border border-slate-200 rounded-xl px-5 py-4'
        style={{
          zIndex: 1,
          // box-shadow rings expand from the card border outward
          // ring1 = first wave (leads)
          // ring2 = second wave (trails, delayed)
          // hover shadow layered on top when not flagged
          animation: isFlagged
            ? `${animName}-r1 ${s.duration}s ease-out infinite, ${animName}-r2 ${s.duration}s ease-out ${s.delay} infinite`
            : 'none',
          boxShadow:
            !isFlagged && (hovered || expanded)
              ? '0 6px 24px rgba(15,23,42,0.10)'
              : !isFlagged
                ? '0 1px 4px rgba(15,23,42,0.05)'
                : undefined,
          transition: 'box-shadow 200ms ease',
        }}
      >
        <div className='flex items-center gap-3 min-h-9'>
          {/* Avatar */}
          <div className='w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0'>
            <span className='text-xs font-semibold text-slate-500 tracking-wide'>
              {worker.avatar}
            </span>
          </div>

          {/* Name */}
          <span className='text-sm font-medium text-slate-800 flex-1 truncate'>
            {worker.name}
          </span>

          {/* Role */}
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${ROLE[worker.role]}`}
          >
            {worker.role}
          </span>

          {/* Severity chip */}
          {isFlagged && (
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${s.chip}`}
            >
              {s.label}
            </span>
          )}

          {/* Chevron */}
          <svg
            className='w-4 h-4 text-slate-400 shrink-0'
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 300ms ease',
            }}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>

        {/* Expandable content */}
        <div
          ref={contentRef}
          style={{ height: 0, overflow: 'hidden', opacity: 0 }}
        >
          <div className='border-t border-slate-100 mt-3'>
            <ExpandContent permissions={worker.permissions} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate keyframes for each severity level
// box-shadow animates spread-radius and opacity
// starts at 0px spread (flush with card border) → expands outward → fades
// double-tap: fast first peak at 8%, brief dip, second peak at 18%, then long rest
function generateKeyframes(rgb: string, name: string): string {
  // ring1 — leads
  // ring2 — same keyframes but delayed via animation-delay on the element
  const r1 = `
    @keyframes ${name}-r1 {
      0%   { box-shadow: 0 0 0 0px   rgba(${rgb}, 0.00); }
      5%   { box-shadow: 0 0 0 3px   rgba(${rgb}, 0.35); }
      10%  { box-shadow: 0 0 0 6px   rgba(${rgb}, 0.18); }
      14%  { box-shadow: 0 0 0 8px   rgba(${rgb}, 0.28); }
      22%  { box-shadow: 0 0 0 14px  rgba(${rgb}, 0.08); }
      35%  { box-shadow: 0 0 0 18px  rgba(${rgb}, 0.02); }
      100% { box-shadow: 0 0 0 18px  rgba(${rgb}, 0.00); }
    }
  `;
  // ring2 uses identical keyframes — delay on the element creates the offset
  const r2 = `
    @keyframes ${name}-r2 {
      0%   { box-shadow: 0 0 0 0px   rgba(${rgb}, 0.00); }
      5%   { box-shadow: 0 0 0 3px   rgba(${rgb}, 0.30); }
      10%  { box-shadow: 0 0 0 6px   rgba(${rgb}, 0.15); }
      14%  { box-shadow: 0 0 0 8px   rgba(${rgb}, 0.22); }
      22%  { box-shadow: 0 0 0 14px  rgba(${rgb}, 0.06); }
      35%  { box-shadow: 0 0 0 18px  rgba(${rgb}, 0.01); }
      100% { box-shadow: 0 0 0 18px  rgba(${rgb}, 0.00); }
    }
  `;
  return r1 + r2;
}

export default function WorkerTable() {
  const keyframes = Object.entries(SEV)
    .filter(([key]) => key !== 'none')
    .map(([key, val]) => generateKeyframes(val.rgb, `wave-${key}`))
    .join('\n');

  return (
    <>
      <style>{`
        ${keyframes}

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className='min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4'>
        {/* Header */}
        <div className='w-full max-w-lg mb-10'>
          <h1 className='text-2xl font-semibold text-slate-900 mb-1'>
            Entitlement Table
          </h1>
          <p className='text-sm text-slate-500 leading-relaxed'>
            Severity through space, light, and motion. No badges interrupting
            the scan.
          </p>
        </div>

        {/* Legend */}
        <div className='w-full max-w-lg mb-6 flex items-center gap-5 flex-wrap'>
          {(['high', 'medium', 'low'] as Severity[]).map((s) => (
            <div key={s} className='flex items-center gap-2'>
              <span
                className='w-2.5 h-2.5 rounded-full border'
                style={{
                  borderColor: `rgb(${SEV[s].rgb})`,
                  background: `rgba(${SEV[s].rgb},0.15)`,
                }}
              />
              <span className='text-xs text-slate-500 capitalize'>
                {s} drift
              </span>
            </div>
          ))}
          <span className='text-xs text-slate-400 ml-auto italic'>
            Click to expand
          </span>
        </div>

        {/*
          NO overflow hidden here — box-shadow is never clipped by overflow.
          That was the core problem with the previous approach using positioned divs.
          box-shadow expands beyond the element bounds without any clipping.
        */}
        <div className='w-full max-w-lg'>
          {WORKERS.map((w) => (
            <WorkerRow key={w.id} worker={w} />
          ))}
        </div>
      </div>
    </>
  );
}
