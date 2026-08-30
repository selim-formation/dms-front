import { useTranslation } from 'react-i18next';

export default function ProfileCard() {
  const { t } = useTranslation(['home', 'common']);
  return (
    <div className="relative bg-gradient-to-br from-primary to-primary rounded-2xl overflow-hidden h-48">
      <img
        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
        alt={t('profileCard.profileAlt')}
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
      />
      <div className="relative h-full flex flex-col justify-end p-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground mb-1">Sarah Chan</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
