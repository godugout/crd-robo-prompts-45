
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { CreatorEarning } from '@/hooks/creator/useCreatorEarnings';

interface CreatorEarningsChartProps {
  earnings: CreatorEarning[];
}

export const CreatorEarningsChart: React.FC<CreatorEarningsChartProps> = ({ earnings }) => {
  // Process earnings data for charts
  const monthlyData = earnings.reduce((acc, earning) => {
    const month = new Date(earning.transaction_date).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = { month, total: 0, card_sale: 0, template_sale: 0, commission: 0, royalty: 0, subscription: 0 };
    }
    acc[month].total += earning.net_amount;
    acc[month][earning.source_type] += earning.net_amount;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .slice(-12); // Last 12 months

  const sourceTypeData = earnings.reduce((acc, earning) => {
    const existing = acc.find(item => item.source === earning.source_type);
    if (existing) {
      existing.amount += earning.net_amount;
      existing.count += 1;
    } else {
      acc.push({
        source: earning.source_type.replace('_', ' ').toUpperCase(),
        amount: earning.net_amount,
        count: 1,
      });
    }
    return acc;
  }, [] as any[]);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Monthly Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                tickFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Earnings']}
                labelFormatter={(label) => new Date(label + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Earnings by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceTypeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" tickFormatter={formatCurrency} />
              <YAxis type="category" dataKey="source" stroke="#9CA3AF" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
                formatter={(value: number, name: string) => [
                  name === 'amount' ? formatCurrency(value) : value,
                  name === 'amount' ? 'Total Earnings' : 'Transactions'
                ]}
              />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
