import {
  COMMUNITY_STATUS_LABELS,
  USER_STATUS_LABELS,
  type CommunityStatus,
  type UserStatus,
} from '@/types';

const TONE: Record<string, string> = {
  waiting: 'text-state-waiting border-state-waiting/40 bg-state-waiting/10',
  verifying: 'text-state-waiting border-state-waiting/40 bg-state-waiting/10',
  pending: 'text-state-waiting border-state-waiting/40 bg-state-waiting/10',
  in_progress: 'text-state-progress border-state-progress/40 bg-state-progress/10',
  approved: 'text-state-done border-state-done/40 bg-state-done/10',
  completed: 'text-state-done border-state-done/40 bg-state-done/10',
  rejected: 'text-state-stop border-state-stop/40 bg-state-stop/10',
  suspended: 'text-state-stop border-state-stop/40 bg-state-stop/10',
};

export function StatusBadge({ status }: { status: CommunityStatus | UserStatus }) {
  const label =
    COMMUNITY_STATUS_LABELS[status as CommunityStatus] ??
    USER_STATUS_LABELS[status as UserStatus] ??
    status;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide ${TONE[status] ?? 'text-muted border-edge'}`}
    >
      {label}
    </span>
  );
}
