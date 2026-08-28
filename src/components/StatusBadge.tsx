import { CASE_STATUS_LABEL, type CaseStatus } from '../data/mock'

export function StatusBadge({ status }: { status: CaseStatus }) {
  return <span className={`badge badge--${status}`}>{CASE_STATUS_LABEL[status]}</span>
}
