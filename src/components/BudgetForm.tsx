
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { IndianRupee } from "lucide-react";
import { getCategories, saveBudget } from "@/utils/storage";

export function BudgetForm() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState(getCategories("expense"));

  useEffect(() => {
    // Only expense categories can have budgets
    setCategories(getCategories("expense"));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation
      if (!category) {
        toast({
          title: "Category required",
          description: "Please select a category for your budget.",
          variant: "destructive",
        });
        return;
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid positive amount.",
          variant: "destructive",
        });
        return;
      }

      // Save budget
      saveBudget({
        category,
        amount: Number(amount),
      });

      // Reset form
      setAmount("");

      toast({
        title: "Budget updated",
        description: `Budget for ${category} has been set to ₹${amount}.`,
      });
    } catch (error) {
      console.error("Error setting budget:", error);
      toast({
        title: "Error",
        description: "Failed to set budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Set Monthly Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-amount">Monthly Budget Amount (₹)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IndianRupee className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="budget-amount"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                className="pl-10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Save Budget
        </Button>
      </CardFooter>
    </Card>
  );
}
