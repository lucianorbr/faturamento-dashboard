import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardData, EnvioDiarioRow } from '@/hooks/useExcelData';
import InfoCards from './InfoCards';
import Filters from './Filters';
import LineChartValues from './LineChartValues';
import BarChartRanking from './BarChartRanking';
import NRCPBarChart from './NRCPBarChart';
import NRCPInfoCard from './NRCPInfoCard';
import { useState } from 'react';

interface DashboardTabsProps {
  data: DashboardData;
}

export default function DashboardTabs({ data }: DashboardTabsProps) {
  const [selectedConsultor, setSelectedConsultor] = useState<string | null>(null);
  const [selectedConta, setSelectedConta] = useState<string | null>(null);
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);

  // Filter data based on selections
  const filteredData = data.envioDiario.filter((row) => {
    if (selectedConsultor && row.consultor !== selectedConsultor) return false;
    if (selectedConta && row.conta !== selectedConta) return false;
    if (selectedCidade && row.cidade !== selectedCidade) return false;
    return true;
  });

  return (
    <Tabs defaultValue="envio" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="envio">Envio Diário</TabsTrigger>
        <TabsTrigger value="nrcp">NRCP Diário</TabsTrigger>
      </TabsList>

      <TabsContent value="envio" className="space-y-6 animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
        <Filters
          data={data.envioDiario}
          selectedConsultor={selectedConsultor}
          selectedConta={selectedConta}
          selectedCidade={selectedCidade}
          onConsultorChange={setSelectedConsultor}
          onContaChange={setSelectedConta}
          onCidadeChange={setSelectedCidade}
        />

        {filteredData.length > 0 ? (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <InfoCards data={filteredData} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <LineChartValues data={filteredData} />
              <BarChartRanking data={filteredData} />
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-muted-foreground">Nenhum dado disponível com os filtros selecionados</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="nrcp" className="space-y-6 animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
        {data.nrcpDiario.length > 0 ? (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <NRCPInfoCard data={data.nrcpDiario} />
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <NRCPBarChart data={data.nrcpDiario} />
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-muted-foreground">Nenhum dado NRCP disponível</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
