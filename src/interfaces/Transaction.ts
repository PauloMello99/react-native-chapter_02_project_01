import { Category } from "./Category";

export interface Transaction {
  id: string;
  title: string;
  amount: string;
  category: Category;
  date: string;
  type: "income" | "outcome";
}
