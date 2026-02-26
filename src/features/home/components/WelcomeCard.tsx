import type { HomeSummary } from "../types/home.types";

interface WelcomeCardProps {
  summary?: HomeSummary;
}

export function WelcomeCard({ summary }: WelcomeCardProps) {
  if (!summary) return null;
  
  const stats = [
    { label: "Total documents", value: summary.totalDocuments, icon: "📄", color: "bg-blue-50 text-blue-600" },
    { label: "Folders", value: summary.foldersCount, icon: "📂", color: "bg-green-50 text-green-600" },
    { label: "Shared docs", value: summary.sharedDocsCount, icon: "🔗", color: "bg-purple-50 text-purple-600" },
    { label: "Documents in review", value: summary.inReviewCount, icon: "📝", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, Sarah</h2>
          <p className="text-gray-500">Here's what's happening with your documents today</p>
        </div>
        <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-2xl ${stat.color} bg-opacity-40 transition-transform hover:-translate-y-1`}>
            <div className="text-2xl mb-3 opacity-90">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1 tracking-tight text-gray-900">{stat.value}</div>
            <div className="text-sm font-medium opacity-70 text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
