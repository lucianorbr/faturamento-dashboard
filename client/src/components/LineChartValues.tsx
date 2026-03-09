import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EnvioDiarioRow } from '@/hooks/useExcelData';

interface LineChartValuesProps {
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
        pipeline: 0,
      };
    }
    consultorData[row.consultor].objetivo += row.objetivo;
    consultorData[row.consultor].gross += row.gross;
    consultorData[row.consultor].realizado += row.realizado;
    consultorData[row.consultor].pipeline += row.pipeline;
  });

  const chartData = Object.values(consultorData).sort((a, b) => 
    b.realizado - a.realizado
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores por Consultor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="consultor" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(0)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip 
              formatter={(value) => {
                if (typeof value === 'number') {
                  return formatCurrency(value);
                }
                return value;
              }}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="objetivo" 
              stroke="#3b82f6" 
              name="Objetivo"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="gross" 
              stroke="#10b981" 
              name="Gross"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="realizado" 
              stroke="#f59e0b" 
              name="Realizado"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="pipeline" 
              stroke="#8b5cf6" 
              name="Pipeline"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
