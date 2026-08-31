import { useTranslation } from "react-i18next";
import logo from "@/assets/bisco-logo.png";
import HeroSection from "../components/HeroSection";
import StatsRow from "../components/StatsRow";
import { useAuth } from "@/core/auth/hooks/useAuth";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import Navbar from "@/shared/components/layout/Navbar";
import { RouteErrorBanner } from "@/shared/components/RouteErrorBanner";
import { useStatistics } from "../hooks/useStatistics";
import DocumentsCreatedPerMonthChart from "../components/DocumentsCreatedPerMonthChart";
import ExpiredByDeptChart from "../components/ExpiredByDeptChart";
import ExpiryRiskOverview from "../components/ExpiryRiskOverview";
import DownloadActivityChart from "../components/DownloadActivityChart";
import ExpiredByDeptStackedChart from "../components/ExpiredByDeptStackedChart";
import MostViewedDocuments from "../components/MostViewedDocuments";
import TopActiveUsers from "../components/TopActiveUsers";
import ExpiredByDeptGroupedChart from "../components/ExpiredByDeptGroupedChart";
import AverageRenewalDelayChart from "../components/AverageRenewalDelayChart";
import TopExpiringDocuments from "../components/TopExpiringDocuments";
import PinnedDocuments from "../components/PinnedDocuments";
import FavoriteDocuments from "../components/FavoriteDocuments";

export default function HomePage() {
  const { t } = useTranslation(["home", "common"]);
  const { user } = useAuth();
  const tenant = useTenant();
  const { data } = useStatistics();

  const firstName = user?.name?.split(" ")[0] ?? "Ahmed";
  const greeting = t("homePage.greeting");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <RouteErrorBanner />

          {/* Hero */}
          <HeroSection
            greeting={greeting}
            firstName={firstName}
            logo={logo}
            tenant={tenant.tenantId ?? ""}
          />

          {/* KPI Stats */}
          <StatsRow data={data} />

          <PinnedDocuments />

          <FavoriteDocuments />

          {/* Row 1: Created per Month + Expired by Dept */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocumentsCreatedPerMonthChart />
            <ExpiredByDeptChart />
            <ExpiryRiskOverview />
          </div>

          {/* Row 2: Download Activity + Expired Stacked */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DownloadActivityChart />
            <ExpiredByDeptStackedChart />
            <MostViewedDocuments />
          </div>

          {/* Row 3: Top Active Users + Expired Grouped + Avg Renewal Delay */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopActiveUsers />
            <ExpiredByDeptGroupedChart />
            <AverageRenewalDelayChart />
          </div>

          {/* Row 4: Top Expiring */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopExpiringDocuments />
          </div>
        </div>
      </main>
    </div>
  );
}
