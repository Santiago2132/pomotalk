import React from "react";
import { Navbar, NavbarBrand } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PomodoroTimer } from "./components/pomodoro-timer";
import { MotivationalQuote } from "./components/motivational-quote";
import { GrammarContent } from "./components/grammar-content";

const App: React.FC = () => {
  const [cycleCompleted, setCycleCompleted] = React.useState<boolean>(false);

  const handleCycleComplete = () => {
    setCycleCompleted(true);
    // Reset the flag after triggering the quote change
    setTimeout(() => setCycleCompleted(false), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-10">
      <Navbar className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <NavbarBrand>
          <Icon icon="lucide:clock" className="text-primary text-2xl mr-2" />
          <p className="font-bold text-inherit text-xl">PomoTalk</p>
        </NavbarBrand>
      </Navbar>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pomodoro Timer Section */}
          <div className="lg:col-span-3">
            <PomodoroTimer onCycleComplete={handleCycleComplete} />
          </div>

          {/* Grammar Content Section */}
          <div className="lg:col-span-6">
            <GrammarContent />
          </div>

          {/* Motivational Quote Section */}
          <div className="lg:col-span-3">
            <MotivationalQuote cycleCompleted={cycleCompleted} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;