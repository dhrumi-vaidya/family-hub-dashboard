import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const data = [
  { name: 'Jan', spent: 52000, budget: 60000 },
  { name: 'Feb', spent: 48000, budget: 60000 },
  { name: 'Mar', spent: 58000, budget: 60000 },
  { name: 'Apr', spent: 45000, budget: 60000 },
  { name: 'May', spent: 62000, budget: 60000 },
  { name: 'Jun', spent: 55000, budget: 60000 },
];

interface BudgetChartProps {
  personal?: boolean;
}

export function BudgetChart({ personal = false }: BudgetChartProps) {
  const chartData = personal
    ? data.map((d) => ({
        ...d,
        spent: Math.round(d.spent * 0.35),
        budget: Math.round(d.budget * 0.35),
      }))
    : data;

  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4 text-primary" />
          {personal ? 'Your Monthly Budget' : 'Family Monthly Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="spent" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.spent > entry.budget
                      ? 'hsl(var(--destructive))'
                      : 'hsl(var(--primary))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
