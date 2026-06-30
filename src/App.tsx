import { useState, useCallback } from 'react';
import type { AppView, ExamResult, AnsweredQuestion } from '@/types/question';
import { useProgress } from '@/hooks/useProgress';
import { HomeView } from '@/components/HomeView';
import { StudyView } from '@/components/StudyView';
import { ExamView } from '@/components/ExamView';
import { ResultsView } from '@/components/ResultsView';
import { ProgressView } from '@/components/ProgressView';
import { Navbar } from '@/components/Navbar';
import { Toaster, toast } from 'sonner';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [lastExamResult, setLastExamResult] = useState<ExamResult | null>(null);
  const [lastExamQuestions, setLastExamQuestions] = useState<AnsweredQuestion[]>([]);
  const [examQuestionIds, setExamQuestionIds] = useState<string[]>([]);

  const {
    examHistory,
    bookmarks,
    updateQuestionProgress,
    toggleBookmark,
    addExamResult,
    clearAllProgress,
    getQuestionProgress,
    getStats,
  } = useProgress();

  const handleStartStudy = useCallback(() => {
    setCurrentView('study');
  }, []);

  const handleStartExam = useCallback(() => {
    setCurrentView('exam');
  }, []);

  const handleViewProgress = useCallback(() => {
    setCurrentView('progress');
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentView('home');
    setLastExamResult(null);
  }, []);

  const handleExamComplete = useCallback(
    (result: ExamResult, answeredQuestions: AnsweredQuestion[], questionIds: string[]) => {
      setLastExamResult(result);
      setLastExamQuestions(answeredQuestions);
      setExamQuestionIds(questionIds);
      addExamResult(result);

      // Update progress for each question
      answeredQuestions.forEach(aq => {
        updateQuestionProgress(aq.questionId, aq.isCorrect);
      });

      const passed = result.score >= 74;
      toast.success(
        passed
          ? `Congratulations! You passed with ${result.score}%!`
          : `You scored ${result.score}%. Keep studying!`,
        { duration: 5000 }
      );

      setCurrentView('results');
    },
    [addExamResult, updateQuestionProgress]
  );

  const handleClearProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      clearAllProgress();
      toast.info('All progress has been cleared');
    }
  }, [clearAllProgress]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />

      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onGoHome={handleGoHome}
      />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {currentView === 'home' && (
          <HomeView
            onStartStudy={handleStartStudy}
            onStartExam={handleStartExam}
            onViewProgress={handleViewProgress}
            stats={getStats()}
            recentExams={examHistory.slice(0, 5)}
          />
        )}

        {currentView === 'study' && (
          <StudyView
            onBack={handleGoHome}
            updateQuestionProgress={updateQuestionProgress}
            toggleBookmark={toggleBookmark}
            bookmarks={bookmarks}
            getQuestionProgress={getQuestionProgress}
          />
        )}

        {currentView === 'exam' && (
          <ExamView
            onComplete={handleExamComplete}
            onCancel={handleGoHome}
          />
        )}

        {currentView === 'results' && lastExamResult && (
          <ResultsView
            result={lastExamResult}
            answeredQuestions={lastExamQuestions}
            questionIds={examQuestionIds}
            onGoHome={handleGoHome}
            onRetakeExam={handleStartExam}
            getQuestionProgress={getQuestionProgress}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            onBack={handleGoHome}
            onClearProgress={handleClearProgress}
            examHistory={examHistory}
            stats={getStats()}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            getQuestionProgress={getQuestionProgress}
          />
        )}
      </main>
    </div>
  );
}

export default App;
