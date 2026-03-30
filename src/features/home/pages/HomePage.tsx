
import HeroSection from '../components/HeroSection';
import StatsRow from '../components/StatsRow';
import RecentDocumentsSidebar from '../components/RecentDocumentsSidebar';
import NeedsReview from '../components/NeedsReview';
import PinnedDocuments from '../components/PinnedDocuments';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useTenant } from '@/core/tenant/hooks/useTenant';
import Navbar from '@/shared/components/layout/Navbar';
import TypesChart from '../components/TypesChart';
import DepartmentsChart from '../components/DepartmentsChart';
import CategoryTypeChart from '../components/CategoryTypeChart';
import RenewalChart from '../components/RenewalChart';
import ImportanceChart from '../components/ImportanceChart';
import ExpiryRiskOverview2 from '../components/ExpiryRiskOverview2';
import DocumentsByStatusChart from '../components/DocumentsByStatusChart';
import ExpiredByDeptChart from '../components/ExpiredByDeptChart';
import { useStatistics } from '../hooks/useStatistics';

export default function HomePage() {
  const { user } = useAuth();
  const tenant = useTenant();
  const { data } = useStatistics();

  const firstName = user?.name?.split(' ')[0] ?? 'Ahmed';
  const greeting = 'Welcome back';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 relative">

        {/* Ramadan Lanterns */}
        {/* <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden xl:block"> */}

        {/* Left Lantern */}
        {/* <img
            src={lanternLeftImage}
            alt="Ramadan Lantern Left"
            className="absolute -left-52 w-52 h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
          /> */}

        {/* Right Lantern */}
        {/* <img
            src={lanternRightImage}
            alt="Ramadan Lantern Right"
            className="absolute -right-52 w-52 h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
          /> */}

        {/* </div> */}

        <div className="space-y-8">
          {/* Hero */}
          <HeroSection
            greeting={greeting}
            firstName={firstName}
            tenant={tenant.tenantId ?? ''}
          />
          {/* KPI Stats */}
          <StatsRow data={data} />
          {/* Pinned + Review + Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              <PinnedDocuments />
            </div>
            <div className="space-y-6">
              <NeedsReview tenant={tenant} />
              <RecentDocumentsSidebar tenant={tenant.tenantId ?? ''} />
            </div>


          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TypesChart data={data} />
            <DepartmentsChart data={data} />
            <CategoryTypeChart data={data} />
            <RenewalChart />
            <ImportanceChart data={data} />
          </div>

          {/* Row 1: Status + Created per Month + Expired by Dept */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExpiredByDeptChart data={data} />
            <DocumentsByStatusChart data={data} />
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
    </div >
  );
}
