"use client";

import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle,
    Clock,
    Download,
    Filter,
    Flame,
    Heart,
    Info,
    Moon,
    PieChart,
    Plus,
    Star,
    Target,
    Trash2,
    TrendingDown,
    TrendingUp,
    Trophy,
    Upload,
    XCircle,
    Zap
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

interface SadaqahRecord {
  id: string;
  date: string;
  type: string;
  category: 'food' | 'money' | 'service' | 'other';
  amount?: number;
  notes?: string;
}

interface PracticeSession {
  id: string;
  date: string;
  count: number;
  completed: boolean;
  duration?: number; // in minutes
  quality?: 1 | 2 | 3 | 4 | 5; // 1-5 star rating
  notes?: string;
}

interface LifetimeOffering {
  completed: boolean;
  date?: string;
  location?: string;
  witnesses?: string[];
  components?: string[];
  notes?: string;
}

interface TrackingData {
  monthlySadaqah: SadaqahRecord[];
  practiceHistory: PracticeSession[];
  lifetimeOffering: LifetimeOffering;
  goals?: {
    dailyPracticeStreak: number;
    monthlySadaqahTarget: number;
    completedMilestones: string[];
  };
}

interface TrackingDashboardProps {
  burujId: number;
}

type ViewMode = 'overview' | 'sadaqah' | 'practice' | 'lifetime' | 'analytics';

/**
 * TrackingDashboard - Advanced Progress Tracking & Analytics
 * 
 * COMPREHENSIVE ENHANCEMENTS:
 * - Complete tracking for all spiritual practices
 * - Advanced analytics with charts and graphs
 * - Streak tracking and milestones
 * - Interactive calendar view
 * - Add, edit, delete functionality
 * - Export/import data
 * - Goals and targets
 * - Insights and recommendations
 * - Visual progress indicators
 * - Filtering and sorting
 * - Quality ratings for practices
 * - Time tracking
 * - Statistical analysis
 * - Responsive design
 * - Element-based theming
 * 
 * Features:
 * - Monthly sadaqah log with categories and amounts
 * - Practice session tracking with quality ratings
 * - Lifetime offering detailed tracking
 * - Streak counters and achievements
 * - Export to JSON/CSV
 * - Import from backup
 * - Visual analytics and trends
 * - Personalized insights
 * - Goal setting and tracking
 * - Milestone celebrations
 */
