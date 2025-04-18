
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatRupee, formatDateTime } from "@/utils/format";
import { getTransactions, deleteTransaction, Transaction } from "@/utils/storage";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  // Load transactions
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const data = getTransactions();
        // Sort by date, most recent first
        setTransactions(
          data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast({
          title: "Error loading transactions",
          description: "There was a problem loading your transaction data.",
          variant: "destructive",
        });
      }
    };

    loadTransactions();
    
    // Set up an interval to refresh the data every 10 seconds
    const intervalId = setInterval(loadTransactions, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle transaction deletion
  const handleDelete = (id: string) => {
    try {
      deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed.",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Transaction History
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as any)}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1 text-income">
              Income
            </TabsTrigger>
            <TabsTrigger value="expense" className="flex-1 text-expense">
              Expenses
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`transaction-card rounded-lg p-3 shadow ${
                    transaction.type === "income" ? "income-card" : "expense-card"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center">
                        {transaction.type === "income" ? (
                          <ArrowUp className="h-4 w-4 mr-1 text-income" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1 text-expense" />
                        )}
                        {transaction.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.description || "No description"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDateTime(new Date(transaction.date))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`font-medium ${
                          transaction.type === "income"
                            ? "text-income"
                            : "text-expense"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatRupee(transaction.amount)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction.id)}
                        className="h-7 w-7"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}
