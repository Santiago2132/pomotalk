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
  const BREAK_TIME = 5 * 60; // 5 minutes in seconds
  const [workDuration, setWorkDuration] = React.useState<number>(25 * 60); // Default to 25 minutes
  const [timeLeft, setTimeLeft] = React.useState<number>(workDuration);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<TimerMode>("work");
  const [endTime, setEndTime] = React.useState<number | null>(null);
  const [session, setSession] = React.useState<TimerSession>(() => {
    const savedSession = localStorage.getItem("pomodoroSession");
    return savedSession 
      ? JSON.parse(savedSession) 
      : { completedPomodoros: 0, startTime: null };
  });

  // Update timeLeft when mode or workDuration changes and timer is not active
  React.useEffect(() => {
    if (!isActive) {
      setTimeLeft(mode === "work" ? workDuration : BREAK_TIME);
    }
  }, [mode, workDuration, isActive]);

  // Timer logic using system time
  React.useEffect(() => {
    if (isActive && endTime) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          handleTimerComplete();
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isActive, endTime]);

  const handleTimerComplete = () => {
    const audio = new Audio("/notification.wav");
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    if (mode === "work") {
      const updatedSession = {
        ...session,
        completedPomodoros: session.completedPomodoros + 1,
      };
      setSession(updatedSession);
      localStorage.setItem("pomodoroSession", JSON.stringify(updatedSession));
      setMode("break");
      setTimeLeft(BREAK_TIME);
      onCycleComplete();
    } else {
      setMode("work");
      setTimeLeft(workDuration);
    }
    setIsActive(false);
    setEndTime(null);
  };

  const toggleTimer = () => {
    if (!isActive) {
      if (!session.startTime) {
        setSession({ ...session, startTime: Date.now() });
      }
      setEndTime(Date.now() + timeLeft * 1000);
      setIsActive(true);
    } else {
      setIsActive(false);
      if (endTime) {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("work");
    setTimeLeft(workDuration);
    setEndTime(null);
  };

  const totalTime = mode === "work" ? workDuration : BREAK_TIME;
  const progress = isActive ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
          {!isActive && (
            <div className="flex justify-center gap-2 mb-4">
              {[15, 25, 40].map((min) => (
                <Button
                  key={min}
                  onPress={() => setWorkDuration(min * 60)}
                  color={workDuration === min * 60 ? "primary" : "default"}
                  variant={workDuration === min * 60 ? "solid" : "bordered"}
                >
                  {min} min
                </Button>
              ))}
            </div>
          )}
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