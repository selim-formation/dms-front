import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import armaLogo from "@/assets/bisco-logo.png";
import HeroSection from "../components/HeroSection";
import StatsRow from "../components/StatsRow";
import RecentDocumentsSidebar from "../components/RecentDocumentsSidebar";
import RecentTasksSidebar from "../components/RecentTasksSidebar";
import PinnedDocuments from "../components/PinnedDocuments";
import { useAuth } from "@/core/auth/hooks/useAuth";
import { useTenant } from "@/core/tenant/hooks/useTenant";
import { useStatistics } from "../hooks/useStatistics";
import Navbar from "@/shared/components/layout/Navbar";

const DocumentInsightsSection = lazy(
  () => import("../components/insights/DocumentInsightsSection"),
);

export default function HomePage() {
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const { tenantId } = useTenant();
  const tenant = tenantId ?? "";
  const { data: statistics } = useStatistics();

  const firstName = user?.name?.split(" ")[0] ?? "Ahmed";
  const greeting = t("homePage.greeting");

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
              <RecentTasksSidebar tenant={tenant} />
              <RecentDocumentsSidebar tenant={tenant} />
            </div>
          </div>

          {/* Document insights (admin/head) — lazy: recharts stays out of the main bundle */}
          <Suspense fallback={null}>
            <DocumentInsightsSection />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
