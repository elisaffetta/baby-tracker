
import React from 'react';
import { Download, FileText, Table, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity } from '@/pages/Index';

interface ExportDataProps {
  activities: Activity[];
  isPremium: boolean;
  onUpgrade: () => void;
}

const ExportData: React.FC<ExportDataProps> = ({ activities, isPremium, onUpgrade }) => {
  const exportToPDF = () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    // Заглушка для экспорта в PDF
    alert('Экспорт в PDF будет доступен после подключения backend');
  };

  const exportToExcel = () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    // Простой экспорт в JSON (заглушка для Excel)
    const dataStr = JSON.stringify(activities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `baby_activities_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportForDoctor = () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    // Заглушка для отчета врачу
    alert('Отчет для педиатра будет доступен после подключения backend');
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">Экспорт данных</h3>
        {!isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
      </div>
      
      {!isPremium && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800 mb-2">
            Экспорт данных доступен только в премиум-версии
          </p>
          <Button 
            onClick={onUpgrade}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Получить доступ
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={exportToPDF}
          variant="outline"
          className={`flex items-center justify-between ${!isPremium ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>PDF отчет</span>
          </div>
          {!isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
        </Button>
        
        <Button
          onClick={exportToExcel}
          variant="outline"
          className={`flex items-center justify-between ${!isPremium ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4" />
            <span>Excel таблица</span>
          </div>
          {!isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
        </Button>
        
        <Button
          onClick={exportForDoctor}
          variant="outline"
          className={`flex items-center justify-between ${!isPremium ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Отчет для врача</span>
          </div>
          {!isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
        </Button>
      </div>
      
      {activities.length === 0 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Начните отслеживание, чтобы экспортировать данные
        </p>
      )}
    </Card>
  );
};

export default ExportData;
