import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NRCPDiarioRow } from '@/hooks/useExcelData';

interface NRCPBarChartProps {
  data: NRCPDiarioRow[];
}

export default function NRCPBarChart({ data }: NRCPBarChartProps) {
  // Format data for chart - as datas já vêm formatadas do hook
  const chartData = data
    .map((row) => ({
      data: row.data, // Já está formatado em pt-BR
      milhao: row.milhao,
      dataObj: (() => {
        const [day, month, year] = row.data.split('/').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      })(),
    }))
    .sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime())
    .map(({ dataObj, ...rest }) => rest); // Remove o campo temporário

  return (
    <Card>
      <CardHeader>
        <CardTitle>NRCP Diário - Valores por Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => (typeof value === 'number' ? `R$ ${value.toFixed(2)}M` : value)} />
            <Legend />
            <Bar dataKey="milhao" fill="#3b82f6" name="Milhão (R$)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
