
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransactions, getCategories, calculateStats } from "@/utils/storage";
import { formatRupee, formatPercentage } from "@/utils/format";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import * as LucideIcons from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Dynamic icon component
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  // @ts-ignore - dynamic icon access
  const IconComponent = LucideIcons[name] || LucideIcons.CircleDashed;
  return <IconComponent className={className} />;
};

export function FinanceCharts() {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");
  const [chartData, setChartData] = useState<any>({
    income: {
      labels: [],
      data: [],
    },
    expense: {
      labels: [],
      data: [],
    },
  });
  
  const [stats, setStats] = useState<any>({
    totalIncome: 0,
    totalExpense: 0,
    incomeByCategory: {},
    expenseByCategory: {},
  });
  
  const [incomeCategories, setIncomeCategories] = useState(getCategories("income"));
  const [expenseCategories, setExpenseCategories] = useState(getCategories("expense"));

  useEffect(() => {
    loadData();
    
    // Set up an interval to refresh the data every 10 seconds
    const intervalId = setInterval(loadData, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadData = () => {
    try {
      // Refresh categories
      setIncomeCategories(getCategories("income"));
      setExpenseCategories(getCategories("expense"));
      
      // Calculate stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
      
      // Prepare chart data for income
      const incomeData = {
        labels: Object.keys(calculatedStats.incomeByCategory),
        data: Object.values(calculatedStats.incomeByCategory) as number[],
      };
      
      // Prepare chart data for expenses
      const expenseData = {
        labels: Object.keys(calculatedStats.expenseByCategory),
        data: Object.values(calculatedStats.expenseByCategory) as number[],
      };
      
      setChartData({
        income: incomeData,
        expense: expenseData,
      });
    } catch (error) {
      console.error("Error loading chart data:", error);
    }
  };
  
  // Generate colors for chart segments
  const generateColors = (count: number, isIncome: boolean): string[] => {
    const baseColor = isIncome ? 'rgba(56, 161, 105, ' : 'rgba(229, 62, 62, ';
    const colors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const opacity = 0.4 + (i * 0.5 / count);
      colors.push(baseColor + opacity + ')');
    }
    
    return colors;
  };
  
  // Prepare pie chart data
  const getPieData = (type: "income" | "expense") => {
    const labels = chartData[type].labels;
    const data = chartData[type].data;
    const backgroundColor = generateColors(labels.length, type === 'income');
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: backgroundColor.map(color => color.replace(', 0.', ', 1.')),
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Prepare bar chart data
  const getBarData = (type: "income" | "expense") => {
    const labels = chartData[type].labels;
    const data = chartData[type].data;
    const backgroundColor = type === 'income' ? 'rgba(56, 161, 105, 0.7)' : 'rgba(229, 62, 62, 0.7)';
    
    return {
      labels,
      datasets: [
        {
          label: type === 'income' ? 'Income' : 'Expenses',
          data,
          backgroundColor,
          borderColor: type === 'income' ? 'rgb(56, 161, 105)' : 'rgb(229, 62, 62)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };
  
  // Get category icon
  const getCategoryIcon = (categoryName: string, type: "income" | "expense") => {
    const categories = type === "income" ? incomeCategories : expenseCategories;
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || "CircleDashed";
  };
  
  // Calculate percentages for stats
  const calculatePercentage = (amount: number, total: number) => {
    if (total === 0) return 0;
    return (amount / total) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Financial Overview
        </CardTitle>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "income" | "expense")}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="income" className="flex-1 text-income">
              Income Analysis
            </TabsTrigger>
            <TabsTrigger value="expense" className="flex-1 text-expense">
              Expense Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-6">
          <TabsContent value="income" className="mt-0 space-y-4">
            {chartData.income.labels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No income data to display.
              </div>
            ) : (
              <>
                <div className="h-64 md:h-72">
                  <Doughnut data={getPieData("income")} options={chartOptions} />
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-3">Income Breakdown</h3>
                  <div className="space-y-3">
                    {chartData.income.labels.map((category: string, index: number) => {
                      const amount = chartData.income.data[index];
                      const percentage = calculatePercentage(amount, stats.totalIncome);
                      const iconName = getCategoryIcon(category, "income");
                      
                      return (
                        <div key={category} className="stat-card">
                          <div className="stat-icon income-icon">
                            <DynamicIcon name={iconName} className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-gray-500">{formatRupee(amount)}</div>
                          </div>
                          <div className="text-income font-medium">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="expense" className="mt-0 space-y-4">
            {chartData.expense.labels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No expense data to display.
              </div>
            ) : (
              <>
                <div className="h-64 md:h-72">
                  <Doughnut data={getPieData("expense")} options={chartOptions} />
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-3">Expense Breakdown</h3>
                  <div className="space-y-3">
                    {chartData.expense.labels.map((category: string, index: number) => {
                      const amount = chartData.expense.data[index];
                      const percentage = calculatePercentage(amount, stats.totalExpense);
                      const iconName = getCategoryIcon(category, "expense");
                      
                      return (
                        <div key={category} className="stat-card">
                          <div className="stat-icon expense-icon">
                            <DynamicIcon name={iconName} className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-gray-500">{formatRupee(amount)}</div>
                          </div>
                          <div className="text-expense font-medium">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
