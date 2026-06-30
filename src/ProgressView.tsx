import { useMemo } from 'react';
import {
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { allQuestions, getQuestionsByCategory } from '@/data/questions';
import { categories, categoryColors } from '@/data/categories';
import type { ExamResult, StudyProgress } from '@/types/question';

interface ProgressViewProps {
  onBack: () => void;
  onClearProgress: () => void;
  examHistory: ExamResult[];
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    totalAnsweredCount: number;
    accuracy: number;
    examCount: number;
    bookmarkCount: number;
    averageExamScore: number;
  };
  bookmarks: Set<string>;
  toggleBookmark: (questionId: string) => void;
  getQuestionProgress: (questionId: string) => StudyProgress | undefined;
}

export function ProgressView({
  onBack,
  onClearProgress,
  examHistory,
  stats,
  bookmarks,
  toggleBookmark,
  getQuestionProgress,
}: ProgressViewProps) {
  const categoryStats = useMemo(() => {
    const stats: Record<
      string,
      { answered: number; correct: number; total: number; name: string }
    > = {};

    categories.forEach(cat => {
      const questions = getQuestionsByCategory(cat.id);
      let answered = 0;
      let correct = 0;

      questions.forEach(q => {
        const progress = getQuestionProgress(q.id);
        if (progress && progress.timesAnswered > 0) {
          answered += progress.timesAnswered;
          correct += progress.timesCorrect;
        }
      });

      stats[cat.id] = {
        answered,
        correct,
        total: questions.length,
        name: cat.name,
      };
    });

    return stats;
  }, [getQuestionProgress]);

  const bookmarkedQuestions = useMemo(() => {
    return allQuestions.filter(q => bookmarks.has(q.id));
  }, [bookmarks]);

  const weakAreas = useMemo(() => {
    return Object.entries(categoryStats)
      .filter(([, s]) => s.answered > 0)
      .sort((a, b) => a[1].correct / a[1].answered - b[1].correct / b[1].answered)
      .slice(0, 3);
  }, [categoryStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Progress Dashboard</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearProgress}
          className="border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Math.round(stats.accuracy)}%
                </p>
                <p className="text-xs text-slate-400">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalAnsweredCount}
                </p>
                <p className="text-xs text-slate-400">Questions Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Math.round(stats.averageExamScore)}%
                </p>
                <p className="text-xs text-slate-400">Avg Exam Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalAnswered}
                </p>
                <p className="text-xs text-slate-400">Unique Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam History */}
      {examHistory.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Exam History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {examHistory.slice(0, 10).map((exam, i) => {
              const prevExam = examHistory[i + 1];
              let trend: 'up' | 'down' | 'same' = 'same';
              if (prevExam) {
                if (exam.score > prevExam.score) trend = 'up';
                else if (exam.score < prevExam.score) trend = 'down';
              }

              return (
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
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {new Date(exam.date).toLocaleDateString()} at{' '}
                        {new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {exam.correctAnswers}/{exam.totalQuestions} correct ·{' '}
                        {Math.floor(exam.timeRemaining / 60)}m remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        exam.score >= 74 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {exam.score}%
                    </span>
                    {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                    {trend === 'same' && <Minus className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(cat => {
            const stat = categoryStats[cat.id];
            const pct =
              stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{
                        borderColor: categoryColors[cat.id],
                        color: categoryColors[cat.id],
                      }}
                    >
                      {cat.id}
                    </Badge>
                    <span className="text-sm text-slate-300">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {stat.answered > 0 ? `${stat.correct}/${stat.answered}` : 'Not started'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={pct}
                    className="flex-1 h-2 bg-slate-800"
                  />
                  <span className="text-xs text-slate-400 w-10 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weak Areas */}
      {weakAreas.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weakAreas.map(([catId, stat]) => {
              const cat = categories.find(c => c.id === catId);
              const pct = Math.round((stat.correct / stat.answered) * 100);
              return (
                <div
                  key={catId}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: categoryColors[catId],
                        color: categoryColors[catId],
                      }}
                    >
                      {catId}
                    </Badge>
                    <span className="text-sm text-slate-200">{cat?.name}</span>
                  </div>
                  <span className="text-sm font-medium text-red-400">{pct}% accuracy</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Bookmarked Questions */}
      {bookmarkedQuestions.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              Bookmarked Questions ({bookmarkedQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {bookmarkedQuestions.map(q => {
              const progress = getQuestionProgress(q.id);
              return (
                <div
                  key={q.id}
                  className="p-3 bg-slate-800/50 rounded-lg flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                        style={{
                          borderColor: categoryColors[q.category],
                          color: categoryColors[q.category],
                        }}
                      >
                        {q.subcategory}
                      </Badge>
                      <span className="text-[10px] text-slate-500">{q.id}</span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2">{q.question}</p>
                    {progress && progress.timesAnswered > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Answered {progress.timesAnswered}x ·{' '}
                        {Math.round((progress.timesCorrect / progress.timesAnswered) * 100)}%
                        correct
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(q.id)}
                    className="text-amber-400 hover:text-amber-300 flex-shrink-0"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
