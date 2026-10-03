import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency, formatDate } from '../../../utils/format';

export default function SalesTrendChart({ data = [] }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-charcoal">Sales Trend</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="salesGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a67c34" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#a67c34" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatDate(value)}
              tick={{ fontSize: 11, fill: '#78716c' }}
              axisLine={{ stroke: '#e7e5e4' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 11, fill: '#78716c' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value), 'Revenue']}
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{ borderRadius: 8, borderColor: '#e7e5e4', fontSize: 13 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#a67c34" strokeWidth={2} fill="url(#salesGold)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
