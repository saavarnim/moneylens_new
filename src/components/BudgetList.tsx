
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRupee } from "@/utils/format";
import { getBudgets, deleteBudget, calculateStats, BudgetProgress } from "@/utils/storage";
import { Trash2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function BudgetList() {
  const [budgets, setBudgets] = useState<BudgetProgress[]>([]);

  // Load budgets
  useEffect(() => {
    const loadBudgets = () => {
      try {
        const stats = calculateStats();
        // Set the budgets state with the budgetProgress
        setBudgets(stats.budgetProgress);
      } catch (error) {
        console.error("Error loading budgets:", error);
        toast({
          title: "Error loading budgets",
          description: "There was a problem loading your budget data.",
          variant: "destructive",
        });
      }
    };

    loadBudgets();
    
    // Set up an interval to refresh the data every 10 seconds
    const intervalId = setInterval(loadBudgets, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle budget deletion
  const handleDelete = (id: string) => {
    try {
      deleteBudget(id);
      setBudgets(budgets.filter((b) => b.id !== id));
      toast({
        title: "Budget deleted",
        description: "The budget has been removed.",
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Monthly Budgets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No budgets set. Add a budget to track your spending.
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{budget.category}</div>
                    <div className="text-sm text-gray-500">
                      Spent {formatRupee(budget.spent)} of {formatRupee(budget.amount)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {budget.status === 'danger' && (
                      <AlertCircle className="h-4 w-4 text-expense" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(budget.id)}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <div className="budget-progress">
                  <div 
                    className={`budget-progress-bar budget-${budget.status}`}
                    style={{ width: `${budget.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-1 text-xs">
                  <div className={budget.status === 'danger' ? 'text-expense' : ''}>
                    {budget.percentage.toFixed(0)}%
                  </div>
                  <div className="text-gray-500">
                    {formatRupee(budget.remaining)} remaining
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
