import { router } from '@inertiajs/react';
import { atom } from 'jotai';

/* ---------------------------
   BASE ATOMS
----------------------------*/
export const pagePropsAtom = atom([]);
export const quizDataAtom = atom([]);
export const quizIdAtom = atom(null);
export const currentQuestionIndexAtom = atom(0);

const baseAllAnswersAtom = atom({});
export const allAnswersAtom = atom(
  (get) => get(baseAllAnswersAtom),
  (get, set, update, params) => {
    const isLocalStorage = params?.isLocalStorage ?? true

    set(baseAllAnswersAtom, update);
    const newAnswers = get(baseAllAnswersAtom);

    const quizId = get(quizIdAtom);
    if (quizId && isLocalStorage && newAnswers) {
      let filteredAnswers = Object.fromEntries(
        Object.entries(newAnswers).filter(([_, value]) => {
          if (typeof value === 'object' && value !== null) {            
            return Object.keys(value).length > 1
          }
          return true
        })
      )

      localStorage.setItem(`quizAnswers.${quizId}`, JSON.stringify(filteredAnswers));
    }
  }
);

export const totalQuestionsAtom = atom(
  (get) => get(quizDataAtom).length
);

export const currentQuestionAtom = atom(
  (get) => get(quizDataAtom)[get(currentQuestionIndexAtom)]
);

/* ---------------------------
   1) TIPE SOAL: ATOM TERPISAH
----------------------------*/
export const isEssayAtom = atom((get) => {
  const q = get(currentQuestionAtom);
  return q?.type === "essay";
});

export const isSingleAtom = atom((get) => {
  const q = get(currentQuestionAtom);
  return q?.type === "single_choice";
});

export const isMultipleAtom = atom((get) => {
  const q = get(currentQuestionAtom);
  return q?.type === "multiple_choice";
});

export const isFileUploadAtom = atom((get) => {
  const q = get(currentQuestionAtom);
  return q?.type === "file_upload";
});

/* ---------------------------
   2) CURRENT VALUE FOR QUESTION
----------------------------*/
export const currentValueAtom = atom((get) => {
  const q = get(currentQuestionAtom);
  if (!q) return null;
  const all = get(allAnswersAtom);
  return all?.[q.id];
});

/* ---------------------------
   3) CAN NEXT: KOMBINASI
----------------------------*/
export const canNextAtom = atom((get) => {
  const currentIndex = get(currentQuestionIndexAtom);
  const total = get(totalQuestionsAtom);

  if (currentIndex === total - 1) {
    return false;
  }

  const isEssay = get(isEssayAtom);
  const isSingle = get(isSingleAtom);
  const isMultiple = get(isMultipleAtom);
  const value = get(currentValueAtom);

  if (isEssay) return true;
  if (isSingle) return Boolean(value);
  if (isMultiple) return Array.isArray(value) && value.length > 0;

  return false;
});
/* ---------------------------
   METADATA & SUBMIT
----------------------------*/
export const answeredCountAtom = atom(
  (get) => Object.keys(get(allAnswersAtom)).length
);


export const allAnsweredAtom = atom((get) => {
  const allAnswers = get(allAnswersAtom);
  const total = get(totalQuestionsAtom);

  // Filter jawaban yang valid: bukan null, bukan "", bukan array kosong
  const answeredCount = Object.values(allAnswers).filter((val) => {
    if (val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
      return false;
    }
    return true;
  }).length;

  return answeredCount === total;
});

export const progressPercentageAtom = atom(
  (get) => {
    const total = get(totalQuestionsAtom);
    if (total === 0) return 0;
    return (get(answeredCountAtom) / total) * 100;
  }
);

export const submitProcessAtom = atom(false)
export const submitAtom = atom(
  null,
  (get, set, params) => {
    const { backButtonRef = null } = params
    set(submitProcessAtom, true)

    const props = get(pagePropsAtom);
    const allAnswers = get(allAnswersAtom);

    router.visit(props?.page?.url, {
      method: 'post',
      data: {
        answers: allAnswers,
        quiz_id: props?.quiz?.id,
      },
      onSuccess: () => {
        set(submitProcessAtom, false)

        const quizId = get(quizIdAtom);
        localStorage.removeItem(`quizAnswers.${quizId}`);

        if (backButtonRef?.current) {
          backButtonRef?.current.click();
        }
      },
      onError: () => {
        set(submitProcessAtom, false)
      }
    })
  }
);
