import { Upload, FolderPlus, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/ui/button';
import SearchInput from '@/shared/components/ui/SearchInput';
import crescentImage from '@/assets/ramadan_crescent_transparent.png';
import patternImage from '@/assets/ramadan_pattern_transparent.png';

interface Props {
  greeting: string;
  firstName: string;
  logo: string;
  tenant: string;
}

<<<<<<< Updated upstream
export default function HeroSection({ greeting, firstName, logo, tenant }: Props) {
=======
export default function HeroSection({ greeting, firstName, tenant }: Props) {
  const { t } = useTranslation(['home', 'common']);
>>>>>>> Stashed changes
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 px-8 py-10 text-primary-foreground z-10">
      {/* Decorative circles */}
      <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-white/5" />

      {/* Ramadan Islamic Pattern Overlay - Inside Card Only */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `url('${patternImage}')`,
          backgroundSize: '520px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
          mixBlendMode: 'soft-light',
        }}
      />

      

      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain drop-shadow-lg" />
          <h2 className="text-3xl font-bold tracking-tight">Bisco Misr</h2>
        </div>

        <div>
<<<<<<< Updated upstream
          <h1 className="text-2xl md:text-3xl font-bold">
            {greeting}, {firstName} 🌙
          </h1>
          <p className="mt-1 text-primary-foreground/80">
            Welcome back. Your document management system is ready to help you organize, review, and manage your files efficiently.          </p>
          <p className="mt-1 text-sm text-primary-foreground/60">
            Marketing Department · 24 Documents · 3 Pending
=======
          <h1 className="text-2xl md:text-3xl font-bold text-accent-foreground">
            {t('home:heroSection.greeting', { greeting, firstName })}
          </h1>
          <p className="mt-1 text-accent-foreground/80">
            {t('home:heroSection.description')}          </p>
          <p className="mt-1 text-sm  text-accent-foreground/60">
            {t('home:heroSection.meta')}
>>>>>>> Stashed changes
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/${tenant}/documents`}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold rounded-full px-6 gap-2">
              <Upload className="h-4 w-4" /> {t('common:actions.uploadDocument')}
            </Button>
          </Link>
          {/* <Button variant="outline" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 rounded-full px-6 gap-2">
            <FolderPlus className="h-4 w-4" /> Create Folder
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20 rounded-full px-6 gap-2">
            <FileText className="h-4 w-4" /> New Template
          </Button> */}
        </div>
      </div>
    </section>
  );
}
