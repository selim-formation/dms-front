import type { HomeActivityItem } from "../types/home.types";

interface ActivityListProps {
  activities?: HomeActivityItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
  if (!activities?.length) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden">
       <div className="flex gap-8 border-b border-gray-100 pb-0 mb-6">
         <button className="text-blue-600 font-semibold border-b-2 border-blue-600 px-2 pb-4 transition-colors">Activity</button>
         <button className="text-gray-400 font-medium hover:text-gray-700 px-2 pb-4 transition-colors">Viewed Recently</button>
         <button className="text-gray-400 font-medium hover:text-gray-700 px-2 pb-4 transition-colors">Modified Recently</button>
       </div>

       <div className="space-y-6">
         {activities.map((item) => (
           <div key={item.id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 -mx-6 px-6 py-2 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
               </div>
               <div>
                 <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{item.documentTitle}</p>
                 <p className="text-sm text-gray-500 mt-0.5">{item.userName} • {item.timestamp}</p>
               </div>
             </div>
             {item.status && (
               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                 item.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                 item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                 item.status === 'Followers' ? 'bg-purple-100 text-purple-700' :
                 'bg-gray-100 text-gray-600'
               }`}>
                 {item.status}
               </span>
             )}
           </div>
         ))}
       </div>
    </div>
  );
}
