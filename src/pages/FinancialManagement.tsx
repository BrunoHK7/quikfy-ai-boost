
import { useState } from "react";
import { Brain, ArrowLeft, Plus, DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useFinancialData } from "@/hooks/useFinancialData";
import { toast } from "sonner";

const FinancialManagement = () => {
  const {
    revenues,
    expenses,
    loading,
    addRevenue,
    addExpense,
    deleteRevenue,
    deleteExpense,
    getTotalRevenue,
    getTotalExpenses,
    getNetProfit,
    getCurrentMonthRevenue,
    getCurrentMonthExpenses
  } = useFinancialData();

  const [revenueDialogOpen, setRevenueDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  // Form states for revenue
  const [revenueForm, setRevenueForm] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
    is_recurring: false,
    recurrence_type: null as string | null
  });

  // Form states for expense
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
    is_recurring: false,
    recurrence_type: null as string | null
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAddRevenue = async () => {
    if (!revenueForm.title || !revenueForm.amount || !revenueForm.category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const { error } = await addRevenue({
      title: revenueForm.title,
      amount: parseFloat(revenueForm.amount),
      date: revenueForm.date,
      category: revenueForm.category,
      is_recurring: revenueForm.is_recurring,
      recurrence_type: revenueForm.recurrence_type
    });

    if (error) {
      toast.error("Erro ao adicionar receita");
    } else {
      toast.success("Receita adicionada com sucesso!");
      setRevenueForm({
        title: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
        is_recurring: false,
        recurrence_type: null
      });
      setRevenueDialogOpen(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const { error } = await addExpense({
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount),
      date: expenseForm.date,
      category: expenseForm.category,
      is_recurring: expenseForm.is_recurring,
      recurrence_type: expenseForm.recurrence_type
    });

    if (error) {
      toast.error("Erro ao adicionar despesa");
    } else {
      toast.success("Despesa adicionada com sucesso!");
      setExpenseForm({
        title: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "",
        is_recurring: false,
        recurrence_type: null
      });
      setExpenseDialogOpen(false);
    }
  };

  const revenueCategories = ["vendas", "serviços", "afiliados", "investimentos", "outros"];
  const expenseCategories = ["ferramentas", "marketing", "software", "custos operacionais", "freelancers", "impostos", "outros"];

  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const netProfit = getNetProfit();
  const currentMonthRevenue = getCurrentMonthRevenue();
  const currentMonthExpenses = getCurrentMonthExpenses();
  const currentMonthProfit = currentMonthRevenue - currentMonthExpenses;

  const expensePercentage = totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">QUIKFY</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Gestão Financeira</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faturamento Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Despesas</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lucro Líquido</p>
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </p>
                </div>
                <DollarSign className={`w-8 h-8 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">% Despesas/Faturamento</p>
                  <p className={`text-2xl font-bold ${expensePercentage > 70 ? 'text-red-600' : 'text-gray-900'}`}>
                    {expensePercentage.toFixed(1)}%
                  </p>
                </div>
                <PieChart className={`w-8 h-8 ${expensePercentage > 70 ? 'text-red-600' : 'text-gray-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Month Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mês Atual - {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Receita do Mês</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(currentMonthRevenue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Despesas do Mês</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(currentMonthExpenses)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Lucro do Mês</p>
                <p className={`text-xl font-bold ${currentMonthProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(currentMonthProfit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Insights */}
        {expensePercentage > 70 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center">
                🚨 Alerta Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                Suas despesas representam {expensePercentage.toFixed(1)}% do seu faturamento. 
                Considere revisar seus gastos para melhorar sua margem de lucro.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Data Tables */}
        <Tabs defaultValue="revenues" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenues" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Receitas ({revenues.length})
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Despesas ({expenses.length})
            </TabsTrigger>
          </TabsList>

          {/* Revenues Tab */}
          <TabsContent value="revenues">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Receitas</CardTitle>
                <Dialog open={revenueDialogOpen} onOpenChange={setRevenueDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Receita
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Receita</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Título *</label>
                        <Input
                          value={revenueForm.title}
                          onChange={(e) => setRevenueForm({...revenueForm, title: e.target.value})}
                          placeholder="Ex: Venda de produto"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Valor *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={revenueForm.amount}
                            onChange={(e) => setRevenueForm({...revenueForm, amount: e.target.value})}
                            placeholder="0,00"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Data *</label>
                          <Input
                            type="date"
                            value={revenueForm.date}
                            onChange={(e) => setRevenueForm({...revenueForm, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Categoria *</label>
                        <Select value={revenueForm.category} onValueChange={(value) => setRevenueForm({...revenueForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {revenueCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddRevenue} className="w-full bg-green-600 hover:bg-green-700">
                        Adicionar Receita
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {revenues.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Nenhuma receita cadastrada</p>
                    <Button onClick={() => setRevenueDialogOpen(true)} variant="outline">
                      Adicionar primeira receita
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {revenues.map((revenue) => (
                      <div key={revenue.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{revenue.title}</h3>
                            <Badge variant="outline" className="text-green-600">
                              {revenue.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(revenue.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(Number(revenue.amount))}
                          </p>
                          <Button 
                            onClick={() => deleteRevenue(revenue.id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Despesas</CardTitle>
                <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Despesa</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Título *</label>
                        <Input
                          value={expenseForm.title}
                          onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                          placeholder="Ex: Ferramenta de design"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Valor *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={expenseForm.amount}
                            onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                            placeholder="0,00"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Data *</label>
                          <Input
                            type="date"
                            value={expenseForm.date}
                            onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Categoria *</label>
                        <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddExpense} className="w-full bg-red-600 hover:bg-red-700">
                        Adicionar Despesa
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Nenhuma despesa cadastrada</p>
                    <Button onClick={() => setExpenseDialogOpen(true)} variant="outline">
                      Adicionar primeira despesa
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{expense.title}</h3>
                            <Badge variant="outline" className="text-red-600">
                              {expense.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(expense.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(Number(expense.amount))}
                          </p>
                          <Button 
                            onClick={() => deleteExpense(expense.id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinancialManagement;
