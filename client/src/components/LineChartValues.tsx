import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnvioDiarioRow } from '@/hooks/useExcelData';

interface LineChartValuesProps {
  data: EnvioDiarioRow[];
}

export default function LineChartValues({ data }: LineChartValuesProps) {
  // Group data by consultor and sum values
  const consultorData: Record<string, any> = {};

  data.forEach((row) => {
    if (!consultorData[row.consultor]) {
      consultorData[row.consultor] = {
        consultor: row.consultor,
        objetivo: 0,
        gross: 0,
        realizado: 0,
        performance: 0,
      };
    }
    consultorData[row.consultor].objetivo += row.objetivo;
    consultorData[row.consultor].gross += row.gross;
    consultorData[row.consultor].realizado += row.realizado;
    consultorData[row.consultor].performance += row.performance;
  });

  const chartData = Object.values(consultorData).sort((a, b) => b.realizado - a.realizado);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores Somados por Consultor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="consultor" />
            <YAxis />
            <Tooltip formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)} />
            <Legend />
            <Line type="monotone" dataKey="objetivo" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="gross" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="realizado" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
