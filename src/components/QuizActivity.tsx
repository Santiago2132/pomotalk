import React from "react";
import { Card, CardBody, CardHeader, Button, Modal } from "@heroui/react";
import { motion } from "framer-motion";
import { quizQuestions } from "../data/quizQuestions";

export const QuizActivity: React.FC = () => {
  const [quizState, setQuizState] = React.useState<'inactive' | 'active' | 'results'>('inactive');
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<string[]>([]);
  const [isAnswered, setIsAnswered] = React.useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);

  const startQuiz = () => setShowConfirmModal(true);

  const handleStartQuiz = () => {
    setQuizState('active');
    setCurrentQuestion(0);
    setUserAnswers([]);
    setIsAnswered(false);
    setShowConfirmModal(false);
  };

  const answerQuestion = (answer: string) => {
    setUserAnswers([...userAnswers, answer]);
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(false);
    } else {
      setQuizState('results');
    }
  };

  const closeResults = () => setQuizState('inactive');

  if (quizState === 'inactive') {
    return (
      <>
        <Card className="shadow-md border-none bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardHeader className="text-xl font-semibold">Quiz Activity</CardHeader>
          <CardBody>
            <Button onClick={startQuiz} className="w-full bg-primary text-white">
              Start Quiz!
            </Button>
          </CardBody>
        </Card>
        {showConfirmModal && (
          <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
            <h3 className="text-lg font-bold">Start Quiz</h3>
            <p>Are you ready to start the quiz? It has 15 English grammar questions.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowConfirmModal(false)}>Cancel</Button>
              <Button color="primary" onClick={handleStartQuiz}>Yes, Start!</Button>
            </div>
          </Modal>
        )}
      </>
    );
  } else if (quizState === 'active') {
    const question = quizQuestions[currentQuestion];
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">{`Question ${currentQuestion + 1}: ${question.question}`}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option) => (
              <Button
                key={option}
                onClick={() => answerQuestion(option)}
                disabled={isAnswered}
                className={`w-full text-base sm:text-lg ${
                  isAnswered
                    ? option === question.correctAnswer
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
              <p className="text-gray-700 italic text-sm sm:text-base">{question.explanation}</p>
              <Button onClick={nextQuestion} className="mt-4 bg-primary text-white">
                {currentQuestion < quizQuestions.length - 1 ? "Next" : "Finish"}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  } else {
    const score = quizQuestions.filter((q, i) => q.correctAnswer === userAnswers[i]).length;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Quiz Results</h2>
          <p className="text-base sm:text-lg mb-4">{`You scored ${score} out of ${quizQuestions.length} correct.`}</p>
          <ul className="space-y-2 max-h-64 overflow-y-auto text-sm sm:text-base">
            {quizQuestions.map((q, i) => (
              <li key={i} className="flex justify-between">
                <span>{q.question}</span>
                <span className={q.correctAnswer === userAnswers[i] ? "text-green-500" : "text-red-500"}>
                  {userAnswers[i]} {q.correctAnswer === userAnswers[i] ? "✓" : "✗"}
                </span>
              </li>
            ))}
          </ul>
          <Button onClick={closeResults} className="mt-4 bg-primary text-white">Close</Button>
        </div>
      </motion.div>
    );
  }
};