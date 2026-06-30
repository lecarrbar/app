import type { Question } from '@/types/question';
import { questionsPart1 } from './questions-part1';
import { questionsPart2 } from './questions-part2';
import { questionsPart3 } from './questions-part3';
import { questionsPart4 } from './questions-part4';
import { questionsPart5 } from './questions-part5';

export const allQuestions: Question[] = [
  ...questionsPart1,
  ...questionsPart2,
  ...questionsPart3,
  ...questionsPart4,
  ...questionsPart5,
];

export function getQuestionsByCategory(categoryId: string): Question[] {
  return allQuestions.filter(q => q.category === categoryId);
}

export function getQuestionsBySubcategory(subcategoryId: string): Question[] {
  return allQuestions.filter(q => q.subcategory === subcategoryId);
}

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function getRandomizedExamQuestions(): Question[] {
  // The real exam has 35 questions from a pool
  // We ensure coverage from all major categories
  const selected: Question[] = [];
  const used = new Set<number>();

  // Pick at least one question from each subcategory
  const subcategories = new Set(allQuestions.map(q => q.subcategory));
  for (const sub of subcategories) {
    const pool = allQuestions.filter(q => q.subcategory === sub && !used.has(allQuestions.indexOf(q)));
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const idx = allQuestions.indexOf(pick);
      if (!used.has(idx)) {
        selected.push(pick);
        used.add(idx);
      }
    }
  }

  // Fill remaining with random questions
  const remaining = 35 - selected.length;
  const available = allQuestions.filter((_, i) => !used.has(i));
  const shuffled = available.sort(() => Math.random() - 0.5);
  selected.push(...shuffled.slice(0, remaining));

  // Final shuffle
  return selected.sort(() => Math.random() - 0.5);
}

export const totalQuestionCount = allQuestions.length;
