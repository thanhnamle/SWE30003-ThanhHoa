import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SearchBar({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        placeholder="Search..."
        {...props}
      />
    </div>
  );
}
