import { Bell, } from "lucide-react";



export default function Sidebar() {
    const upcomingReminders = [
        { title: 'Contract Renewal', date: 'Feb 15, 2026', time: '09:00' },
        { title: 'Policy Review Deadline', date: 'Feb 18, 2026', time: '14:00' },
        { title: 'Quarterly Report Due', date: 'Feb 20, 2026', time: '17:00' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gray-900 text-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Assigned to Me</h3>
                    <span className="text-xs font-medium bg-primary text-primary-foreground rounded-full px-2.5 py-0.5">
                        {upcomingReminders.length} tasks
                    </span>
                </div>

                <ul className="space-y-3">
                    {upcomingReminders.map((task, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                                <Bell className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{task.title}</p>
                                <p className="text-xs opacity-60">{task.date} · {task.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>



        </div>
    );
}
