
import React from 'react';
import { Crown, Calendar, Bell, Cloud, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PremiumFeaturesProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ isPremium, onUpgrade }) => {
  const features = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Неограниченная история',
      description: 'Сохраняйте данные за весь период роста малыша',
      premium: true
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Расширенная аналитика',
      description: 'Детальные графики и сравнение с нормами',
      premium: true
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Умные напоминания',
      description: 'Персональные уведомления о режиме',
      premium: true
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      title: 'Облачное хранение',
      description: 'Синхронизация между устройствами',
      premium: true
    }
  ];

  return (
    <div className="space-y-4">
      {features.map((feature, index) => (
        <Card key={index} className={`p-4 ${!isPremium ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isPremium ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
            {!isPremium && feature.premium && (
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  Получить
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PremiumFeatures;
