import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { Truck } from "lucide-react";

export function Vehicles() {
  return (
    <PageContainer title="Vehicles" description="Manage your fleet vehicles.">
      <EmptyState title="No vehicles found" description="Add vehicles to start tracking." icon={<Truck />} />
    </PageContainer>
  );
}
