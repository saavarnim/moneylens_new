
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupee } from "@/utils/format";
import { calculateStats, initializeStorage } from "@/utils/storage";
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { BudgetForm } from "./BudgetForm";
import { TransactionList } from "./TransactionList";
import { BudgetList } from "./BudgetList";
import { FinanceCharts } from "./FinanceCharts";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"transactions" | "budgets" | "insights">("transactions");
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  // Initialize storage on component mount
  useEffect(() => {
    initializeStorage();
  }, []);

  // Load stats
  useEffect(() => {
    const loadStats = () => {
      try {
        const calculatedStats = calculateStats();
        setStats({
          totalIncome: calculatedStats.totalIncome,
          totalExpense: calculatedStats.totalExpense,
          balance: calculatedStats.balance,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    loadStats();
    
    // Set up an interval to refresh the stats every 5 seconds
    const intervalId = setInterval(loadStats, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <IndianRupee className="h-6 w-6" />
          MoneyLens
        </h1>
        <p className="text-muted-foreground">
          Personal Finance Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-income-muted">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <h3 className="text-2xl font-bold text-income">{formatRupee(stats.totalIncome)}</h3>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-income" />
          </CardContent>
        </Card>
        
        <Card className="bg-expense-muted">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <h3 className="text-2xl font-bold text-expense">{formatRupee(stats.totalExpense)}</h3>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-expense" />
          </CardContent>
        </Card>
        
        <Card className={stats.balance >= 0 ? "bg-income-muted" : "bg-expense-muted"}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <h3 className={`text-2xl font-bold ${stats.balance >= 0 ? "text-income" : "text-expense"}`}>
                {formatRupee(Math.abs(stats.balance))}
              </h3>
            </div>
            <Wallet className={`h-8 w-8 ${stats.balance >= 0 ? "text-income" : "text-expense"}`} />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="mb-6">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <TransactionForm />
            </div>
            <div className="md:col-span-2">
              <TransactionList />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="budgets" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <BudgetForm />
            </div>
            <div className="md:col-span-2">
              <BudgetList />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <FinanceCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
