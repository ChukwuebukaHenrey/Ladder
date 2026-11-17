// Known-answer sentences for the setup check. Each word has 3 meanings, so
// guessing would be right only about a third of the time.
export interface Case {
  sentence: string
  word: string
  senses: string[]
  answer: 'A' | 'B' | 'C'
}

const BANK = ['a business that keeps and lends money', 'the land along the side of a river', 'a store of something kept for later use']
const FAIR = ['treating people equally and justly', 'light in colour (hair or skin)', 'an outdoor event with rides, games and stalls']
const BRIGHT = ['giving out a lot of light', 'clever and quick to learn', 'cheerful and full of hope']

export const CASES: Case[] = [
  { sentence: 'We sat on the bank and watched the canoes go past.', word: 'bank', senses: BANK, answer: 'B' },
  { sentence: 'She paid her school fees into the bank on Monday.', word: 'bank', senses: BANK, answer: 'A' },
  { sentence: 'The hospital says its blood bank is running low.', word: 'bank', senses: BANK, answer: 'C' },
  { sentence: 'The children won prizes at the fair last weekend.', word: 'fair', senses: FAIR, answer: 'C' },
  { sentence: 'Tunde is a bright student who finishes every exercise early.', word: 'bright', senses: BRIGHT, answer: 'B' },
]
