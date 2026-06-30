import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Flag,
  Pause,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getRandomizedExamQuestions } from '@/data/questions';
import { categoryColors } from '@/data/categories';
import type { ExamResult, AnsweredQuestion, Question } from '@/types/question';

interface ExamViewProps {
  onComplete: (result: ExamResult, answeredQuestions: AnsweredQuestion[], questionIds: string[]) => void;
  onCancel: () => void;
}

const EXAM_TIME_MINUTES = 60; // 60 minutes for the exam
const TOTAL_QUESTIONS = 35;

export function ExamView({ onComplete, onCancel }: ExamViewProps) {
  const [questions] = useState<Question[]>(getRandomizedExamQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null));
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(EXAM_TIME_MINUTES * 60);
  const [isRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showReviewMode, setShowReviewMode] = useState(false);

  // Timer
  useEffect(() => {
    if (!isRunning || isPaused) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (isPaused) return;
      setAnswers(prev => {
        const next = [...prev];
        next[currentIndex] = answerIndex;
        return next;
      });
    },
    [currentIndex, isPaused]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const toggleFlag = useCallback(() => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) {
        next.delete(currentIndex);
      } else {
        next.add(currentIndex);
      }
      return next;
    });
  }, [currentIndex]);

  const handleFinish = useCallback(() => {
    const answeredQuestions: AnsweredQuestion[] = questions.map((q, i) => ({
      questionId: q.id,
      selectedAnswer: answers[i] ?? -1,
      isCorrect: answers[i] === q.correctIndex,
      timeSpent: 0,
    }));

    const correctCount = answeredQuestions.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const questionIds = questions.map(q => q.id);

    const result: ExamResult = {
      date: new Date().toISOString(),
      score,
      totalQuestions: TOTAL_QUESTIONS,
      correctAnswers: correctCount,
      questions: answeredQuestions,
      timeRemaining,
    };

    onComplete(result, answeredQuestions, questionIds);
  }, [questions, answers, timeRemaining, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const currentQuestion = questions[currentIndex];
  const isLowTime = timeRemaining < 300; // less than 5 minutes
  const isVeryLowTime = timeRemaining < 60; // less than 1 minute

  // Question grid review
  if (showReviewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setShowReviewMode(false)} className="text-slate-400">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-bold text-white">Question Review</h2>
          </div>
          <Button onClick={handleFinish} className="bg-emerald-500 hover:bg-emerald-600">
            Submit Exam
          </Button>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
          {questions.map((_q, i) => {
            const answered = answers[i] !== null;
            const isFlagged = flagged.has(i);
            return (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setShowReviewMode(false);
                }}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  answered
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                } ${isFlagged ? 'ring-1 ring-amber-500' : ''}`}
              >
                {i + 1}
                {isFlagged && <span className="ml-1 text-amber-500">!</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500/30 rounded" />
            Answered
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-700 rounded" />
            Unanswered
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">!</span> Flagged
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setShowConfirmEnd(true)} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">Practice Exam</h2>
            <p className="text-sm text-slate-400">
              {answeredCount} of {TOTAL_QUESTIONS} answered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isVeryLowTime
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : isLowTime
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="border-slate-700 text-slate-400"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress
        value={(answeredCount / TOTAL_QUESTIONS) * 100}
        className="h-2 bg-slate-800"
      />

      {/* Pause Overlay */}
      {isPaused && (
        <Card className="bg-slate-900 border-slate-800 p-8 text-center">
          <Pause className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Exam Paused</h3>
          <p className="text-slate-400 mb-4">Take your time. Click resume to continue.</p>
          <Button onClick={() => setIsPaused(false)} className="bg-emerald-500 hover:bg-emerald-600">
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
        </Card>
      )}

      {/* Confirm End */}
      {showConfirmEnd && (
        <Card className="bg-slate-900 border-slate-800 p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">End Exam?</h3>
          <p className="text-slate-400 mb-6">
            {answeredCount < TOTAL_QUESTIONS
              ? `You have ${TOTAL_QUESTIONS - answeredCount} unanswered questions. Are you sure?`
              : 'Are you sure you want to submit your exam?'}
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmEnd(false)}
              className="border-slate-700 text-slate-300"
            >
              Continue Exam
            </Button>
            <Button
              onClick={onCancel}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
            >
              Quit
            </Button>
          </div>
        </Card>
      )}

      {/* Question */}
      {!isPaused && !showConfirmEnd && currentQuestion && (
        <div className="space-y-4">
          <Card className="bg-slate-900 border-slate-800 overflow-hidden">
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: categoryColors[currentQuestion.category],
                      color: categoryColors[currentQuestion.category],
                    }}
                  >
                    {currentQuestion.subcategory}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Q{currentIndex + 1} of {TOTAL_QUESTIONS}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFlag}
                  className={flagged.has(currentIndex) ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}
                >
                  <Flag className="w-5 h-5" />
                </Button>
              </div>

              {/* Question Text */}
              <h3 className="text-lg text-white font-medium leading-relaxed mb-6">
                {currentQuestion.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-2">
                {currentQuestion.answers.map((answer, i) => {
                  const isSelected = answers[currentIndex] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(i)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {isSelected ? <CheckCircle2 className="w-5 h-5" /> : String.fromCharCode(65 + i)}
                        </span>
                        <span>{answer}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewMode(true)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Review
              </Button>
            </div>

            {currentIndex === TOTAL_QUESTIONS - 1 ? (
              <Button
                onClick={() => setShowConfirmEnd(true)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Finish Exam
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
