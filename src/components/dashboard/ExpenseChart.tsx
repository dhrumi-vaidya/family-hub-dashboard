import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Groceries', value: 18000, color: 'hsl(var(--chart-1))' },
  { name: 'Utilities', value: 12000, color: 'hsl(var(--chart-2))' },
  { name: 'Healthcare', value: 8000, color: 'hsl(var(--chart-3))' },
  { name: 'Education', value: 5000, color: 'hsl(var(--chart-4))' },
  { name: 'Transport', value: 2000, color: 'hsl(var(--chart-5))' },
];

interface ExpenseChartProps {
  personal?: boolean;
}

export function ExpenseChart({ personal = false }: ExpenseChartProps) {
  const chartData = personal
    ? data.map((d) => ({ ...d, value: Math.round(d.value * 0.4) }))
    : data;

  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.15s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          {personal ? 'Your Spending' : 'Family Spending'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
