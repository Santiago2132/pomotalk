import React from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { quizQuestions } from "../data/quizQuestions";

export const QuizActivity: React.FC = () => {
  const [quizState, setQuizState] = React.useState<'inactive' | 'active' | 'results'>('inactive');
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<string[]>([]);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
  const [selectedQuestions, setSelectedQuestions] = React.useState<typeof quizQuestions>([]);

  // Función para seleccionar 5 preguntas aleatorias sin repetición
  const getRandomQuestions = (questions: typeof quizQuestions, count: number) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  };

  const startQuiz = () => {
    console.log("startQuiz triggered");
    if (!quizQuestions || quizQuestions.length === 0) {
      console.error("No quiz questions available");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleStartQuiz = () => {
    console.log("handleStartQuiz triggered");
    // Seleccionar 5 preguntas aleatorias
    const randomQuestions = getRandomQuestions(quizQuestions, 5);
    setSelectedQuestions(randomQuestions);
    setQuizState('active');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setIsAnswered(false);
    setShowConfirmModal(false);
  };

  const answerQuestion = (answer: string) => {
    console.log(`Answer selected: ${answer}`);
    setUserAnswers([...userAnswers, answer]);
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    console.log("nextQuestion triggered");
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(false);
    } else {
      setQuizState('results');
    }
  };

  const exitQuiz = () => {
    console.log("exitQuiz triggered");
    setQuizState('inactive');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setIsAnswered(false);
    setSelectedQuestions([]);
  };

  const closeResults = () => {
    console.log("closeResults triggered");
    setQuizState('inactive');
    setSelectedQuestions([]);
  };

  if (!quizQuestions || quizQuestions.length === 0) {
    console.log("No quiz questions available - rendering error message");
    return (
      <Card className="shadow-md border-none bg-gradient-to-br from-purple-500/10 to-pink-500/10">
        <CardHeader className="text-lg sm:text-xl font-semibold">Quiz Activity</CardHeader>
        <CardBody>
          <p className="text-sm sm:text-base text-red-500">Error: No quiz questions available.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      {quizState === 'inactive' && (
        <Card className="shadow-md border-none bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardHeader className="text-lg sm:text-xl font-semibold">Quiz Activity</CardHeader>
          <CardBody>
            <Button onClick={startQuiz} className="w-full bg-primary text-white text-sm sm:text-base">
              Start Quiz!
            </Button>
          </CardBody>
        </Card>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Start Quiz</h3>
            <p className="text-sm sm:text-base mb-4">
              Are you ready to start the quiz? It has 5 English grammar questions.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  console.log("Cancel modal clicked");
                  setShowConfirmModal(false);
                }}
                className="text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleStartQuiz}
                className="text-sm sm:text-base"
              >
                Yes, Start!
              </Button>
            </div>
          </div>
        </div>
      )}

      {quizState === 'active' && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <Button
            onClick={exitQuiz}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white/80 shadow-sm"
          >
            <Icon icon="lucide:x" className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Question {currentQuestion + 1}: {selectedQuestions[currentQuestion].question}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {selectedQuestions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  onClick={() => answerQuestion(option)}
                  disabled={isAnswered}
                  className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
                    isAnswered
                      ? option === selectedQuestions[currentQuestion].correctAnswer
                        ? "bg-green-500 text-white"
                        : option === userAnswers[currentQuestion]
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                      : "bg-blue-100 hover:bg-blue-200"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
            {isAnswered && (
              <div className="mt-4">
                <p className="text-gray-700 italic text-sm sm:text-base">
                  {selectedQuestions[currentQuestion].explanation}
                </p>
                <Button
                  onClick={nextQuestion}
                  className="mt-4 bg-primary text-white text-sm sm:text-base"
                >
                  {currentQuestion < selectedQuestions.length - 1 ? "Next" : "Finish"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {quizState === 'results' && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-2xl w-full">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Quiz Results</h2>
            <p className="text-sm sm:text-base mb-4">
              You scored {selectedQuestions.filter((q, i) => q.correctAnswer === userAnswers[i]).length} out of {selectedQuestions.length} correct.
            </p>
            <ul className="space-y-2 max-h-64 overflow-y-auto text-xs sm:text-sm">
              {selectedQuestions.map((q, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate">{q.question}</span>
                  <span className={q.correctAnswer === userAnswers[i] ? "text-green-500" : "text-red-500"}>
                    {userAnswers[i]} {q.correctAnswer === userAnswers[i] ? "✓" : "✗"}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              onClick={closeResults}
              className="mt-4 bg-primary text-white text-sm sm:text-base"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};