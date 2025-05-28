
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

export const CreditHistory = () => {
  const { creditHistory, loading } = useCredits();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getActionIcon = (action: string) => {
    if (action === 'refund') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (action.includes('generation') || action.includes('carousel')) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <RefreshCw className="w-4 h-4 text-blue-600" />;
  };

  const getActionName = (action: string) => {
    switch (action) {
      case 'carousel_generation': return 'Geração de Carrossel';
      case 'refund': return 'Reembolso';
      case 'plan_upgrade': return 'Upgrade de Plano';
      case 'monthly_reset': return 'Reset Mensal';
      default: return action;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'refunded':
        return <Badge className="bg-yellow-100 text-yellow-800">Reembolsado</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Créditos</CardTitle>
      </CardHeader>
      <CardContent>
        {creditHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma transação encontrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead>Saldo Anterior</TableHead>
                <TableHead>Saldo Atual</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getActionIcon(item.action)}
                      <span className="text-sm">{getActionName(item.action)}</span>
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={item.credits_used > 0 ? 'text-red-600' : 'text-green-600'}>
                      {item.credits_used > 0 ? '-' : '+'}{Math.abs(item.credits_used)}
                    </span>
                  </TableCell>
                  <TableCell>{item.credits_before}</TableCell>
                  <TableCell>{item.credits_after}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
