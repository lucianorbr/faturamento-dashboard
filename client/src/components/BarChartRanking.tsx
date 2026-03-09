import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnvioDiarioRow } from '@/hooks/useExcelData';

interface BarChartRankingProps {
  data: EnvioDiarioRow[];
}

export default function BarChartRanking({ data }: BarChartRankingProps) {
  // Group data by consultor and sum values
  const consultorData: Record<string, any> = {};

  data.forEach((row) => {
    if (!consultorData[row.consultor]) {
      consultorData[row.consultor] = {
        consultor: row.consultor,
        realizado: 0,
        performance: 0,
      };
    }
    consultorData[row.consultor].realizado += row.realizado;
    consultorData[row.consultor].performance += row.performance;
  });

  // Calculate score (realizado + performance)
  const chartData = Object.values(consultorData)
    .map((item) => ({
      ...item,
      score: item.realizado + item.performance,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Top 10

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Consultores (Realizado + Performance)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="consultor" />
            <YAxis />
            <Tooltip formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)} />
            <Legend />
            <Bar dataKey="realizado" fill="#8b5cf6" />
            <Bar dataKey="performance" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
