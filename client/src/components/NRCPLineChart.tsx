import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NRCPDiarioRow } from '@/hooks/useExcelData';

interface NRCPLineChartProps {
  data: NRCPDiarioRow[];
}

export default function NRCPLineChart({ data }: NRCPLineChartProps) {
  // Format data for chart
  const chartData = data
    .map((row) => ({
      data: new Date(row.data).toLocaleDateString('pt-BR'),
      milhao: row.milhao,
    }))
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>NRCP Diário</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)} />
            <Legend />
            <Line type="monotone" dataKey="milhao" stroke="#06b6d4" strokeWidth={2} name="Milhão" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
