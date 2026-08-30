import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import {
    Search,
    FileText,
    Share2,
    Mail,
    Phone,
    MoreHorizontal,
    Users,
    UserCheck,
    Shield,
    Filter,
} from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useTenant } from '@/core/tenant/hooks/useTenant';
import Navbar from '@/shared/components/layout/Navbar';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    avatar?: string;
    status: 'active' | 'away' | 'offline';
    documentsCount: number;
    sharedCount: number;
    joinedAt: string;
}

const MOCK_TEAM: TeamMember[] = [
    {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@acme.corp',
        phone: '+1 555-0101',
        role: 'Admin',
        department: 'Management',
        status: 'active',
        documentsCount: 48,
        sharedCount: 12,
        joinedAt: '2023-01-15',
    },
    {
        id: 2,
        name: 'James Wilson',
        email: 'james.wilson@acme.corp',
        phone: '+1 555-0102',
        role: 'Editor',
        department: 'Legal',
        status: 'active',
        documentsCount: 35,
        sharedCount: 8,
        joinedAt: '2023-03-22',
    },
    {
        id: 3,
        name: 'Maria Garcia',
        email: 'maria.garcia@acme.corp',
        phone: '+1 555-0103',
        role: 'Viewer',
        department: 'Finance',
        status: 'away',
        documentsCount: 22,
        sharedCount: 15,
        joinedAt: '2023-05-10',
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@acme.corp',
        phone: '+1 555-0104',
        role: 'Editor',
        department: 'Engineering',
        status: 'active',
        documentsCount: 67,
        sharedCount: 23,
        joinedAt: '2022-11-08',
    },
    {
        id: 5,
        name: 'Emma Thompson',
        email: 'emma.thompson@acme.corp',
        phone: '+1 555-0105',
        role: 'Admin',
        department: 'HR',
        status: 'offline',
        documentsCount: 41,
        sharedCount: 19,
        joinedAt: '2023-02-14',
    },
    {
        id: 6,
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@acme.corp',
        phone: '+1 555-0106',
        role: 'Viewer',
        department: 'Operations',
        status: 'active',
        documentsCount: 18,
        sharedCount: 5,
        joinedAt: '2023-07-20',
    },
    {
        id: 7,
        name: 'Lisa Park',
        email: 'lisa.park@acme.corp',
        phone: '+1 555-0107',
        role: 'Editor',
        department: 'Marketing',
        status: 'active',
        documentsCount: 29,
        sharedCount: 11,
        joinedAt: '2023-04-01',
    },
    {
        id: 8,
        name: 'Robert Brown',
        email: 'robert.brown@acme.corp',
        phone: '+1 555-0108',
        role: 'Viewer',
        department: 'Sales',
        status: 'away',
        documentsCount: 14,
        sharedCount: 7,
        joinedAt: '2023-08-12',
    },
];

const statusColors: Record<string, string> = {
    active: 'bg-success',
    away: 'bg-warning',
    offline: 'bg-muted-foreground/40',
};

const roleVariant: Record<string, string> = {
    Admin: 'bg-primary/10 text-primary border-primary/20',
    Editor: 'bg-accent/10 text-accent border-accent/20',
    Viewer: 'bg-muted text-muted-foreground border-border',
};

export default function TeamPage() {
    const { t } = useTranslation(['teams', 'common']);
    const tenant = useTenant();
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState<string>('all');

    const departments = ['all', ...Array.from(new Set(MOCK_TEAM.map((m) => m.department)))];

    const filtered = MOCK_TEAM.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase()) ||
            m.department.toLowerCase().includes(search.toLowerCase());
        const matchesDept = filterDept === 'all' || m.department === filterDept;
        return matchesSearch && matchesDept;
    });

    const stats = {
        total: MOCK_TEAM.length,
        active: MOCK_TEAM.filter((m) => m.status === 'active').length,
        admins: MOCK_TEAM.filter((m) => m.role === 'Admin').length,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('teams:teamPage.title')}</h1>
                            <p className="mt-1 text-muted-foreground">
                                {t('teams:teamPage.subtitle')}
                            </p>
                        </div>
                        <Button className="gap-2 shadow-md shadow-primary/20">
                            <Users className="h-4 w-4" />
                            {t('teams:teamPage.inviteMember')}
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                <p className="text-sm text-muted-foreground">{t('teams:teamPage.totalMembers')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                                <UserCheck className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                                <p className="text-sm text-muted-foreground">{t('teams:teamPage.activeNow')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                                <Shield className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
                                <p className="text-sm text-muted-foreground">{t('teams:teamPage.administrators')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('teams:teamPage.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="ps-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1.5">
                                {departments.map((dept) => (
                                    <button
                                        key={dept}
                                        onClick={() => setFilterDept(dept)}
                                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterDept === dept
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {dept === 'all' ? t('teams:teamPage.all') : dept}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((member) => (
                            <div
                                key={member.id}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
                            >
                                {/* Top accent gradient */}
                                <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

                                <div className="p-6">
                                    {/* Member Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="h-14 w-14 border-2 border-border">
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                                        {member.name.split(' ').map((n) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span
                                                    className={`absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[member.status]}`}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{member.name}</h3>
                                                <p className="text-sm text-muted-foreground">{member.department}</p>
                                                <Badge
                                                    variant="outline"
                                                    className={`mt-1 text-[11px] ${roleVariant[member.role] ?? ''}`}
                                                >
                                                    {member.role}
                                                </Badge>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>{t('teams:teamPage.editMember')}</DropdownMenuItem>
                                                <DropdownMenuItem>{t('teams:teamPage.changeRole')}</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">{t('teams:teamPage.remove')}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5" />
                                            <span>{member.phone}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
                                            <p className="text-lg font-bold text-foreground">{member.documentsCount}</p>
                                            <p className="text-[11px] text-muted-foreground">{t('teams:teamPage.documents')}</p>
                                        </div>
                                        <div className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
                                            <p className="text-lg font-bold text-foreground">{member.sharedCount}</p>
                                            <p className="text-[11px] text-muted-foreground">{t('teams:teamPage.shared')}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 flex gap-2">
                                        <Link to={`/${tenant}/documents?owner=${member.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full gap-2 text-sm">
                                                <FileText className="h-4 w-4" />
                                                {t('teams:teamPage.documents')}
                                            </Button>
                                        </Link>
                                        <Link to={`/${tenant}/documents?shared_by=${member.id}`} className="flex-1">
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2 text-sm border-primary/20 text-primary hover:bg-primary/5"
                                            >
                                                <Share2 className="h-4 w-4" />
                                                {t('teams:teamPage.shared')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 bg-card">
                            <Users className="h-12 w-12 text-muted-foreground/40" />
                            <p className="mt-3 text-muted-foreground">{t('teams:teamPage.noTeamMembersFound')}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
