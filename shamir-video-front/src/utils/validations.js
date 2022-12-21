import { filter } from '@/utils/badWordsFilter'

const PROFANITY = 'PROFANITY'

export function badWords (value) {
    if (!value) return true 
    const _value = filter.proceed(value, PROFANITY, 0)[0]
    return !_value.includes(PROFANITY)
}