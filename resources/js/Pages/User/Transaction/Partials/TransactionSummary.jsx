import { currency } from "@/utils/format";
import { TrendingDown, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';

const SummaryCard = ({ title, value, subValue = null, icon: Icon, colorClass = "bg-blue-50 text-blue-600", trend = null }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-lg font-bold text-gray-800">{value}</h3>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        {trend && (
          <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend === 'up' ? 'Naik' : 'Turun'}</span>
          </div>
        )}
      </div>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  )
}

export default function TransactionSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        title="Total Pemasukan"
        value={currency(summary.total_income)}
        icon={ArrowDownRight}
        colorClass="bg-green-50 text-green-600"
      />
      <SummaryCard
        title="Total Pengeluaran"
        value={currency(summary.total_expense)}
        icon={ArrowUpRight}
        colorClass="bg-red-50 text-red-600"
      />
      <SummaryCard
        title="Rata-rata/Hari"
        value={currency(summary.avg_daily_expense)}
        subValue={`Mingguan: ${currency(summary.avg_weekly_expense)}`}
        icon={Calendar}
        colorClass="bg-purple-50 text-purple-600"
      />
      <SummaryCard
        title="Kategori Boros"
        value={summary.max_expense_category ? summary.max_expense_category.name : '-'}
        subValue={currency(summary.max_expense_category_amount)}
        icon={Award}
        colorClass="bg-orange-50 text-orange-600"
      />
    </div>
  )
}
