import * as Filter from 'leo-profanity'

export const filter = Filter

export function setBadWordsLanugage(languageCode, additionalWords){
    const lang = languageCode.slice(0,2)
    filter.loadDictionary(lang)
    if(additionalWords) filter.add(additionalWords)
}