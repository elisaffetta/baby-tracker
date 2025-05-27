
import React from 'react';
import { Crown, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const plans = [
    {
      name: 'Базовый',
      price: 'Бесплатно',
      period: '',
      features: [
        { text: '3 дня истории', included: true },
        { text: 'Базовые ИИ-советы', included: true },
        { text: 'Простая статистика', included: true },
        { text: 'Неограниченная история', included: false },
        { text: 'Экспорт отчетов', included: false },
        { text: 'Облачное хранение', included: false },
        { text: 'Уведомления', included: false }
      ],
      buttonText: 'Текущий план',
      disabled: true
    },
    {
      name: 'Премиум',
      price: '299',
      period: '/ мес',
      features: [
        { text: 'Неограниченная история', included: true },
        { text: 'Расширенные ИИ-советы', included: true },
        { text: 'Детальная аналитика', included: true },
        { text: 'Экспорт в PDF/Excel', included: true },
        { text: 'Облачное хранение', included: true },
        { text: 'Push-уведомления', included: true },
        { text: 'Приоритетная поддержка', included: true }
      ],
      buttonText: 'Оформить подписку',
      popular: true
    },
    {
      name: 'Годовая',
      price: '1999',
      period: '/ год',
      discount: 'Скидка 44%',
      features: [
        { text: 'Все функции Премиум', included: true },
        { text: 'Семейный доступ', included: true },
        { text: 'Интеграция с врачами', included: true },
        { text: 'Персональные рекомендации', included: true },
        { text: 'Анализ развития', included: true },
        { text: 'Экспорт для педиатра', included: true },
        { text: 'Приоритетная поддержка', included: true }
      ],
      buttonText: 'Лучшее предложение'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Выберите тарифный план
          </DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan, index) => (
            <Card key={index} className={`p-6 relative ${plan.popular ? 'border-purple-500 border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Популярный
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-purple-600">
                  {plan.price === 'Бесплатно' ? plan.price : `${plan.price} ₽`}
                  {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                </div>
                {plan.discount && (
                  <div className="text-green-600 text-sm font-medium mt-1">{plan.discount}</div>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={feature.included ? 'text-gray-800' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => plan.name !== 'Базовый' && onUpgrade(plan.name)}
                disabled={plan.disabled}
                className={`w-full ${plan.popular ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                variant={plan.disabled ? 'outline' : 'default'}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
