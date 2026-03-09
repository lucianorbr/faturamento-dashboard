import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EnvioDiarioRow } from '@/hooks/useExcelData';
import { X } from 'lucide-react';

interface FiltersProps {
  data: EnvioDiarioRow[];
  selectedConsultor: string | null;
  selectedConta: string | null;
  selectedCidade: string | null;
  onConsultorChange: (consultor: string | null) => void;
  onContaChange: (conta: string | null) => void;
  onCidadeChange: (cidade: string | null) => void;
}

export default function Filters({
  data,
  selectedConsultor,
  selectedConta,
  selectedCidade,
  onConsultorChange,
  onContaChange,
  onCidadeChange,
}: FiltersProps) {
  const consultores = Array.from(new Set(data.map((row) => row.consultor))).sort();
  const contas = Array.from(new Set(data.map((row) => row.conta))).sort();
  const cidades = Array.from(new Set(data.map((row) => row.cidade))).sort();

  const hasActiveFilters = selectedConsultor || selectedConta || selectedCidade;

  const handleClearFilters = () => {
    onConsultorChange(null);
    onContaChange(null);
    onCidadeChange(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-card rounded-lg border">
      <Select value={selectedConsultor || '__all__'} onValueChange={(value) => onConsultorChange(value === '__all__' ? null : value)}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filtrar por Consultor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos os Consultores</SelectItem>
          {consultores.map((consultor) => (
            <SelectItem key={consultor} value={consultor}>
              {consultor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedConta || '__all__'} onValueChange={(value) => onContaChange(value === '__all__' ? null : value)}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filtrar por Conta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todas as Contas</SelectItem>
          {contas.map((conta) => (
            <SelectItem key={conta} value={conta}>
              {conta}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCidade || '__all__'} onValueChange={(value) => onCidadeChange(value === '__all__' ? null : value)}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filtrar por Cidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todas as Cidades</SelectItem>
          {cidades.map((cidade) => (
            <SelectItem key={cidade} value={cidade}>
              {cidade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}
