import { useState, useEffect, useCallback } from 'react';
import { timeLeft } from './format-helper';

const useRealTimeRemaining = (terminateAt: string) => {
    const expiresIn = useCallback((date: string) => timeLeft(date), []);
    const [remainingTime, setRemainingTime] = useState(expiresIn(terminateAt));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRemainingTime(expiresIn(terminateAt));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [terminateAt]);

    return remainingTime;
};

export default useRealTimeRemaining;
