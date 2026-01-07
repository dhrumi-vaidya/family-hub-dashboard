import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Legend, ReferenceLine } from 'recharts';
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
  const [showSpent, setShowSpent] = useState(true);
  const [showBudget, setShowBudget] = useState(true);

  const chartData = personal
    ? data.map((d) => ({
        ...d,
        spent: Math.round(d.spent * 0.35),
        budget: Math.round(d.budget * 0.35),
      }))
    : data;

  const budgetLine = chartData[0]?.budget || 0;

  const handleLegendClick = (entry: any) => {
    const key = entry.dataKey || entry.value;
    if (key === 'spent' || key === 'Spent') {
      setShowSpent((prev) => prev || !showBudget ? !prev : prev);
    } else if (key === 'budget' || key === 'Budget Line') {
      setShowBudget((prev) => prev || !showSpent ? !prev : prev);
    }
  };

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
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `₹${value.toLocaleString()}`,
                name === 'spent' ? 'Spent' : 'Budget',
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {showBudget && (
              <ReferenceLine
                y={budgetLine}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                label={{
                  value: 'Budget',
                  position: 'right',
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 10,
                }}
              />
            )}
            {showSpent && (
              <Bar dataKey="spent" radius={[4, 4, 0, 0]} name="Spent">
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
            )}
            <Legend
              verticalAlign="bottom"
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={handleLegendClick}
              payload={[
                {
                  value: 'Spent',
                  type: 'square',
                  color: showSpent ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  dataKey: 'spent',
                },
                {
                  value: 'Budget Line',
                  type: 'line',
                  color: showBudget ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted))',
                  dataKey: 'budget',
                },
              ]}
              formatter={(value, entry: any) => (
                <span
                  style={{
                    color:
                      (entry.dataKey === 'spent' && !showSpent) ||
                      (entry.dataKey === 'budget' && !showBudget)
                        ? 'hsl(var(--muted))'
                        : 'hsl(var(--foreground))',
                    textDecoration:
                      (entry.dataKey === 'spent' && !showSpent) ||
                      (entry.dataKey === 'budget' && !showBudget)
                        ? 'line-through'
                        : 'none',
                  }}
                >
                  {value}
                </span>
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
