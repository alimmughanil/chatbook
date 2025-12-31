import { useAtom } from 'jotai';
import {
  quizDataAtom,
  allAnswersAtom,
  currentQuestionIndexAtom,
  answeredCountAtom,
  totalQuestionsAtom,
  progressPercentageAtom
} from '@/atoms/quizStore';

function ProgressSidebar() {
  // Ambil state dan setter yang diperlukan
  const [quizData] = useAtom(quizDataAtom);
  const [allAnswers] = useAtom(allAnswersAtom);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(currentQuestionIndexAtom);
  const [answeredCount] = useAtom(answeredCountAtom);
  const [totalQuestions] = useAtom(totalQuestionsAtom);
  const [progressPercentage] = useAtom(progressPercentageAtom);

  // Logika handler pindah ke sini
  const handleGridClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = () => {
    console.log('--- SUBMITTING EXAM ---');
    console.log(allAnswers); // State 'allAnswers' sudah dalam format yang diminta
    alert(`Exam Submitted! \nYour answers: \n${JSON.stringify(allAnswers, null, 2)}`);
  };

  return (
    <div className="lg:w-80">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-base">
            Exam progress: {answeredCount}/{totalQuestions}
          </h3>
          <progress
            className="progress progress-primary w-full"
            value={progressPercentage}
            max="100"
          ></progress>

          {/* --- Grid Nomor Soal --- */}
          <div className="grid grid-cols-7 gap-2 my-4">
            {quizData.map((question, index) => {
              const isAnswered = !!allAnswers[question.id];
              const isCurrent = index === currentQuestionIndex;

              let btnClass = 'btn btn-sm btn-outline';
              if (isCurrent) {
                btnClass = 'btn btn-sm btn-primary';
              } else if (isAnswered) {
                btnClass = 'btn btn-sm btn-primary btn-outline';
              }

              return (
                <button
                  key={question.id}
                  className={btnClass}
                  onClick={() => handleGridClick(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-outline btn-success w-full"
            onClick={handleSubmitExam}
            disabled={answeredCount < totalQuestions}
          >
            Finish exam
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgressSidebar;
