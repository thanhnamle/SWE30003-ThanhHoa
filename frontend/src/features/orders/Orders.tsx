import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { Package } from "lucide-react";

export function Orders() {
  return (
    <PageContainer title="Orders" description="Manage customer orders.">
      <EmptyState title="No orders found" description="Create a new order to begin." icon={<Package />} />
    </PageContainer>
  );
}
