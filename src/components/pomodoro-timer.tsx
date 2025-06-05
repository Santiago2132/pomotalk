import React from "react";
import { Card, CardBody, CardHeader, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface PomodoroTimerProps {
  onCycleComplete: () => void;
}

type TimerMode = "work" | "break";

interface TimerSession {
  completedPomodoros: number;
  startTime: number | null;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onCycleComplete }) => {
  const WORK_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60; // 5 minutes in seconds

  const [timeLeft, setTimeLeft] = React.useState<number>(WORK_TIME);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<TimerMode>("work");
  const [session, setSession] = React.useState<TimerSession>(() => {
    const savedSession = localStorage.getItem("pomodoroSession");
    return savedSession 
      ? JSON.parse(savedSession) 
      : { completedPomodoros: 0, startTime: null };
  });

  const intervalRef = React.useRef<number | null>(null);

  // Calculate progress percentage
  const totalTime = mode === "work" ? WORK_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    if (mode === "work") {
      // Update completed pomodoros
      const updatedSession = {
        ...session,
        completedPomodoros: session.completedPomodoros + 1,
      };
      setSession(updatedSession);
      localStorage.setItem("pomodoroSession", JSON.stringify(updatedSession));
      
      // Switch to break mode
      setMode("break");
      setTimeLeft(BREAK_TIME);
      onCycleComplete(); // Trigger quote change
    } else {
      // Switch back to work mode
      setMode("work");
      setTimeLeft(WORK_TIME);
    }
  };

  // Timer logic
  React.useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, mode]);

  // Save session to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem("pomodoroSession", JSON.stringify(session));
  }, [session]);

  // Start/pause timer
  const toggleTimer = () => {
    if (!isActive && !session.startTime) {
      // Starting a new session
      setSession({
        ...session,
        startTime: Date.now(),
      });
    }
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md border-none overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <CardHeader className="flex flex-col gap-1 pb-0">
          <h2 className="text-xl font-semibold text-center">
            {mode === "work" ? "Study Time" : "Break Time"}
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-4">
          <div className="w-full flex justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={mode === "work" ? "#3b82f6" : "#8b5cf6"}
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="timer-text text-4xl font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              color={isActive ? "danger" : "primary"}
              variant="flat"
              onPress={toggleTimer}
              startContent={
                <Icon icon={isActive ? "lucide:pause" : "lucide:play"} width={20} />
              }
            >
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button
              color="default"
              variant="light"
              onPress={resetTimer}
              startContent={<Icon icon="lucide:refresh-cw" width={20} />}
            >
              Reset
            </Button>
          </div>

          <div className="w-full mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Completed Pomodoros</span>
              <span className="font-semibold">{session.completedPomodoros}</span>
            </div>
            <Progress 
              aria-label="Completed pomodoros" 
              value={session.completedPomodoros % 4 * 25} 
              color="primary"
              className="h-2"
            />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};