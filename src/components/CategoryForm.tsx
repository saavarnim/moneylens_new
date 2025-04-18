
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { addCategory } from "@/utils/storage";

// List of available icon options
const ICON_OPTIONS = [
  { value: "IndianRupee", label: "Rupee" },
  { value: "Wallet", label: "Wallet" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "Landmark", label: "Bank" },
  { value: "Briefcase", label: "Work" },
  { value: "ShoppingBag", label: "Shopping" },
  { value: "Home", label: "Home" },
  { value: "Car", label: "Transport" },
  { value: "Utensils", label: "Food" },
  { value: "HeartPulse", label: "Health" },
  { value: "Shirt", label: "Clothing" },
  { value: "Dumbbell", label: "Fitness" },
  { value: "Gamepad2", label: "Entertainment" },
  { value: "GraduationCap", label: "Education" },
  { value: "Gift", label: "Gift" },
  { value: "Smartphone", label: "Phone" },
  { value: "Wifi", label: "Internet" },
  { value: "Landmark", label: "Investment" },
];

interface CategoryFormProps {
  type: "income" | "expense";
  onCategoryAdded?: () => void;
}

export function CategoryForm({ type, onCategoryAdded }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the category.",
        variant: "destructive",
      });
      return;
    }

    try {
      addCategory({
        name: name.trim(),
        type,
        icon,
      });

      toast({
        title: "Category added",
        description: `New ${type} category "${name}" has been added.`,
      });

      // Reset form
      setName("");
      
      // Notify parent component
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Category already exists") {
        // Error already handled
      } else {
        console.error("Error adding category:", error);
        toast({
          title: "Error",
          description: "Failed to add category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        Add New {type === "income" ? "Income" : "Expense"} Category
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category-name">Category Name</Label>
          <Input
            id="category-name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category-icon">Icon</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger id="category-icon">
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full">
          Add Category
        </Button>
      </form>
    </div>
  );
}
