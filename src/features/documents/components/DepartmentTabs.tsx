import { Users, Briefcase, BarChart3, Zap, Shield, Lightbulb } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  documentCount: number;
}

interface DepartmentTabsProps {
  onSelectDepartment: (departmentId: string) => void;
  selectedDepartment: string;
}

const departments: Department[] = [
  {
    id: 'all',
    name: 'All Documents',
    icon: <Briefcase size={18} />,
    color: 'text-blue-600',
    documentCount: 48,
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: <Zap size={18} />,
    color: 'text-orange-600',
    documentCount: 12,
  },
  {
    id: 'product',
    name: 'Product',
    icon: <Lightbulb size={18} />,
    color: 'text-yellow-600',
    documentCount: 8,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <BarChart3 size={18} />,
    color: 'text-pink-600',
    documentCount: 15,
  },
  {
    id: 'hr',
    name: 'Human Resources',
    icon: <Users size={18} />,
    color: 'text-green-600',
    documentCount: 7,
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    icon: <Shield size={18} />,
    color: 'text-red-600',
    documentCount: 6,
  },
];

export default function DepartmentTabs({
  onSelectDepartment,
  selectedDepartment,
}: DepartmentTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Departments</h3>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelectDepartment(dept.id)}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap group ${selectedDepartment === dept.id
              ? 'bg-white text-gray-900 shadow-md border border-gray-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
          >
            <span
              className={`${selectedDepartment === dept.id ? dept.color : 'text-gray-500 group-hover:' + dept.color
                } transition-colors`}
            >
              {dept.icon}
            </span>
            <span>{dept.name}</span>
            <span
              className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${selectedDepartment === dept.id
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gray-300 bg-opacity-50 text-gray-600'
                }`}
            >
              {dept.documentCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
