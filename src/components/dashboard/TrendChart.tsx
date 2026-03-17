import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export interface TrendMonth {
  name: string;
  spent: number;
  budget: number;
}

interface TrendChartProps {
  data: TrendMonth[];
  mode: 'simple' | 'fast';
}

export function TrendChart({ data, mode }: TrendChartProps) {
  const [collapsed, setCollapsed] = useState(mode === 'simple');

  if (mode === 'simple') {
    return (
      <Card>
        <CardHeader className="pb-2">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="flex w-full items-center justify-between text-left"
          >
            <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Spending Trend
            </CardTitle>
            {collapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
          </button>
        </CardHeader>
        {!collapsed && (
          <CardContent>
            <TrendChartInner data={data} />
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          6-Month Spending Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrendChartInner data={data} />
      </CardContent>
    </Card>
  );
}

function TrendChartInner({ data }: { data: TrendMonth[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
        No trend data available yet.
      </div>
    );
  }

  const budgetLine = data[0]?.budget ?? 0;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip
          formatter={(v: number) => `₹${v.toLocaleString()}`}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '0.5rem',
            color: 'hsl(var(--foreground))',
          }}
        />
        <ReferenceLine y={budgetLine} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
        <Bar dataKey="spent" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.spent > entry.budget ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
