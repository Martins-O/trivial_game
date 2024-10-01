import React, { useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

interface Props {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onTimeUp: () => void;
}

const Timer: React.FC<Props> = ({ timeLeft, setTimeLeft, onTimeUp }) => {
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onTimeUp();
    }
  }, [timeLeft, setTimeLeft, onTimeUp]);

  return (
    <TimerContainer>
      Time left: {timeLeft} seconds
    </TimerContainer>
  );
};

export default Timer;