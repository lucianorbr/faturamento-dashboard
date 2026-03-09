import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NRCPDiarioRow } from '@/hooks/useExcelData';

interface NRCPLineChartProps {
  data: NRCPDiarioRow[];
}

export default function NRCPLineChart({ data }: NRCPLineChartProps) {
  // Format data for chart - as datas já vêm formatadas do hook
  const chartData = data
    .map((row) => ({
      data: row.data, // Já está formatado em pt-BR
      milhao: row.milhao,
      dataObj: new Date(row.data.split('/').reverse().join('-')), // Para ordenação
    }))
    .sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime())
    .map(({ dataObj, ...rest }) => rest); // Remove o campo temporário

  return (
    <Card>
      <CardHeader>
        <CardTitle>NRCP Diário - Valores por Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => (typeof value === 'number' ? `R$ ${value.toFixed(2)}M` : value)} />
            <Legend />
            <Line type="monotone" dataKey="milhao" stroke="#3b82f6" strokeWidth={2} name="Milhão (R$)" dot={{ fill: '#3b82f6', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
