import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface AppTimerProps {
  startedAt: string;
  timeLimit: number;
}

const TimerContainer = styled.div`
  font-family: var(--font-family);
  color: var(--text-color);
  font-size: 1rem;
`;

export const AppTimer: React.FC<AppTimerProps> = ({ startedAt, timeLimit }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('00:00:00');

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const startTimer = () => {
      if (startedAt && timeLimit > 0) {
        const startTime = new Date(startedAt).getTime();
        const endTime = startTime + timeLimit * 60 * 1000;

        timerId = setInterval(() => {
          const currentTime = Date.now();
          const timeDiff = Math.max(0, endTime - currentTime);

          if (timeDiff <= 0) {
            setTimeRemaining('00:00:00');
            clearInterval(timerId);
          } else {
            setTimeRemaining(formatTimeRemaining(timeDiff));
          }
        }, 1000);
      } else {
        setTimeRemaining('00:00:00');
      }
    };

    startTimer();

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [startedAt, timeLimit]);

  const formatTimeRemaining = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return days > 0 
      ? `${days} day(s) ${padNumber(hours)}h : ${padNumber(minutes)}m : ${padNumber(seconds)}s`
      : `${padNumber(hours)}h : ${padNumber(minutes)}m : ${padNumber(seconds)}s`;
  };

  const padNumber = (num: number): string => {
    return num < 10 ? '0' + num : num.toString();
  };

  return (
    <TimerContainer>
      {timeRemaining}
    </TimerContainer>
  );
}; 