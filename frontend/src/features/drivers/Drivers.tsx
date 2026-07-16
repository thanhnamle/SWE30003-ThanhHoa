import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { Users } from "lucide-react";

export function Drivers() {
  return (
    <PageContainer title="Drivers" description="Manage your fleet drivers.">
      <EmptyState title="No drivers found" description="Add drivers to assign them to vehicles." icon={<Users />} />
    </PageContainer>
  );
}
