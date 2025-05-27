
import React from 'react';
import { Brain, Sparkles, Crown, TrendingUp, Heart, Target, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from '@/pages/Index';

interface PremiumAITipsProps {
  activities: Activity[];
  isPremium: boolean;
  onUpgrade: () => void;
}

const PremiumAITips: React.FC<PremiumAITipsProps> = ({ activities, isPremium, onUpgrade }) => {
  const generateBasicTips = () => {
    // Базовые советы (как в оригинальном компоненте)
    const tips = [];
    
    if (activities.length === 0) {
      tips.push({
        icon: <Brain className="w-5 h-5" />,
        title: "Начните отслеживание",
        content: "Записывайте сон и кормления для получения персональных советов",
        color: "from-blue-100 to-indigo-100",
        iconColor: "text-blue-600"
      });
    } else {
      tips.push({
        icon: <Heart className="w-5 h-5" />,
        title: "Отличная работа!",
        content: "Вы ведете записи активности малыша. Это поможет выстроить здоровый режим.",
        color: "from-pink-100 to-purple-100",
        iconColor: "text-pink-600"
      });
    }

    return tips;
  };

  const generatePremiumTips = () => {
    if (!isPremium) return [];

    const tips = [];
    const sleepActivities = activities.filter(a => a.type === 'sleep' && a.duration);
    const feedingActivities = activities.filter(a => a.type === 'feeding' && a.duration);

    // Расширенный анализ сна
    if (sleepActivities.length >= 3) {
      const sleepTimes = sleepActivities.slice(0, 7).map(a => ({
        hour: a.startTime.getHours(),
        duration: a.duration || 0
      }));
      
      const nightSleeps = sleepTimes.filter(s => s.hour >= 19 || s.hour <= 6);
      const avgNightSleep = nightSleeps.reduce((sum, s) => sum + s.duration, 0) / nightSleeps.length / 3600;

      tips.push({
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Анализ качества сна",
        content: `Средний ночной сон: ${avgNightSleep.toFixed(1)}ч. ${avgNightSleep > 3 ? 'Отличный показатель!' : 'Рекомендуется увеличить продолжительность ночного сна.'}`,
        color: "from-purple-100 to-blue-100",
        iconColor: "text-purple-600"
      });
    }

    // Анализ режима кормления
    if (feedingActivities.length >= 5) {
      const feedingIntervals = [];
      for (let i = 1; i < feedingActivities.length; i++) {
        const interval = (feedingActivities[i-1].startTime.getTime() - feedingActivities[i].startTime.getTime()) / (1000 * 60 * 60);
        feedingIntervals.push(Math.abs(interval));
      }
      
      const avgInterval = feedingIntervals.reduce((sum, interval) => sum + interval, 0) / feedingIntervals.length;
      
      tips.push({
        icon: <Target className="w-5 h-5" />,
        title: "Режим кормления",
        content: `Интервал между кормлениями: ${avgInterval.toFixed(1)}ч. ${avgInterval > 2 && avgInterval < 4 ? 'Стабильный режим!' : 'Попробуйте выстроить более регулярный график.'}`,
        color: "from-orange-100 to-pink-100",
        iconColor: "text-orange-600"
      });
    }

    // Прогноз следующего кормления
    if (feedingActivities.length > 0) {
      const lastFeeding = feedingActivities[0];
      const avgInterval = 3; // Примерный интервал
      const nextFeeding = new Date(lastFeeding.startTime.getTime() + avgInterval * 60 * 60 * 1000);
      
      tips.push({
        icon: <Zap className="w-5 h-5" />,
        title: "Прогноз",
        content: `Следующее кормление ожидается около ${nextFeeding.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`,
        color: "from-emerald-100 to-teal-100",
        iconColor: "text-emerald-600"
      });
    }

    return tips;
  };

  const basicTips = generateBasicTips();
  const premiumTips = isPremium ? generatePremiumTips() : [];
  const allTips = [...basicTips, ...premiumTips];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">ИИ-Анализ</h3>
        {isPremium && <Sparkles className="w-4 h-4 text-yellow-500" />}
      </div>

      <div className="space-y-4">
        {allTips.map((tip, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg bg-gradient-to-r ${tip.color} border border-white/50`}
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-0.5 ${tip.iconColor}`}>
                {tip.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{tip.content}</p>
              </div>
            </div>
          </div>
        ))}

        {!isPremium && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">Расширенный ИИ-анализ</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Получайте детальные прогнозы, анализ качества сна и персональные рекомендации
                </p>
                <Button 
                  onClick={onUpgrade}
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Получить премиум
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PremiumAITips;
