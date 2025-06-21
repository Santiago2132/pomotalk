import React from "react";
import { Navbar, NavbarBrand } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PomodoroTimer } from "./components/pomodoro-timer";
import { MotivationalQuote } from "./components/motivational-quote";
import { GrammarContent } from "./components/grammar-content";
import { QuizActivity } from "./components/QuizActivity";

const App: React.FC = () => {
  const [cycleCompleted, setCycleCompleted] = React.useState<boolean>(false);

  const handleCycleComplete = () => {
    setCycleCompleted(true);
    setTimeout(() => setCycleCompleted(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <NavbarBrand>
          <Icon icon="lucide:clock" className="text-primary text-2xl mr-2" />
          <p className="font-bold text-inherit text-xl">PomoTalk</p>
        </NavbarBrand>
      </Navbar>

      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Pomodoro Timer Section */}
          <div className="lg:col-span-3">
            <PomodoroTimer onCycleComplete={handleCycleComplete} />
          </div>

          {/* Grammar Content Section */}
          <div className="lg:col-span-6">
            <GrammarContent />
          </div>

          {/* Motivational Quote and Quiz Activity Section */}
          <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
            <MotivationalQuote cycleCompleted={cycleCompleted} />
            <QuizActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;