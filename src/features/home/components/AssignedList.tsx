import type { AssignedItem } from "../types/home.types";

interface AssignedListProps {
  tasks?: AssignedItem[];
}

export function AssignedList({ tasks }: AssignedListProps) {
  if (!tasks?.length) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 border-l-4 border-orange-500 pl-3">Assigned to Me</h3>
        <span className="text-sm font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{tasks.length} pending</span>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all bg-white group hover:bg-orange-50/10">
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Due {task.dueDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-16 sm:pl-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                task.priority === 'High' ? 'bg-red-100 text-red-700' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
