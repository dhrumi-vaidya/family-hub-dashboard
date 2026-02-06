import { useState, useCallback, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/expenses/category-summary');
        if (response.success) {
          const expenseData = response.data || [];
          // Add colors to the data
          const colors = [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-4))',
            'hsl(var(--chart-5))'
          ];
          const dataWithColors = expenseData.map((item: any, index: number) => ({
            ...item,
            color: colors[index % colors.length]
          }));
          setData(dataWithColors);
        }
      } catch (error) {
        console.error('Failed to fetch expense data:', error);
        setData([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, [personal]);

  const chartData = personal
    ? data.map((d: any) => ({ ...d, value: Math.round(d.value * 0.4) }))
    : data;

  const visibleData = chartData.filter((d: any) => !hiddenCategories.has(d.name));

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
        // Allow hiding all but one category
        if (next.size < chartData.length - 1) {
          next.add(name);
        }
      }
      return next;
    });
  };

  const handleReset = () => {
    setHiddenCategories(new Set());
  };

  // Create legend payload with ALL categories (including hidden ones)
  const legendPayload = chartData.map((item: any) => ({
    value: item.name,
    type: 'circle' as const,
    color: hiddenCategories.has(item.name) ? 'hsl(var(--muted))' : item.color,
    id: item.name,
  }));

  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.15s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            {personal ? 'Your Spending' : 'Family Spending'}
          </div>
          {hiddenCategories.size > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 gap-1 text-xs">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            Loading expense data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            No expense data available
          </div>
        ) : (
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
                {visibleData.map((entry: any, index: number) => (
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
                payload={legendPayload}
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
        )}
      </CardContent>
    </Card>
  );
}