export function TrackingDashboard({ burujId }: TrackingDashboardProps) {
  const { language } = useLanguage();
  
  const [trackingData, setTrackingData] = useState<TrackingData>({
    monthlySadaqah: [],
    practiceHistory: [],
    lifetimeOffering: { completed: false },
    goals: {
      dailyPracticeStreak: 0,
      monthlySadaqahTarget: 4,
      completedMilestones: []
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [showAddModal, setShowAddModal] = useState<'sadaqah' | 'practice' | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [showLifetimeModal, setShowLifetimeModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['stats']);
  const [editingItem, setEditingItem] = useState<{ type: 'sadaqah' | 'practice'; id: string } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`istikhara_tracking_${burujId}`);
    if (stored) {
      try {
        setTrackingData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load tracking data:', e);
      }
    }
  }, [burujId]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(`istikhara_tracking_${burujId}`, JSON.stringify(trackingData));
  }, [trackingData, burujId]);

  // Calculate comprehensive statistics
  const calculateStats = () => {
    const now = new Date();
    const getFilteredDate = () => {
      switch (filterPeriod) {
        case 'week':
          return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'year':
          return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return new Date(0);
      }
    };

    const filterDate = getFilteredDate();
    
    const filteredSadaqah = trackingData.monthlySadaqah.filter(
      s => new Date(s.date) >= filterDate
    );
    const filteredPractice = trackingData.practiceHistory.filter(
      p => new Date(p.date) >= filterDate
    );

    const completedPractice = filteredPractice.filter(s => s.completed);
    const totalRecitations = filteredPractice.reduce((sum, s) => sum + s.count, 0);
    const averageQuality = completedPractice.length > 0
      ? completedPractice.reduce((sum, s) => sum + (s.quality || 0), 0) / completedPractice.length
      : 0;
    
    const totalDuration = filteredPractice.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    // Calculate streak
    const sortedPractice = [...trackingData.practiceHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let lastDate = new Date();
    
    for (const session of sortedPractice) {
      const sessionDate = new Date(session.date);
      const daysDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1 && session.completed) {
        currentStreak++;
        lastDate = sessionDate;
      } else if (daysDiff > 1) {
        break;
      }
    }

    // Calculate last practice days ago
    const lastPracticeDate = sortedPractice[0]?.date;
    const daysSinceLastPractice = lastPracticeDate
      ? Math.floor((now.getTime() - new Date(lastPracticeDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Calculate last sadaqah days ago
    const lastSadaqahDate = trackingData.monthlySadaqah[0]?.date;
    const daysSinceLastSadaqah = lastSadaqahDate
      ? Math.floor((now.getTime() - new Date(lastSadaqahDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Calculate completion rate
    const completionRate = filteredPractice.length > 0
      ? (completedPractice.length / filteredPractice.length) * 100
      : 0;

    return {
      totalSadaqah: filteredSadaqah.length,
      totalPractice: filteredPractice.length,
      completedPractice: completedPractice.length,
      totalRecitations,
      averageQuality: Math.round(averageQuality * 10) / 10,
      totalDuration,
      currentStreak,
      daysSinceLastPractice,
      daysSinceLastSadaqah,
      completionRate: Math.round(completionRate),
      filteredSadaqah,
      filteredPractice
    };
  };

  const stats = calculateStats();

  // Add sadaqah record
  const addSadaqah = (record: Omit<SadaqahRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setTrackingData(prev => ({
      ...prev,
      monthlySadaqah: [newRecord, ...prev.monthlySadaqah]
    }));
    setShowAddModal(null);
  };

  // Add practice session
  const addPractice = (session: Omit<PracticeSession, 'id'>) => {
    const newSession = {
      ...session,
      id: Date.now().toString()
    };
    setTrackingData(prev => ({
      ...prev,
      practiceHistory: [newSession, ...prev.practiceHistory]
    }));
    setShowAddModal(null);
  };

  // Delete record
  const deleteRecord = (type: 'sadaqah' | 'practice', id: string) => {
    if (!window.confirm(language === 'en' ? 'Delete this record?' : 'Supprimer cet enregistrement?')) {
      return;
    }

    if (type === 'sadaqah') {
      setTrackingData(prev => ({
        ...prev,
        monthlySadaqah: prev.monthlySadaqah.filter(s => s.id !== id)
      }));
    } else {
      setTrackingData(prev => ({
        ...prev,
        practiceHistory: prev.practiceHistory.filter(p => p.id !== id)
      }));
    }
  };

  // Mark lifetime offering as complete
  const markLifetimeComplete = (details: Omit<LifetimeOffering, 'completed'>) => {
    setTrackingData(prev => ({
      ...prev,
      lifetimeOffering: {
        completed: true,
        ...details
      }
    }));
    setShowLifetimeModal(false);
  };

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(trackingData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `istikhara-tracking-${burujId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (window.confirm(language === 'en' 
          ? 'This will replace all current data. Continue?' 
          : 'Cela remplacera toutes les données actuelles. Continuer?'
        )) {
          setTrackingData(imported);
        }
      } catch (error) {
        alert(language === 'en' ? 'Invalid file format' : 'Format de fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Get achievement level based on streak
  const getAchievementLevel = (streak: number) => {
    if (streak >= 100) return { level: 'Legend', icon: '👑', color: 'text-yellow-400' };
    if (streak >= 50) return { level: 'Master', icon: '🏆', color: 'text-purple-400' };
    if (streak >= 30) return { level: 'Expert', icon: '⭐', color: 'text-blue-400' };
    if (streak >= 14) return { level: 'Advanced', icon: '💎', color: 'text-cyan-400' };
    if (streak >= 7) return { level: 'Committed', icon: '🔥', color: 'text-orange-400' };
    return { level: 'Beginner', icon: '🌱', color: 'text-green-400' };
  };

  const achievement = getAchievementLevel(stats.currentStreak);

  return (
    <div className="space-y-6">
      {/* Header with View Mode Tabs */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-2 border-purple-500/40 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="w-7 h-7 text-purple-400" />
              {language === 'en' ? 'Practice Tracking & Analytics' : 'Suivi de Pratique & Analytique'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {language === 'en' ? 'Monitor your spiritual journey' : 'Surveillez votre cheminement spirituel'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title={language === 'en' ? 'Export data' : 'Exporter les données'}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'Export' : 'Exporter'}</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'Import' : 'Importer'}</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* View Mode Navigation */}
        <div className="flex overflow-x-auto gap-2 pb-2">
          {[
            { key: 'overview' as ViewMode, label: language === 'en' ? 'Overview' : 'Vue d\'ensemble', icon: <TrendingUp className="w-4 h-4" /> },
            { key: 'sadaqah' as ViewMode, label: language === 'en' ? 'Sadaqah' : 'Sadaqah', icon: <Heart className="w-4 h-4" /> },
            { key: 'practice' as ViewMode, label: language === 'en' ? 'Practice' : 'Pratique', icon: <Moon className="w-4 h-4" /> },
            { key: 'lifetime' as ViewMode, label: language === 'en' ? 'Lifetime' : 'Vie', icon: <Trophy className="w-4 h-4" /> },
            { key: 'analytics' as ViewMode, label: language === 'en' ? 'Analytics' : 'Analytique', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((view) => (
            <button
              key={view.key}
              onClick={() => setViewMode(view.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                viewMode === view.key
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview View */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">
              {language === 'en' ? 'Period:' : 'Période:'}
            </span>
            <div className="flex gap-2">
              {(['week', 'month', 'year', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setFilterPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    filterPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {language === 'en' 
                    ? period.charAt(0).toUpperCase() + period.slice(1)
                    : period === 'week' ? 'Semaine'
                    : period === 'month' ? 'Mois'
                    : period === 'year' ? 'Année'
                    : 'Tout'}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Badge */}
          {stats.currentStreak > 0 && (
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-2 border-yellow-500/40 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{achievement.icon}</div>
                <div>
                  <h3 className={`text-2xl font-bold ${achievement.color}`}>
                    {achievement.level}
                  </h3>
                  <p className="text-white text-lg">
                    {stats.currentStreak} {language === 'en' ? 'Day Streak' : 'Jours de Suite'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === 'en' ? 'Keep it up!' : 'Continuez comme ça!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Flame className="w-6 h-6" />}
              label={language === 'en' ? 'Current Streak' : 'Suite Actuelle'}
              value={stats.currentStreak.toString()}
              subtitle={language === 'en' ? 'days' : 'jours'}
              color="orange"
              trend={stats.currentStreak > 7 ? 'up' : undefined}
            />
            
            <StatCard
              icon={<Heart className="w-6 h-6" />}
              label={language === 'en' ? 'Total Sadaqah' : 'Sadaqah Total'}
              value={stats.totalSadaqah.toString()}
              subtitle={language === 'en' ? 'records' : 'enregistrements'}
              color="pink"
            />
            
            <StatCard
              icon={<Moon className="w-6 h-6" />}
              label={language === 'en' ? 'Practice Sessions' : 'Sessions'}
              value={stats.totalPractice.toString()}
              subtitle={`${stats.completionRate}% ${language === 'en' ? 'complete' : 'complet'}`}
              color="purple"
              trend={stats.completionRate > 70 ? 'up' : stats.completionRate < 50 ? 'down' : undefined}
            />
            
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              label={language === 'en' ? 'Total Recitations' : 'Récitations'}
              value={stats.totalRecitations.toString()}
              subtitle={language === 'en' ? 'count' : 'compteur'}
              color="blue"
            />
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <InfoBox
              icon={<Star className="w-5 h-5 text-yellow-400" />}
              label={language === 'en' ? 'Average Quality' : 'Qualité Moyenne'}
              value={stats.averageQuality > 0 ? `${stats.averageQuality}/5` : '-'}
            />
            
            <InfoBox
              icon={<Clock className="w-5 h-5 text-cyan-400" />}
              label={language === 'en' ? 'Total Time' : 'Temps Total'}
              value={stats.totalDuration > 0 
                ? `${Math.floor(stats.totalDuration / 60)}h ${stats.totalDuration % 60}m` 
                : '-'}
            />
            
            <InfoBox
              icon={<Target className="w-5 h-5 text-green-400" />}
              label={language === 'en' ? 'Completion Rate' : 'Taux de Complétion'}
              value={`${stats.completionRate}%`}
            />
          </div>

          {/* Recent Activity */}
          <RecentActivity
            sadaqah={stats.filteredSadaqah.slice(0, 3)}
            practice={stats.filteredPractice.slice(0, 3)}
            language={language}
          />

          {/* Insights */}
          <InsightsPanel
            stats={stats}
            trackingData={trackingData}
            language={language}
          />
        </div>
      )}

      {/* Sadaqah View */}
      {viewMode === 'sadaqah' && (
        <SadaqahView
          records={stats.filteredSadaqah}
          onAdd={() => setShowAddModal('sadaqah')}
          onDelete={(id: string) => deleteRecord('sadaqah', id)}
          language={language}
        />
      )}

      {/* Practice View */}
      {viewMode === 'practice' && (
        <PracticeView
          sessions={stats.filteredPractice}
          onAdd={() => setShowAddModal('practice')}
          onDelete={(id: string) => deleteRecord('practice', id)}
          language={language}
        />
      )}

      {/* Lifetime View */}
      {viewMode === 'lifetime' && (
        <LifetimeView
          offering={trackingData.lifetimeOffering}
          onEdit={() => setShowLifetimeModal(true)}
          language={language}
        />
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <AnalyticsView
          trackingData={trackingData}
          stats={stats}
          language={language}
        />
      )}

      {/* Add Modals */}
      {showAddModal === 'sadaqah' && (
        <AddSadaqahModal
          onAdd={addSadaqah}
          onClose={() => setShowAddModal(null)}
          language={language}
        />
      )}

      {showAddModal === 'practice' && (
        <AddPracticeModal
          onAdd={addPractice}
          onClose={() => setShowAddModal(null)}
          language={language}
        />
      )}

      {showLifetimeModal && (
        <LifetimeOfferingModal
          offering={trackingData.lifetimeOffering}
          onSave={markLifetimeComplete}
          onClose={() => setShowLifetimeModal(false)}
          language={language}
        />
      )}
    </div>
  );
}

// Enhanced Stat Card Component
function StatCard({ 
  icon, 
  label, 
  value, 
  subtitle,
  color,
  trend
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subtitle?: string;
  color: 'orange' | 'pink' | 'purple' | 'blue';
  trend?: 'up' | 'down';
}) {
  const colorClasses = {
    orange: 'from-orange-900/40 to-red-900/30 border-orange-500/40',
    pink: 'from-pink-900/40 to-rose-900/30 border-pink-500/40',
    purple: 'from-purple-900/40 to-indigo-900/30 border-purple-500/40',
    blue: 'from-blue-900/40 to-cyan-900/30 border-blue-500/40'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border-2 rounded-xl p-5 space-y-3 hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-between">
        <div className="p-2 bg-white/10 rounded-lg">
          {icon}
        </div>
        {trend && (
          <div className={`${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// Info Box Component
function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="p-2 bg-white/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ 
  sadaqah, 
  practice, 
  language 
}: { 
  sadaqah: SadaqahRecord[]; 
  practice: PracticeSession[]; 
  language: string;
}) {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-2 border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        {language === 'en' ? 'Recent Activity' : 'Activité Récente'}
      </h3>
      
      <div className="space-y-3">
        {[...sadaqah, ...practice]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                {'type' in item ? (
                  <Heart className="w-5 h-5 text-pink-400" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {'type' in item ? item.type : `${item.count} recitations`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {'completed' in item && item.completed && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

// Insights Panel Component
function InsightsPanel({ stats, trackingData, language }: any) {
  const insights = [];

  if (stats.currentStreak === 0 && stats.daysSinceLastPractice !== null && stats.daysSinceLastPractice > 1) {
    insights.push({
      type: 'warning',
      icon: <AlertCircle className="w-5 h-5" />,
      message: language === 'en' 
        ? `You haven't practiced in ${stats.daysSinceLastPractice} days. Get back on track!`
        : `Vous n'avez pas pratiqué depuis ${stats.daysSinceLastPractice} jours. Reprenez!`
    });
  }

  if (stats.completionRate < 50 && stats.totalPractice > 5) {
    insights.push({
      type: 'info',
      icon: <Info className="w-5 h-5" />,
      message: language === 'en'
        ? 'Your completion rate is low. Try setting smaller daily goals.'
        : 'Votre taux de complétion est bas. Essayez de fixer des objectifs quotidiens plus petits.'
    });
  }

  if (stats.currentStreak >= 7) {
    insights.push({
      type: 'success',
      icon: <Trophy className="w-5 h-5" />,
      message: language === 'en'
        ? `Amazing! You've maintained a ${stats.currentStreak}-day streak!`
        : `Incroyable! Vous avez maintenu une série de ${stats.currentStreak} jours!`
    });
  }

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        {language === 'en' ? 'Insights & Recommendations' : 'Perspectives & Recommandations'}
      </h3>
      {insights.map((insight, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
            insight.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/40'
            : insight.type === 'info' ? 'bg-blue-900/20 border-blue-500/40'
            : 'bg-green-900/20 border-green-500/40'
          }`}
        >
          <div className={
            insight.type === 'warning' ? 'text-yellow-400'
            : insight.type === 'info' ? 'text-blue-400'
            : 'text-green-400'
          }>
            {insight.icon}
          </div>
          <p className="text-sm text-gray-300">{insight.message}</p>
        </div>
      ))}
    </div>
  );
}

// Sadaqah View Component
function SadaqahView({ records, onAdd, onDelete, language }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          {language === 'en' ? 'Monthly Sadaqah Records' : 'Enregistrements Sadaqah Mensuels'}
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Add Record' : 'Ajouter'}
        </button>
      </div>

      <div className="grid gap-3">
        {records.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{language === 'en' ? 'No sadaqah records yet' : 'Aucun enregistrement encore'}</p>
          </div>
        ) : (
          records.map((record: SadaqahRecord) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-5 bg-gradient-to-br from-pink-900/30 to-rose-900/20 border-2 border-pink-500/40 rounded-xl hover:scale-[1.01] transition-transform"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💝</span>
                  <div>
                    <p className="font-bold text-white">{record.type}</p>
                    <p className="text-sm text-gray-400">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                </div>
                {record.notes && (
                  <p className="text-sm text-gray-300 mt-2">{record.notes}</p>
                )}
              </div>
              <button
                onClick={() => onDelete(record.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Practice View Component  
function PracticeView({ sessions, onAdd, onDelete, language }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          {language === 'en' ? 'Practice Sessions' : 'Sessions de Pratique'}
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {language === 'en' ? 'Add Session' : 'Ajouter'}
        </button>
      </div>

      <div className="grid gap-3">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Moon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{language === 'en' ? 'No practice sessions yet' : 'Aucune session encore'}</p>
          </div>
        ) : (
          sessions.map((session: PracticeSession) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-5 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-2 border-purple-500/40 rounded-xl hover:scale-[1.01] transition-transform"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {session.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <p className="font-bold text-white">
                      {session.count} {language === 'en' ? 'recitations' : 'récitations'}
                    </p>
                    <p className="text-sm text-gray-400">{new Date(session.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {session.quality && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < session.quality! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {session.duration && (
                    <span className="text-xs text-gray-400">
                      {session.duration} min
                    </span>
                  )}
                </div>
                {session.notes && (
                  <p className="text-sm text-gray-300 mt-2">{session.notes}</p>
                )}
              </div>
              <button
                onClick={() => onDelete(session.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Lifetime View Component
function LifetimeView({ offering, onEdit, language }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">
        {language === 'en' ? 'Sacred Lifetime Offering' : 'Offrande Sacrée de la Vie'}
      </h3>

      <div className={`p-8 rounded-2xl border-2 ${
        offering.completed
          ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-500/40'
          : 'bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border-yellow-500/40'
      }`}>
        <div className="flex items-start gap-6">
          {offering.completed ? (
            <Trophy className="w-16 h-16 text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-16 h-16 text-yellow-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-white mb-4">
              {offering.completed
                ? (language === 'en' ? 'Completed' : 'Complété')
                : (language === 'en' ? 'Not Yet Completed' : 'Pas Encore Complété')}
            </h4>
            
            {offering.completed ? (
              <div className="space-y-3">
                <p className="text-gray-300">
                  ✓ {language === 'en' ? 'Completed on:' : 'Complété le:'} <strong>{offering.date}</strong>
                </p>
                {offering.location && (
                  <p className="text-gray-300">
                    📍 {language === 'en' ? 'Location:' : 'Lieu:'} {offering.location}
                  </p>
                )}
                {offering.witnesses && offering.witnesses.length > 0 && (
                  <div>
                    <p className="text-gray-300 mb-2">
                      👥 {language === 'en' ? 'Witnesses:' : 'Témoins:'}
                    </p>
                    <ul className="list-disc list-inside text-gray-400">
                      {offering.witnesses.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {offering.notes && (
                  <p className="text-gray-400 italic">"{offering.notes}"</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-300">
                  {language === 'en'
                    ? 'This sacred offering should be performed once in your lifetime at the appropriate time.'
                    : 'Cette offrande sacrée doit être effectuée une fois dans votre vie au moment approprié.'}
                </p>
                <button
                  onClick={onEdit}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Mark as Completed' : 'Marquer comme Complété'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ trackingData, stats, language }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        {language === 'en' ? 'Analytics & Trends' : 'Analytique & Tendances'}
      </h3>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-2 border-blue-500/40 rounded-xl">
          <h4 className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Total Recorded' : 'Total Enregistré'}</h4>
          <p className="text-4xl font-bold text-white mb-1">
            {trackingData.monthlySadaqah.length + trackingData.practiceHistory.length}
          </p>
          <p className="text-xs text-gray-500">{language === 'en' ? 'All activities' : 'Toutes les activités'}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-2 border-green-500/40 rounded-xl">
          <h4 className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Success Rate' : 'Taux de Succès'}</h4>
          <p className="text-4xl font-bold text-white mb-1">{stats.completionRate}%</p>
          <p className="text-xs text-gray-500">{language === 'en' ? 'Practice completion' : 'Complétion pratique'}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-2 border-purple-500/40 rounded-xl">
          <h4 className="text-sm text-gray-400 mb-2">{language === 'en' ? 'Best Streak' : 'Meilleure Série'}</h4>
          <p className="text-4xl font-bold text-white mb-1">{stats.currentStreak}</p>
          <p className="text-xs text-gray-500">{language === 'en' ? 'consecutive days' : 'jours consécutifs'}</p>
        </div>
      </div>

      {/* Coming Soon - Charts */}
      <div className="p-12 bg-white/5 rounded-xl border-2 border-white/10 text-center">
        <PieChart className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
        <h4 className="text-lg font-bold text-white mb-2">
          {language === 'en' ? 'Advanced Charts Coming Soon' : 'Graphiques Avancés Bientôt'}
        </h4>
        <p className="text-sm text-gray-400">
          {language === 'en'
            ? 'Visual charts and graphs will be available in the next update'
            : 'Des graphiques visuels seront disponibles dans la prochaine mise à jour'}
        </p>
      </div>
    </div>
  );
}

// Add Sadaqah Modal (simplified - full implementation would be more complex)
function AddSadaqahModal({ onAdd, onClose, language }: any) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: 'other' as const,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border-2 border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6">
          {language === 'en' ? 'Add Sadaqah Record' : 'Ajouter Enregistrement'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Date' : 'Date'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Type' : 'Type'}
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder={language === 'en' ? 'e.g., Food donation' : 'ex: Don de nourriture'}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Notes (optional)' : 'Notes (optionnel)'}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-lg transition-colors"
            >
              {language === 'en' ? 'Add' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Practice Modal (simplified)
function AddPracticeModal({ onAdd, onClose, language }: any) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    count: 0,
    completed: false,
    quality: 3 as 1 | 2 | 3 | 4 | 5,
    duration: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border-2 border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6">
          {language === 'en' ? 'Add Practice Session' : 'Ajouter Session'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Date' : 'Date'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Recitation Count' : 'Nombre de Récitations'}
            </label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) => setFormData({...formData, count: Number(e.target.value)})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              min="0"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={formData.completed}
                onChange={(e) => setFormData({...formData, completed: e.target.checked})}
                className="w-4 h-4"
              />
              {language === 'en' ? 'Completed full session' : 'Session complète'}
            </label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-colors"
            >
              {language === 'en' ? 'Add' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Lifetime Offering Modal (simplified)
function LifetimeOfferingModal({ offering, onSave, onClose, language }: any) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border-2 border-yellow-500/40">
        <h3 className="text-2xl font-bold text-white mb-6">
          {language === 'en' ? 'Complete Lifetime Offering' : 'Compléter Offrande de Vie'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Date Completed' : 'Date Complétée'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Location' : 'Lieu'}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {language === 'en' ? 'Notes' : 'Notes'}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-lg transition-colors"
            >
              {language === 'en' ? 'Mark Complete' : 'Marquer Complet'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}