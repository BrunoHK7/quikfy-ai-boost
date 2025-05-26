
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Revenue {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  is_recurring: boolean;
  recurrence_type: string | null;
  created_at: string;
  updated_at: string;
}

interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  is_recurring: boolean;
  recurrence_type: string | null;
  created_at: string;
  updated_at: string;
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    } else {
      setRevenues([]);
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFinancialData = async () => {
    if (!user) return;

    try {
      const [revenuesResult, expensesResult] = await Promise.all([
        supabase
          .from('revenues')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false }),
        supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
      ]);

      if (revenuesResult.error) {
        console.error('Error fetching revenues:', revenuesResult.error);
      } else {
        setRevenues(revenuesResult.data || []);
      }

      if (expensesResult.error) {
        console.error('Error fetching expenses:', expensesResult.error);
      } else {
        setExpenses(expensesResult.data || []);
      }
    } catch (error) {
      console.error('Error in fetchFinancialData:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRevenue = async (revenue: Omit<Revenue, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('revenues')
        .insert({
          ...revenue,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding revenue:', error);
        return { error };
      }

      setRevenues(prev => [data, ...prev]);
      return { data };
    } catch (error) {
      console.error('Error in addRevenue:', error);
      return { error };
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        return { error };
      }

      setExpenses(prev => [data, ...prev]);
      return { data };
    } catch (error) {
      console.error('Error in addExpense:', error);
      return { error };
    }
  };

  const deleteRevenue = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting revenue:', error);
        return { error };
      }

      setRevenues(prev => prev.filter(revenue => revenue.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error in deleteRevenue:', error);
      return { error };
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        return { error };
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error in deleteExpense:', error);
      return { error };
    }
  };

  // Cálculos financeiros
  const getTotalRevenue = () => {
    return revenues.reduce((total, revenue) => total + Number(revenue.amount), 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
  };

  const getNetProfit = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  const getCurrentMonthRevenue = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return revenues
      .filter(revenue => {
        const revenueDate = new Date(revenue.date);
        return revenueDate.getMonth() === currentMonth && revenueDate.getFullYear() === currentYear;
      })
      .reduce((total, revenue) => total + Number(revenue.amount), 0);
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + Number(expense.amount), 0);
  };

  return {
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
    getCurrentMonthExpenses,
    refetch: fetchFinancialData
  };
};
