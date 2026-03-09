import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnvioDiarioRow } from '@/hooks/useExcelData';

interface BarChartRankingProps {
  data: EnvioDiarioRow[];
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}K`;
  }
  return `R$ ${value.toFixed(0)}`;
};

export default function BarChartRanking({ data }: BarChartRankingProps) {
  // Group data by consultor and sum values
  const consultorData: Record<string, any> = {};

  data.forEach((row) => {
    if (!consultorData[row.consultor]) {
      consultorData[row.consultor] = {
        consultor: row.consultor,
        objetivo: 0,
        realizado: 0,
      };
    }
    consultorData[row.consultor].objetivo += row.objetivo;
    consultorData[row.consultor].realizado += row.realizado;
  });

  // Sort by realizado and get top 5
  const chartData = Object.values(consultorData)
    .sort((a, b) => b.realizado - a.realizado)
    .slice(0, 5); // Top 5

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Consultores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="consultor" type="category" width={90} />
            <Tooltip 
              formatter={(value) => {
                if (typeof value === 'number') {
                  return formatCurrency(value);
                }
                return value;
              }}
            />
            <Legend />
            <Bar dataKey="realizado" fill="#3b82f6" name="Realizado" />
            <Bar dataKey="objetivo" fill="#10b981" name="Objetivo" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
