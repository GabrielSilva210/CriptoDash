import { formatPercent } from '../utils/format'

function StatCard({ label, value, change, icon, loading }) {
  const hasChange = change !== undefined && change !== null
  const positive = change >= 0

  return (
    <div className="flex min-w-52 items-center justify-between gap-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div>
        <p className="text-sm text-slate-600">{label}</p>

        {loading ? (
          <div className="mt-2 h-7 w-32 animate-pulse rounded bg-slate-200" />
        ) : (
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">{value}</p>

            {hasChange && (
              <span
                className={`text-xs font-semibold ${
                  positive ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {positive ? '▲' : '▼'} {formatPercent(change)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="self-start text-emerald-500">{icon}</div>
    </div>
  )
}

export default StatCard