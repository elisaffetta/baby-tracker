
import React from 'react';
import { Brain, Lightbulb, Heart, Zap, Moon, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Activity } from '@/pages/Index';

interface AITipsProps {
  activities: Activity[];
}

const AITips: React.FC<AITipsProps> = ({ activities }) => {
  const generateTips = () => {
    const sleepActivities = activities.filter(a => a.type === 'sleep' && a.duration);
    const feedingActivities = activities.filter(a => a.type === 'feeding' && a.duration);
    
    const tips = [];

    // Sleep analysis
    if (sleepActivities.length > 0) {
      const avgSleepDuration = sleepActivities.reduce((sum, a) => sum + (a.duration || 0), 0) / sleepActivities.length;
      const avgSleepHours = avgSleepDuration / 3600;

      if (avgSleepHours < 2) {
        tips.push({
          icon: <Brain className="w-5 h-5" />,
          title: "Анализ сна",
          content: "Периоды сна короче среднего. Попробуйте создать более спокойную обстановку: приглушите свет и включите тихую музыку.",
          color: "from-blue-100 to-purple-100",
          iconColor: "text-purple-600"
        });
      } else if (avgSleepHours > 4) {
        tips.push({
          icon: <Heart className="w-5 h-5" />,
          title: "Отличный режим сна!",
          content: "Ваш малыш прекрасно спит! Поддерживайте этот режим для оптимального отдыха и развития.",
          color: "from-green-100 to-blue-100",
          iconColor: "text-green-600"
        });
      }

      // Sleep pattern analysis
      if (sleepActivities.length >= 3) {
        const sleepTimes = sleepActivities.map(a => a.startTime.getHours());
        const avgSleepTime = sleepTimes.reduce((sum, time) => sum + time, 0) / sleepTimes.length;
        
        if (avgSleepTime > 22 || avgSleepTime < 6) {
          tips.push({
            icon: <Moon className="w-5 h-5" />,
            title: "Ночной режим",
            content: "Малыш хорошо адаптировался к ночному режиму. Это способствует здоровому циклу сна-бодрствования.",
            color: "from-indigo-100 to-purple-100",
            iconColor: "text-indigo-600"
          });
        }
      }
    }

    // Feeding analysis
    if (feedingActivities.length > 0) {
      const avgFeedingDuration = feedingActivities.reduce((sum, a) => sum + (a.duration || 0), 0) / feedingActivities.length;
      const avgFeedingMinutes = avgFeedingDuration / 60;

      if (avgFeedingMinutes < 15) {
        tips.push({
          icon: <Lightbulb className="w-5 h-5" />,
          title: "Эффективное кормление",
          content: "Короткие периоды кормления могут указывать на хорошую лактацию. Продолжайте следить за весом малыша.",
          color: "from-orange-100 to-pink-100",
          iconColor: "text-orange-600"
        });
      } else if (avgFeedingMinutes > 30) {
        tips.push({
          icon: <Clock className="w-5 h-5" />,
          title: "Неторопливое кормление",
          content: "Длительные кормления могут быть признаком спокойного темперамента или потребности в близости с мамой.",
          color: "from-pink-100 to-rose-100",
          iconColor: "text-pink-600"
        });
      }

      // Feeding frequency analysis
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayFeedings = feedingActivities.filter(a => a.startTime >= today);
      
      if (todayFeedings.length >= 8) {
        tips.push({
          icon: <TrendingUp className="w-5 h-5" />,
          title: "Активный день кормления",
          content: "Сегодня много кормлений - это нормально для периодов роста. Малыш может переживать скачок развития.",
          color: "from-emerald-100 to-teal-100",
          iconColor: "text-emerald-600"
        });
      }
    }

    // Pattern analysis
    if (activities.length >= 5) {
      const recentActivities = activities.slice(0, 5);
      const hasPattern = recentActivities.every((activity, index, arr) => {
        if (index === 0) return true;
        return activity.type !== arr[index - 1].type;
      });

      if (hasPattern) {
        tips.push({
          icon: <Zap className="w-5 h-5" />,
          title: "Отличный ритм!",
          content: "У вас формируется предсказуемый режим сон-кормление. Это поможет малышу чувствовать себя увереннее.",
          color: "from-violet-100 to-purple-100",
          iconColor: "text-violet-600"
        });
      }
    }

    // Time-based insights
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 22 || currentHour <= 5) {
      tips.push({
        icon: <AlertCircle className="w-5 h-5" />,
        title: "Ночное время",
        content: "Сейчас время для спокойных активностей. Приглушите освещение и говорите тише для лучшего сна.",
        color: "from-slate-100 to-gray-100",
        iconColor: "text-slate-600"
      });
    }

    // General encouragement
    if (activities.length > 10) {
      tips.push({
        icon: <Heart className="w-5 h-5" />,
        title: "Вы справляетесь отлично!",
        content: "Регулярное отслеживание помогает лучше понимать потребности малыша. Вы заботливая мама!",
        color: "from-pink-100 to-purple-100",
        iconColor: "text-pink-600"
      });
    }

    // Default tip if no activities
    if (activities.length === 0) {
      tips.push({
        icon: <Brain className="w-5 h-5" />,
        title: "Добро пожаловать!",
        content: "Начните записывать сон и кормления малыша, чтобы получать персональные рекомендации и анализ.",
        color: "from-blue-100 to-indigo-100",
        iconColor: "text-blue-600"
      });
    }

    return tips.slice(0, 3); // Limit to 3 tips
  };

  const tips = generateTips();

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">ИИ-Анализ</h3>
      </div>
      <div className="space-y-4">
        {tips.map((tip, index) => (
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
      </div>
    </Card>
  );
};

export default AITips;
