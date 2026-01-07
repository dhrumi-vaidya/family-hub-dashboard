import { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
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

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="hsl(var(--foreground))" className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs">
        ₹{value.toLocaleString()}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function ExpenseChart({ personal = false }: ExpenseChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  const chartData = personal
    ? data.map((d) => ({ ...d, value: Math.round(d.value * 0.4) }))
    : data;

  const visibleData = chartData.filter((d) => !hiddenCategories.has(d.name));

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const handleLegendClick = (entry: any) => {
    const name = entry.value;
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        if (next.size < chartData.length - 1) {
          next.add(name);
        }
      }
      return next;
    });
  };

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
              data={visibleData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {visibleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={handleLegendClick}
              formatter={(value) => (
                <span
                  style={{
                    color: hiddenCategories.has(value) ? 'hsl(var(--muted))' : 'hsl(var(--foreground))',
                    textDecoration: hiddenCategories.has(value) ? 'line-through' : 'none',
                  }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
