import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NRCPDiarioRow } from '@/hooks/useExcelData';

interface NRCPBarChartProps {
  data: NRCPDiarioRow[];
}

export default function NRCPBarChart({ data }: NRCPBarChartProps) {
  // Format data for chart - as datas já vêm formatadas do hook
  const chartData = data
    .map((row) => ({
      data: row.data, // Já está formatado em pt-BR
      valor: row.milhao, // renomear para remover menção explícita de "milhão" na legenda
      dataObj: (() => {
        const [day, month, year] = row.data.split('/').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
      })(),
    }))
    .sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime())
    .map(({ dataObj, ...rest }) => rest); // Remove o campo temporário

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          NRCP Diário - Evolução de Valores
        </CardTitle>
        <p className="text-sm text-muted-foreground">Valores em R$ Milhões</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis 
              dataKey="data" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
              tickFormatter={(value) => `${value}`}
              dx={-10}
            />
            <Tooltip 
              formatter={(value) => (typeof value === 'number' ? `R$ ${value.toFixed(2)}M` : value)}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: 'var(--primary)', fontWeight: '500' }}
            />
            <Area 
              type="monotone" 
              dataKey="valor" 
              name="Valor"
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValor)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
