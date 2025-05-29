
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Instagram } from "lucide-react";
import { useCarouselUses } from "@/hooks/useCarouselUses";

export const CarouselUsesHistory = () => {
  const { useHistory, loading } = useCarouselUses();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getActionName = (action: string) => {
    switch (action) {
      case 'carousel_generation': return 'Geração de Carrossel IA';
      default: return action;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Usos</CardTitle>
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
        <CardTitle className="flex items-center">
          <Instagram className="w-5 h-5 mr-2" />
          Histórico de Usos do Carrossel IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {useHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum uso registrado ainda
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {useHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm">
                    {formatDate(item.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{getActionName(item.action)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {item.description || 'Geração de carrossel com IA'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
