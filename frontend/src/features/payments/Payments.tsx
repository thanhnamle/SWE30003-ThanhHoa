import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { CreditCard } from "lucide-react";

export function Payments() {
  return (
    <PageContainer title="Payments" description="Manage invoices and billing.">
      <EmptyState title="No transactions" description="Invoices will appear here once orders are processed." icon={<CreditCard />} />
    </PageContainer>
  );
}
