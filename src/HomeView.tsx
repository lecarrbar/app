import {
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Radio,
  ChevronRight,
  Award,
  Star,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExamResult } from '@/types/question';
import { totalQuestionCount } from '@/data/questions';

interface HomeViewProps {
  onStartStudy: () => void;
  onStartExam: () => void;
  onViewProgress: () => void;
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    totalAnsweredCount: number;
    accuracy: number;
    examCount: number;
    bookmarkCount: number;
    averageExamScore: number;
  };
  recentExams: ExamResult[];
}

export function HomeView({
  onStartStudy,
  onStartExam,
  onViewProgress,
  stats,
  recentExams,
}: HomeViewProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero.jpg"
            alt="Ham Radio Station"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </div>
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Radio className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Ham Radio Tutor</h1>
              <p className="text-slate-300">Technician Class License Preparation</p>
            </div>
          </div>
          <p className="text-slate-200 max-w-xl mt-4 leading-relaxed">
            Master the FCC Amateur Radio Technician Class exam with {totalQuestionCount}+ practice
            questions covering all exam topics. Study by category, take timed practice exams, and
            track your progress.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              onClick={onStartStudy}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Start Studying
            </Button>
            <Button
              onClick={onStartExam}
              size="lg"
              variant="outline"
              className="border-slate-500 text-slate-200 hover:bg-slate-800/80 gap-2 backdrop-blur-sm"
            >
              <ClipboardCheck className="w-4 h-4" />
              Practice Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Brain}
          label="Questions Answered"
          value={stats.totalAnsweredCount}
          color="emerald"
        />
        <StatCard
          icon={Target}
          label="Accuracy Rate"
          value={`${Math.round(stats.accuracy)}%`}
          color="blue"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Exams Taken"
          value={stats.examCount}
          color="amber"
        />
        <StatCard
          icon={Star}
          label="Bookmarked"
          value={stats.bookmarkCount}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer group"
          onClick={onStartStudy}>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <BookOpen className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Study Mode</h3>
            <p className="text-sm text-slate-400 mb-4">
              Learn by topic with {totalQuestionCount}+ questions. Get instant feedback and detailed explanations.
            </p>
            <div className="flex items-center text-emerald-400 text-sm font-medium">
              Start Learning <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer group"
          onClick={onStartExam}>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <ClipboardCheck className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Practice Exam</h3>
            <p className="text-sm text-slate-400 mb-4">
              Take a timed 35-question exam just like the real thing. Need 74% to pass.
            </p>
            <div className="flex items-center text-blue-400 text-sm font-medium">
              Start Exam <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-colors cursor-pointer group"
          onClick={onViewProgress}>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Track Progress</h3>
            <p className="text-sm text-slate-400 mb-4">
              View detailed stats, exam history, and identify areas that need more study.
            </p>
            <div className="flex items-center text-purple-400 text-sm font-medium">
              View Stats <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams */}
      {recentExams.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Recent Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExams.slice(0, 5).map((exam, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      exam.score >= 74
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {exam.score >= 74 ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      <TrendingUp className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {exam.score >= 74 ? 'Passed' : 'Needs Practice'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(exam.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      exam.score >= 74 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {exam.score}%
                  </p>
                  <p className="text-xs text-slate-400">
                    {exam.correctAnswers}/{exam.totalQuestions}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Exam Info */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            About the Technician Exam
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <InfoItem
            icon={ClipboardCheck}
            title="35 Questions"
            desc="Multiple choice questions from a pool of 400+"
          />
          <InfoItem
            icon={Target}
            title="74% to Pass"
            desc="You need at least 26 correct answers"
          />
          <InfoItem
            icon={Clock}
            title="Unlimited Time"
            desc="But most finish within 30 minutes"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Brain;
  label: string;
  value: number | string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Brain;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
