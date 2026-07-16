import { PageContainer } from "@/components/common/PageContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { FileText } from "lucide-react";

export function Reports() {
  return (
    <PageContainer title="Reports" description="Generate and view analytics reports.">
      <EmptyState title="No reports generated" description="Run your first report to analyze your data." icon={<FileText />} />
    </PageContainer>
  );
}
