import { PageContainer } from "@/components/common/PageContainer";

export function Settings() {
  return (
    <PageContainer title="Settings" description="Manage system configurations and preferences.">
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <h3 className="font-medium text-lg mb-4">Profile Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">Settings form placeholder</p>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Save Changes</button>
      </div>
    </PageContainer>
  );
}
