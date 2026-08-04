import type { GuideTopic } from '../data/guide-topics'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function matchTopic(query: string, topics: GuideTopic[]): GuideTopic | null {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return null

  let best: { topic: GuideTopic; score: number } | null = null

  for (const topic of topics) {
    let score = 0
    for (const keyword of topic.keywords) {
      const normalizedKeyword = normalize(keyword)
      if (normalizedQuery.includes(normalizedKeyword)) score += normalizedKeyword.length
    }
    if (score > 0 && (!best || score > best.score)) best = { topic, score }
  }

  return best?.topic ?? null
}
