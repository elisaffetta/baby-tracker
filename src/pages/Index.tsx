import React, { useState, useEffect } from 'react';
import { Moon, Baby, BarChart3, User, Clock, Milk, Crown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Timer from '@/components/Timer';
import ActivityTimeline from '@/components/ActivityTimeline';
import StatsChart from '@/components/StatsChart';
import PremiumAITips from '@/components/PremiumAITips';
import PricingModal from '@/components/PricingModal';
import ExportData from '@/components/ExportData';
import PremiumFeatures from '@/components/PremiumFeatures';

export interface Activity {
  id: string;
  type: 'sleep' | 'feeding';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  notes?: string;
}

export interface BabyProfile {
  name: string;
  ageMonths: number;
  birthDate: string;
}

const Index = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeSleep, setActiveSleep] = useState<Activity | null>(null);
  const [activeFeeding, setActiveFeeding] = useState<Activity | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [babyProfile, setBabyProfile] = useState<BabyProfile>({
    name: '',
    ageMonths: 0,
    birthDate: ''
  });
  const [isPremium, setIsPremium] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [freeTrialDays, setFreeTrialDays] = useState(3);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('babyActivities');
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities);
      const withDates = parsed.map((activity: any) => ({
        ...activity,
        startTime: new Date(activity.startTime),
        endTime: activity.endTime ? new Date(activity.endTime) : undefined
      }));
      setActivities(withDates);
    }

    // Load baby profile
    const savedProfile = localStorage.getItem('babyProfile');
    if (savedProfile) {
      setBabyProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('babyActivities', JSON.stringify(activities));
  }, [activities]);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('babyProfile', JSON.stringify(babyProfile));
  }, [babyProfile]);

  // Проверка ограничений бесплатной версии
  const canAddActivity = () => {
    if (isPremium) return true;
    
    const today = new Date();
    const trialStartDate = new Date(today);
    trialStartDate.setDate(trialStartDate.getDate() - freeTrialDays);
    
    const activitiesInTrial = activities.filter(activity => 
      activity.startTime >= trialStartDate
    );
    
    return activitiesInTrial.length < 10; // Лимит на бесплатной версии
  };

  const startActivity = (type: 'sleep' | 'feeding') => {
    if (!canAddActivity()) {
      setShowPricing(true);
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      startTime: new Date()
    };

    if (type === 'sleep') {
      setActiveSleep(newActivity);
    } else {
      setActiveFeeding(newActivity);
    }
  };

  const stopActivity = (type: 'sleep' | 'feeding') => {
    const activeActivity = type === 'sleep' ? activeSleep : activeFeeding;
    if (!activeActivity) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeActivity.startTime.getTime()) / 1000);
    
    const completedActivity: Activity = {
      ...activeActivity,
      endTime,
      duration
    };

    setActivities(prev => [completedActivity, ...prev]);
    
    if (type === 'sleep') {
      setActiveSleep(null);
    } else {
      setActiveFeeding(null);
    }
  };

  const handleUpgrade = (plan: string) => {
    // Заглушка для системы оплаты
    alert(`Выбран план: ${plan}. Система оплаты будет добавлена после подключения backend.`);
    setShowPricing(false);
    // Временно делаем премиум для демонстрации
    setIsPremium(true);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Профиль сохранен!');
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ru-RU', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Фильтрация активностей для бесплатной версии
  const getDisplayActivities = () => {
    if (isPremium) return activities;
    
    const today = new Date();
    const limitDate = new Date(today);
    limitDate.setDate(limitDate.getDate() - freeTrialDays);
    
    return activities.filter(activity => activity.startTime >= limitDate);
  };

  const displayActivities = getDisplayActivities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header with premium indicator */}
        <div className="text-center mb-8">
          <div className="text-3xl font-light text-gray-800 mb-1">{formatTime()}</div>
          <div className="text-sm text-gray-600">{formatDate()}</div>
          <div className="flex justify-center mt-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center animate-pulse">
              <Baby className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          {babyProfile.name && (
            <div className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-2">
              {babyProfile.name} • {babyProfile.ageMonths} мес.
              {isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
            </div>
          )}
          {!isPremium && (
            <div className="mt-2">
              <Button
                onClick={() => setShowPricing(true)}
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
              >
                <Crown className="w-4 h-4 mr-1" />
                Получить премиум
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="home" className="data-[state=active]:bg-white">
              <Clock className="w-4 h-4 mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-white">
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white">
              <User className="w-4 h-4 mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Free trial warning */}
            {!isPremium && (
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                <div className="text-center">
                  <Crown className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-800 mb-2">
                    Бесплатная версия: осталось {Math.max(0, 10 - displayActivities.length)} записей
                  </p>
                  <Button 
                    onClick={() => setShowPricing(true)}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Снять ограничения
                  </Button>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Card className={`p-6 transition-all duration-300 ${
                activeSleep 
                  ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-purple-200 shadow-lg scale-105' 
                  : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md'
              }`}>
                <div className="text-center">
                  <Moon className={`w-8 h-8 mx-auto mb-3 ${
                    activeSleep ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                  <h3 className="font-semibold text-gray-800 mb-3">Сон</h3>
                  {activeSleep ? (
                    <div className="space-y-3">
                      <Timer startTime={activeSleep.startTime} />
                      <Button 
                        onClick={() => stopActivity('sleep')}
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        Остановить сон
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => startActivity('sleep')}
                      variant="outline"
                      className="w-full hover:bg-purple-50 hover:border-purple-200"
                      disabled={!canAddActivity() && !isPremium}
                    >
                      Начать сон
                    </Button>
                  )}
                </div>
              </Card>

              <Card className={`p-6 transition-all duration-300 ${
                activeFeeding 
                  ? 'bg-gradient-to-br from-orange-100 to-pink-100 border-pink-200 shadow-lg scale-105' 
                  : 'bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md'
              }`}>
                <div className="text-center">
                  <Milk className={`w-8 h-8 mx-auto mb-3 ${
                    activeFeeding ? 'text-pink-600' : 'text-gray-600'
                  }`} />
                  <h3 className="font-semibold text-gray-800 mb-3">Кормление</h3>
                  {activeFeeding ? (
                    <div className="space-y-3">
                      <Timer startTime={activeFeeding.startTime} />
                      <Button 
                        onClick={() => stopActivity('feeding')}
                        className="w-full bg-pink-500 hover:bg-pink-600"
                      >
                        Остановить кормление
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => startActivity('feeding')}
                      variant="outline"
                      className="w-full hover:bg-pink-50 hover:border-pink-200"
                      disabled={!canAddActivity() && !isPremium}
                    >
                      Начать кормление
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Recent Activities */}
            <ActivityTimeline activities={displayActivities.slice(0, 5)} />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <StatsChart activities={displayActivities} />
            <PremiumAITips 
              activities={displayActivities} 
              isPremium={isPremium}
              onUpgrade={() => setShowPricing(true)}
            />
            <PremiumFeatures 
              isPremium={isPremium}
              onUpgrade={() => setShowPricing(true)}
            />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <ExportData 
              activities={displayActivities}
              isPremium={isPremium}
              onUpgrade={() => setShowPricing(true)}
            />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Baby className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Профиль малыша</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя малыша</label>
                    <input 
                      type="text" 
                      value={babyProfile.name}
                      onChange={(e) => setBabyProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Введите имя малыша"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Возраст (месяцы)</label>
                    <input 
                      type="number" 
                      value={babyProfile.ageMonths || ''}
                      onChange={(e) => setBabyProfile(prev => ({ ...prev, ageMonths: parseInt(e.target.value) || 0 }))}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      max="36"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                    <input 
                      type="date" 
                      value={babyProfile.birthDate}
                      onChange={(e) => setBabyProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Сохранить профиль
                  </Button>
                </form>

                {isPremium && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Премиум аккаунт</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      У вас есть доступ ко всем функциям приложения
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pricing Modal */}
        <PricingModal 
          isOpen={showPricing}
          onClose={() => setShowPricing(false)}
          onUpgrade={handleUpgrade}
        />
      </div>
    </div>
  );
};

export default Index;
