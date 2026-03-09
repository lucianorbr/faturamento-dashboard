import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { NRCPDiarioRow } from '@/hooks/useExcelData';

interface NRCPLineChartProps {
  data: NRCPDiarioRow[];
}

interface ChartDataItem {
  data: string;
  milhao: number;
  isTotal?: boolean;
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

  // Calcular total
  const total = chartData.reduce((sum, item) => sum + item.milhao, 0);
  
  // Adicionar linha de total
  const chartDataWithTotal: ChartDataItem[] = [
    ...chartData,
    {
      data: 'TOTAL',
      milhao: total,
      isTotal: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>NRCP Diário - Valores por Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartDataWithTotal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => (typeof value === 'number' ? `R$ ${value.toFixed(2)}M` : value)} />
            <Legend />
            <Bar dataKey="milhao" name="Milhão (R$)" radius={[8, 8, 0, 0]}>
              {chartDataWithTotal.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isTotal ? '#ef4444' : '#3b82f6'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
