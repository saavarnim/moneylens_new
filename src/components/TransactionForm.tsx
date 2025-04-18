
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, IndianRupee } from "lucide-react";
import { formatDateForInput, formatTimeForInput } from "@/utils/format";
import { addTransaction, getCategories } from "@/utils/storage";
import { CategoryForm } from "./CategoryForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function TransactionForm() {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [time, setTime] = useState(formatTimeForInput(new Date()));
  const [categories, setCategories] = useState(getCategories("expense"));
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // Fetch categories when type changes
  useEffect(() => {
    setCategories(getCategories(type));
    setCategory(""); // Reset category when type changes
  }, [type]);

  // Handle category change after a new category is added
  const handleCategoryAdded = () => {
    setCategories(getCategories(type));
    setOpenCategoryDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation
      if (!category) {
        toast({
          title: "Category required",
          description: "Please select a category for your transaction.",
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

      // Create transaction object
      const transaction = {
        type,
        category,
        amount: Number(amount),
        description,
        date: new Date(`${date}T${time}`).toISOString(),
      };

      // Save transaction
      addTransaction(transaction);

      // Reset form
      setAmount("");
      setDescription("");
      setDate(formatDateForInput(new Date()));
      setTime(formatTimeForInput(new Date()));

      toast({
        title: "Transaction added",
        description: `${type === "income" ? "Income" : "Expense"} of ₹${amount} has been recorded.`,
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "income" | "expense")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label
                  htmlFor="income"
                  className="text-income cursor-pointer font-medium"
                >
                  Income
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label
                  htmlFor="expense"
                  className="text-expense cursor-pointer font-medium"
                >
                  Expense
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Category</Label>
              <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CategoryForm
                    type={type}
                    onCategoryAdded={handleCategoryAdded}
                  />
                </DialogContent>
              </Dialog>
            </div>
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
            <Label htmlFor="amount">Amount (₹)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IndianRupee className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="amount"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this transaction..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Add Transaction
        </Button>
      </CardFooter>
    </Card>
  );
}
