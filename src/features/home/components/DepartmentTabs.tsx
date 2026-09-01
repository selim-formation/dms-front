import { Users, Briefcase, BarChart3, Zap, Shield, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

export default function DepartmentTabs({
  onSelectDepartment,
  selectedDepartment,
}: DepartmentTabsProps) {
  const { t } = useTranslation(['home', 'common']);

  const departments: Department[] = [
    {
      id: 'all',
      name: t('home:departmentTabs.all'),
      icon: <Briefcase size={18} />,
      color: 'text-chart-1',
      documentCount: 48,
    },
    {
      id: 'engineering',
      name: t('home:departmentTabs.engineering'),
      icon: <Zap size={18} />,
      color: 'text-chart-2',
      documentCount: 12,
    },
    {
      id: 'product',
      name: t('home:departmentTabs.product'),
      icon: <Lightbulb size={18} />,
      color: 'text-chart-3',
      documentCount: 8,
    },
    {
      id: 'marketing',
      name: t('home:departmentTabs.marketing'),
      icon: <BarChart3 size={18} />,
      color: 'text-chart-4',
      documentCount: 15,
    },
    {
      id: 'hr',
      name: t('home:departmentTabs.hr'),
      icon: <Users size={18} />,
      color: 'text-chart-5',
      documentCount: 7,
    },
    {
      id: 'legal',
      name: t('home:departmentTabs.legal'),
      icon: <Shield size={18} />,
      color: 'text-chart-6',
      documentCount: 6,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('home:departmentTabs.heading')}</h3>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelectDepartment(dept.id)}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap group ${selectedDepartment === dept.id
                ? 'bg-card text-foreground shadow-md border border-border'
                : 'bg-muted text-muted-foreground hover:bg-accent border border-transparent'
              }`}
          >
            <span
              className={`${selectedDepartment === dept.id ? dept.color : 'text-muted-foreground group-hover:' + dept.color
                } transition-colors`}
            >
              {dept.icon}
            </span>
            <span>{dept.name}</span>
            <span
              className={`ms-1 px-2 py-0.5 text-xs font-semibold rounded-full ${selectedDepartment === dept.id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-secondary/50 text-muted-foreground'
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
