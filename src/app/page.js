'use client';

import { useState } from 'react';
import WelcomeSplash from '@/app/components/WelcomeSplash';
import HealthInputForm from '@/app/components/HealthInputForm';
import HealthDashboard from '@/app/components/HealthDashboard';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [view, setView] = useState('form');
  const [profileData, setProfileData] = useState(null);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <main>
      {showWelcome && <WelcomeSplash onComplete={handleWelcomeComplete} />}
      
      {!showWelcome && (
        <>
          {view === 'form' ? (
            <HealthInputForm 
              onSaveProfile={setProfileData}
              onNavigateToDashboard={() => setView('dashboard')}
            />
          ) : (
            <HealthDashboard profileData={profileData} />
          )}
        </>
      )}
    </main>
  );
}