import useLang from '../hooks/useLang'

export const useGenderHelper = () => {
  const {lang} = useLang()

  const translate = {
    en: {
      male: 'male',
      female: 'female',
      true: 'true',
      false: 'false',
    },
    ar: {
      male: 'ذكر',
      female: 'انثى',
      true: 'صحيح',
      false: 'خطأ',
    },
  }
  let genderArray = [translate[lang].male, translate[lang].female]
  let booleanArray = [translate[lang].true, translate[lang].false]

  let getTranslation = word => translate[lang][word]

  return {
    genderArray,
    booleanArray,
    getTranslation,
    getTranslationValue: word => {
      if (word == 'ذكر' || word == 'male') return 'male'
      if (word == 'انثى' || word == 'female') return 'female'
      if (word === 'true' || word === 'صحيح') return true
      return false
    },
  }
}
