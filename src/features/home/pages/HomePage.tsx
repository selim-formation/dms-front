import armaLogo from "@/assets/bisco-logo.png";
import HeroSection from "../components/HeroSection";
import StatsRow from "../components/StatsRow";
import RecentDocumentsSidebar from "../components/RecentDocumentsSidebar";
import RecentTasksSidebar from "../components/RecentTasksSidebar";
import NeedsReview from "../components/NeedsReview";
import PinnedDocuments from "../components/PinnedDocuments";
import { useAuth } from "@/core/auth/hooks/useAuth";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { useStatistics } from "../hooks/useStatistics";
import Navbar from "@/shared/components/layout/Navbar";
import TypesChart from "../components/TypesChart";
import DepartmentsChart from "../components/DepartmentsChart";
import CategoryTypeChart from "../components/CategoryTypeChart";
import RenewalChart from "../components/RenewalChart";
import ImportanceChart from "../components/ImportanceChart";
import ExpiryRiskOverview2 from "../components/ExpiryRiskOverview2";
import DocumentsByStatusChart from "../components/DocumentsByStatusChart";
import ExpiredByDeptChart from "../components/ExpiredByDeptChart";
export default function HomePage() {
  const { user } = useAuth();
  const { tenantId } = useTenant();
  const tenant = tenantId ?? "";
  const { data: statistics } = useStatistics();

  const firstName = user?.name?.split(" ")[0] ?? "Ahmed";
  const greeting = "Ramadan Kareem";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        

        <div className="space-y-8">
          {/* Hero */}
          <HeroSection
            greeting={greeting}
            firstName={firstName}
            logo={armaLogo}
            tenant={tenant}
          />
          {/* KPI Stats */}
          <StatsRow data={statistics} />
          {/* Pinned + Review + Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              <PinnedDocuments />
            </div>
            <div className="space-y-6">
              {/* <NeedsReview tenant={tenant} /> */}
              <RecentTasksSidebar tenant={tenant} />
              <RecentDocumentsSidebar tenant={tenant} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TypesChart />
            <DepartmentsChart />
            <CategoryTypeChart />
            <RenewalChart />
            <ImportanceChart />
          </div>

          {/* Row 1: Status + Created per Month + Expired by Dept */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExpiredByDeptChart />
            <DocumentsByStatusChart />
            <ExpiryRiskOverview2 />

            {/* <DocumentsCreatedPerMonthChart /> */}
            {/* <ExpiredByDeptChart /> */}
          </div>
          {/* Row 2: Expiry Risk + Expiry Risk 2 + Download Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <ExpiryRiskOverview /> */}
            {/* <DownloadActivityChart /> */}
          </div>
          {/* Row 3: Expired Stacked + Most Viewed + Top Active Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <ExpiredByDeptStackedChart /> */}
            {/* <MostViewedDocuments /> */}
            {/* <TopActiveUsers /> */}
          </div>
          {/* Row 4: Expired Grouped + Avg Renewal Delay + Top Expiring */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <ExpiredByDeptGroupedChart />
            <AverageRenewalDelayChart />
            <TopExpiringDocuments /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
