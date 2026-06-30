import { useState, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Shuffle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { allQuestions } from '@/data/questions';
import { categories, categoryColors } from '@/data/categories';
import type { StudyProgress } from '@/types/question';

interface StudyViewProps {
  onBack: () => void;
  updateQuestionProgress: (questionId: string, isCorrect: boolean) => void;
  toggleBookmark: (questionId: string) => void;
  bookmarks: Set<string>;
  getQuestionProgress: (questionId: string) => StudyProgress | undefined;
}

export function StudyView({
  onBack,
  updateQuestionProgress,
  toggleBookmark,
  bookmarks,
  getQuestionProgress,
}: StudyViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [studyMode, setStudyMode] = useState<'category' | 'bookmarks' | 'all'>('all');
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  const filteredQuestions = useMemo(() => {
    let pool = allQuestions;
    if (studyMode === 'bookmarks') {
      pool = allQuestions.filter(q => bookmarks.has(q.id));
    } else if (selectedCategory) {
      pool = allQuestions.filter(q => q.category === selectedCategory);
      if (selectedSubcategory) {
        pool = allQuestions.filter(q => q.subcategory === selectedSubcategory);
      }
    }
    return pool;
  }, [selectedCategory, selectedSubcategory, studyMode, bookmarks]);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleSelectAnswer = useCallback(
    (index: number) => {
      if (showAnswer) return;
      setSelectedAnswer(index);
      setShowAnswer(true);
      const correct = index === currentQuestion.correctIndex;
      updateQuestionProgress(currentQuestion.id, correct);
      setSessionStats(prev => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [showAnswer, currentQuestion, updateQuestionProgress]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  }, [currentIndex, filteredQuestions.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setSessionStats({ correct: 0, total: 0 });
  }, []);

  const handleShuffle = useCallback(() => {
    // In a real implementation, we'd shuffle the questions array
    // For now, just reset
    handleReset();
  }, [handleReset]);

  const handleCategorySelect = useCallback((catId: string | null) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(null);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  }, []);

  const handleSubcategorySelect = useCallback((subId: string | null) => {
    setSelectedSubcategory(subId);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  }, []);

  const progress = currentQuestion ? getQuestionProgress(currentQuestion.id) : undefined;
  const isBookmarked = currentQuestion ? bookmarks.has(currentQuestion.id) : false;

  if (studyMode === 'bookmarks' && filteredQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Study Mode</h2>
        </div>
        <Card className="bg-slate-900 border-slate-800 p-8 text-center">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Bookmarked Questions</h3>
          <p className="text-slate-400 mb-4">
            Bookmark questions during study to review them later here.
          </p>
          <Button
            onClick={() => setStudyMode('all')}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Start Studying
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">Study Mode</h2>
            <p className="text-sm text-slate-400">
              {filteredQuestions.length} questions
              {sessionStats.total > 0 && (
                <span className="ml-2">
                  · Session: {sessionStats.correct}/{sessionStats.total} correct
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStudyMode(studyMode === 'bookmarks' ? 'all' : 'bookmarks');
              handleCategorySelect(null);
            }}
            className={`border-slate-700 ${
              studyMode === 'bookmarks'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 mr-1" />
            Bookmarks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            className="border-slate-700 text-slate-400 hover:text-white"
          >
            <Shuffle className="w-4 h-4 mr-1" />
            Shuffle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-slate-700 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {studyMode !== 'bookmarks' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCategorySelect(null)}
              className={`border-slate-700 ${
                !selectedCategory
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50'
                  : 'text-slate-400'
              }`}
            >
              All Topics
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant="outline"
                size="sm"
                onClick={() => handleCategorySelect(cat.id)}
                className="border-slate-700"
                style={{
                  color: selectedCategory === cat.id ? categoryColors[cat.id] : undefined,
                  backgroundColor:
                    selectedCategory === cat.id
                      ? `${categoryColors[cat.id]}15`
                      : undefined,
                  borderColor:
                    selectedCategory === cat.id ? `${categoryColors[cat.id]}50` : undefined,
                }}
              >
                {cat.id}
              </Button>
            ))}
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (studyMode === 'bookmarks') {
              setStudyMode('all');
              handleCategorySelect(null);
            } else {
              setStudyMode('bookmarks');
            }
          }}
          className={`border-slate-700 ${
            studyMode === 'bookmarks'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/50'
              : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-3 h-3 mr-1" />
          {studyMode === 'bookmarks' ? 'Exit Saved' : 'Saved'}
        </Button>
      </div>

      {/* Subcategory Filter */}
      {selectedCategory && studyMode !== 'bookmarks' && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSubcategorySelect(null)}
            className={!selectedSubcategory ? 'text-emerald-400' : 'text-slate-400'}
          >
            All in {selectedCategory}
          </Button>
          {categories
            .find(c => c.id === selectedCategory)
            ?.subcategories.map(sub => (
              <Button
                key={sub.id}
                variant="ghost"
                size="sm"
                onClick={() => handleSubcategorySelect(sub.id)}
                className={
                  selectedSubcategory === sub.id ? 'text-emerald-400' : 'text-slate-400'
                }
              >
                {sub.name}
              </Button>
            ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">
          {currentIndex + 1} / {filteredQuestions.length}
        </span>
        <Progress
          value={((currentIndex + 1) / filteredQuestions.length) * 100}
          className="flex-1 h-2 bg-slate-800"
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
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
                    {currentQuestion.category}
                  </Badge>
                  <span className="text-xs text-slate-500">{currentQuestion.id}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(currentQuestion.id)}
                  className={isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Question Text */}
              <h3 className="text-lg text-white font-medium leading-relaxed mb-6">
                {currentQuestion.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-2">
                {currentQuestion.answers.map((answer, i) => {
                  let buttonClass =
                    'w-full text-left p-4 rounded-lg border transition-all ';

                  if (showAnswer) {
                    if (i === currentQuestion.correctIndex) {
                      buttonClass +=
                        'bg-emerald-500/10 border-emerald-500/50 text-emerald-300';
                    } else if (i === selectedAnswer && i !== currentQuestion.correctIndex) {
                      buttonClass += 'bg-red-500/10 border-red-500/50 text-red-300';
                    } else {
                      buttonClass +=
                        'bg-slate-800/50 border-slate-700 text-slate-500';
                    }
                  } else {
                    buttonClass +=
                      'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-600 cursor-pointer';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(i)}
                      disabled={showAnswer}
                      className={buttonClass}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            showAnswer
                              ? i === currentQuestion.correctIndex
                                ? 'bg-emerald-500 text-white'
                                : i === selectedAnswer
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-700 text-slate-400'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {showAnswer && i === currentQuestion.correctIndex ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : showAnswer && i === selectedAnswer ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            String.fromCharCode(65 + i)
                          )}
                        </span>
                        <span>{answer}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showAnswer && (
                <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400 mb-1">Explanation</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Progress */}
              {progress && progress.timesAnswered > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <BarChart3 className="w-3 h-3" />
                  <span>
                    Previously answered {progress.timesAnswered} time
                    {progress.timesAnswered !== 1 ? 's' : ''} ·{' '}
                    {progress.timesCorrect} correct (
                    {Math.round((progress.timesCorrect / progress.timesAnswered) * 100)}%)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            {showAnswer && (
              <Button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-30"
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
