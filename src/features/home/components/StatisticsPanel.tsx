import type { HomeStatistics } from "../types/home.types";

interface StatisticsPanelProps {
  stats?: HomeStatistics;
}

export function StatisticsPanel({ stats }: StatisticsPanelProps) {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8 hover:shadow-lg transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">Document Statistics</h3>
        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none">
          <option>Last 30 Days</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">By Category</h4>
          <div className="space-y-6">
            {stats.byCategory.map((item, i) => (
              <div key={item.category} className="group cursor-default">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{item.category}</span>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-95 ${
                      i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : i === 2 ? 'bg-purple-500' : 'bg-pink-500'
                    }`}
                    style={{ width: `${(item.count / 100) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">By Document Type</h4>
           <div className="space-y-6">
            {stats.byType.map((item, i) => (
              <div key={item.type} className="group cursor-default">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">{item.type}</span>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-95 ${
                      i === 0 ? 'bg-teal-500' : i === 1 ? 'bg-green-500' : i === 2 ? 'bg-emerald-500' : 'bg-lime-500'
                    }`}
                    style={{ width: `${(item.count / 100) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Monthly Progress</h4>
        <div className="h-64 flex items-end justify-between gap-4 px-2">
           {stats.monthlyProgress.map((item) => (
             <div key={item.month} className="flex flex-col items-center gap-3 flex-1 group">
               <div className="w-full bg-gray-50 rounded-t-xl relative h-full group-hover:bg-gray-100 transition-colors overflow-hidden">
                  {/* Total Uploaded Bar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-500"
                    style={{ height: `${(item.uploaded / 60) * 100}%` }}
                  />
                  
                  {/* Reviewed Bar */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-blue-200 rounded-t-full group-hover:bg-blue-300 transition-colors"
                    style={{ height: `${(item.reviewed / 60) * 100}%` }}
                  />

                  {/* Approved Dot (Line) */}
                   <div 
                    className="absolute w-full h-0.5 bg-blue-500 left-0 right-0 group-hover:h-1 transition-all"
                    style={{ bottom: `${(item.approved / 60) * 100}%` }}
                  />
                  
                  {/* Tooltip on hover (simple CSS only) */}
                  <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white text-[10px] py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.uploaded}
                  </div>
               </div>
               <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase tracking-widest">{item.month}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
