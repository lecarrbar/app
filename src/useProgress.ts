import { useState, useEffect, useCallback } from 'react';
import type { StudyProgress, ExamResult } from '@/types/question';

const PROGRESS_KEY = 'hamradio-progress';
const EXAM_HISTORY_KEY = 'hamradio-exam-history';
const BOOKMARKS_KEY = 'hamradio-bookmarks';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    // ignore parse errors
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Map<string, StudyProgress>>(() => {
    const data = loadFromStorage<Record<string, StudyProgress>>(PROGRESS_KEY, {});
    return new Map(Object.entries(data));
  });

  const [examHistory, setExamHistory] = useState<ExamResult[]>(() =>
    loadFromStorage<ExamResult[]>(EXAM_HISTORY_KEY, [])
  );

  const [bookmarks, setBookmarks] = useState<Set<string>>(() =>
    new Set(loadFromStorage<string[]>(BOOKMARKS_KEY, []))
  );

  useEffect(() => {
    const data: Record<string, StudyProgress> = {};
    progress.forEach((value, key) => {
      data[key] = value;
    });
    saveToStorage(PROGRESS_KEY, data);
  }, [progress]);

  useEffect(() => {
    saveToStorage(EXAM_HISTORY_KEY, examHistory);
  }, [examHistory]);

  useEffect(() => {
    saveToStorage(BOOKMARKS_KEY, Array.from(bookmarks));
  }, [bookmarks]);

  const updateQuestionProgress = useCallback((
    questionId: string,
    isCorrect: boolean
  ) => {
    setProgress(prev => {
      const next = new Map(prev);
      const existing = next.get(questionId);
      if (existing) {
        next.set(questionId, {
          ...existing,
          timesAnswered: existing.timesAnswered + 1,
          timesCorrect: existing.timesCorrect + (isCorrect ? 1 : 0),
          lastAnswered: new Date().toISOString(),
          difficulty: existing.timesAnswered >= 2
            ? existing.timesCorrect / existing.timesAnswered >= 0.7
              ? 'easy'
              : existing.timesCorrect / existing.timesAnswered >= 0.4
              ? 'medium'
              : 'hard'
            : existing.difficulty,
        });
      } else {
        next.set(questionId, {
          questionId,
          timesAnswered: 1,
          timesCorrect: isCorrect ? 1 : 0,
          lastAnswered: new Date().toISOString(),
          isBookmarked: false,
          difficulty: isCorrect ? 'easy' : 'medium',
        });
      }
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });

    setProgress(prev => {
      const next = new Map(prev);
      const existing = next.get(questionId);
      if (existing) {
        next.set(questionId, {
          ...existing,
          isBookmarked: !existing.isBookmarked,
        });
      } else {
        next.set(questionId, {
          questionId,
          timesAnswered: 0,
          timesCorrect: 0,
          lastAnswered: null,
          isBookmarked: true,
          difficulty: 'medium',
        });
      }
      return next;
    });
  }, []);

  const addExamResult = useCallback((result: ExamResult) => {
    setExamHistory(prev => [result, ...prev].slice(0, 50));
  }, []);

  const clearAllProgress = useCallback(() => {
    setProgress(new Map());
    setExamHistory([]);
    setBookmarks(new Set());
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(EXAM_HISTORY_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
  }, []);

  const getQuestionProgress = useCallback(
    (questionId: string): StudyProgress | undefined => {
      return progress.get(questionId);
    },
    [progress]
  );

  const getStats = useCallback(() => {
    const totalAnswered = progress.size;
    const totalCorrect = Array.from(progress.values()).reduce(
      (sum, p) => sum + p.timesCorrect,
      0
    );
    const totalAnsweredCount = Array.from(progress.values()).reduce(
      (sum, p) => sum + p.timesAnswered,
      0
    );

    return {
      totalAnswered,
      totalCorrect,
      totalAnsweredCount,
      accuracy: totalAnsweredCount > 0 ? (totalCorrect / totalAnsweredCount) * 100 : 0,
      examCount: examHistory.length,
      bookmarkCount: bookmarks.size,
      averageExamScore: examHistory.length > 0
        ? examHistory.reduce((sum, e) => sum + e.score, 0) / examHistory.length
        : 0,
    };
  }, [progress, examHistory, bookmarks]);

  const getCategoryStats = useCallback(() => {
    // This would need category info from questions
    // Return a placeholder structure
    return new Map<string, { answered: number; correct: number; total: number }>();
  }, []);

  return {
    progress,
    examHistory,
    bookmarks,
    updateQuestionProgress,
    toggleBookmark,
    addExamResult,
    clearAllProgress,
    getQuestionProgress,
    getStats,
    getCategoryStats,
  };
}
