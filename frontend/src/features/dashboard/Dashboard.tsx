import { PageContainer } from "@/components/common/PageContainer";
import { StatCard } from "@/components/common/StatCard";
import { Truck, Users, Package, DollarSign } from "lucide-react";

export function Dashboard() {
  return (
    <PageContainer title="Dashboard" description="Overview of your fleet and operations.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Vehicles" 
          value="124" 
          icon={<Truck className="h-5 w-5" />} 
          trend={{ value: 12, isPositive: true }} 
        />
        <StatCard 
          title="Active Drivers" 
          value="98" 
          icon={<Users className="h-5 w-5" />} 
          trend={{ value: 4, isPositive: true }} 
        />
        <StatCard 
          title="Pending Orders" 
          value="45" 
          icon={<Package className="h-5 w-5" />} 
          trend={{ value: 2, isPositive: false }} 
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$124,500" 
          icon={<DollarSign className="h-5 w-5" />} 
          trend={{ value: 8.5, isPositive: true }} 
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 h-96 flex flex-col justify-center items-center text-muted-foreground">
          [Chart Placeholder: Shipments Over Time]
        </div>
        <div className="bg-card border border-border rounded-lg p-6 h-96 flex flex-col justify-center items-center text-muted-foreground">
          [Chart Placeholder: Revenue by Region]
        </div>
      </div>
    </PageContainer>
  );
}
