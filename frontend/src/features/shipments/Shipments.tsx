import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { Map } from "lucide-react";

export function Shipments() {
  return (
    <PageContainer title="Shipments" description="Manage ongoing and past shipments.">
      <EmptyState title="No shipments found" description="Convert orders to shipments to track them." icon={<Map />} />
    </PageContainer>
  );
}
