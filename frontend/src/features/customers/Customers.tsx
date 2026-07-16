import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchBar } from "@/components/common/SearchBar";
import { Users } from "lucide-react";

export function Customers() {
  return (
    <PageContainer 
      title="Customers" 
      description="Manage your client relationships."
      action={<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm">Add Customer</button>}
    >
      <div className="mb-6 max-w-md">
        <SearchBar placeholder="Search customers by name or email..." />
      </div>
      <EmptyState 
        title="No customers yet" 
        description="Add your first customer to get started with order management."
        icon={<Users className="h-6 w-6" />}
      />
    </PageContainer>
  );
}
