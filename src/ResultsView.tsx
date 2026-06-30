import { useState } from 'react';
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Home,
  Target,
  Clock,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getQuestionById } from '@/data/questions';
import { categoryColors } from '@/data/categories';
import type { ExamResult, AnsweredQuestion, StudyProgress } from '@/types/question';

interface ResultsViewProps {
  result: ExamResult;
  answeredQuestions: AnsweredQuestion[];
  questionIds: string[];
  onGoHome: () => void;
  onRetakeExam: () => void;
  getQuestionProgress?: (questionId: string) => StudyProgress | undefined;
}

export function ResultsView({
  result,
  answeredQuestions,
  onGoHome,
  onRetakeExam,
}: ResultsViewProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

  const passed = result.score >= 74;
  const incorrectQuestions = answeredQuestions.filter(a => !a.isCorrect);
  const displayQuestions = showOnlyIncorrect ? incorrectQuestions : answeredQuestions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onGoHome} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-white">Exam Results</h2>
      </div>

      {/* Score Card */}
      <Card
        className={`overflow-hidden border-0 ${
          passed
            ? 'bg-gradient-to-br from-emerald-900/50 to-slate-900'
            : 'bg-gradient-to-br from-amber-900/30 to-slate-900'
        }`}
      >
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Score Circle */}
            <div className="relative">
              <svg className="w-32 h-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={351.86}
                  strokeDashoffset={351.86 * (1 - result.score / 100)}
                  className={passed ? 'text-emerald-500' : 'text-amber-500'}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.score}%
                </span>
              </div>
            </div>

            {/* Result Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                {passed ? (
                  <>
                    <Trophy className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-bold text-emerald-400">You Passed!</h3>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-bold text-amber-400">Keep Studying</h3>
                  </>
                )}
              </div>
              <p className="text-slate-300 mb-4">
                You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
                {passed
                  ? ' You would have passed the real exam!'
                  : ` You need ${Math.ceil(result.totalQuestions * 0.74) - result.correctAnswers} more correct answers to pass.`}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Pass threshold: 74%
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Time remaining: {Math.floor(result.timeRemaining / 60)}m {result.timeRemaining % 60}s
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {incorrectQuestions.length} incorrect
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onRetakeExam}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Take Another Exam
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowOnlyIncorrect(!showOnlyIncorrect)}
          className={`border-slate-700 gap-2 ${
            showOnlyIncorrect ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {showOnlyIncorrect ? 'Show All' : 'Show Only Incorrect'}
        </Button>
        <Button
          variant="outline"
          onClick={onGoHome}
          className="border-slate-700 text-slate-300 gap-2"
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>

      {/* Question Review */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          {showOnlyIncorrect ? 'Incorrect Answers' : 'Answer Review'}
        </h3>
        {displayQuestions.map((aq, displayIdx) => {
          const question = getQuestionById(aq.questionId);
          if (!question) return null;

          const isExpanded = expandedQuestion === displayIdx;
          const userAnswer = aq.selectedAnswer;
          const correctAnswer = question.correctIndex;

          return (
            <Card
              key={aq.questionId}
              className={`bg-slate-900 border-slate-800 overflow-hidden ${
                aq.isCorrect ? 'border-l-2 border-l-emerald-500' : 'border-l-2 border-l-red-500'
              }`}
            >
              <button
                className="w-full p-4 flex items-start gap-3 text-left"
                onClick={() => setExpandedQuestion(isExpanded ? null : displayIdx)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {aq.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{
                        borderColor: categoryColors[question.category],
                        color: categoryColors[question.category],
                      }}
                    >
                      {question.subcategory}
                    </Badge>
                    <span className="text-xs text-slate-500">{question.id}</span>
                  </div>
                  <p className="text-sm text-slate-200 line-clamp-2">{question.question}</p>
                  {!aq.isCorrect && (
                    <p className="text-xs text-red-400 mt-1">
                      You selected: {userAnswer >= 0 ? question.answers[userAnswer] : 'No answer'}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pl-12">
                  {/* All Options */}
                  <div className="space-y-1.5 mb-4">
                    {question.answers.map((answer, i) => {
                      let bgClass = 'bg-slate-800/50 text-slate-400';
                      if (i === correctAnswer) {
                        bgClass = 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30';
                      } else if (i === userAnswer && !aq.isCorrect) {
                        bgClass = 'bg-red-500/10 text-red-300 border border-red-500/30';
                      }
                      return (
                        <div key={i} className={`p-2 rounded text-sm ${bgClass}`}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                          {answer}
                          {i === correctAnswer && (
                            <span className="ml-2 text-emerald-400 text-xs">(Correct)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
