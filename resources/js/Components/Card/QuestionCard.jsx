import { useAtom } from 'jotai';
import {
  currentQuestionIndexAtom,
  totalQuestionsAtom,
  currentQuestionAtom,
  currentAnswerIdAtom,
  allAnswersAtom
} from '@/atoms/quizStore';

function QuestionCard() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(currentQuestionIndexAtom);
  const [totalQuestions] = useAtom(totalQuestionsAtom);
  const [currentQuestion] = useAtom(currentQuestionAtom);
  const [currentAnswerId] = useAtom(currentAnswerIdAtom);
  const [, setAllAnswers] = useAtom(allAnswersAtom);

   const handleSelectAnswer = (questionId, answerId) => {
    setAllAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Tampilkan loading jika data belum siap
  if (!currentQuestion) {
    return (
      <div className="card bg-base-100 shadow-xl flex-1">
        <div className="card-body items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl flex-1">
      <div className="card-body">
        <p className="text-sm text-base-content text-opacity-70">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </p>

        <h2 className="card-title text-xl my-4">
          {currentQuestion.text}
        </h2>

        {/* --- Opsi Jawaban --- */}
        <div className="space-y-3">
          {currentQuestion.answers.map((answer) => (
            <div
              key={answer.id}
              className={`
                form-control border rounded-lg p-4
                transition-all hover:border-primary
                ${currentAnswerId === answer.id ? 'border-primary bg-primary bg-opacity-10' : 'border-base-300'}
              `}
            >
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  className="radio radio-primary"
                  checked={currentAnswerId === answer.id}
                  onChange={() => handleSelectAnswer(currentQuestion.id, answer.id)}
                />
                <span className="label-text text-base">{answer.text}</span>
              </label>
            </div>
          ))}
        </div>

        {/* --- Navigasi Bawah --- */}
        <div className="card-actions justify-between mt-8">
          <button
            className="btn btn-ghost"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={currentQuestionIndex === totalQuestions - 1 || !currentAnswerId}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default QuestionCard;
