import { PageContainer } from "@/components/common/PageContainer";
import { Navigation } from "lucide-react";

export function Tracking() {
  return (
    <PageContainer title="Live Tracking" description="Real-time map view of your active fleet.">
      <div className="bg-muted border border-border rounded-lg h-[600px] flex items-center justify-center">
        <div className="text-center text-muted-foreground flex flex-col items-center">
          <Navigation className="h-12 w-12 mb-4 opacity-50" />
          <p>Map Integration Placeholder</p>
        </div>
      </div>
    </PageContainer>
  );
}
