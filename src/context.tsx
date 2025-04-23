import React, { createContext, useContext, useEffect, useState } from 'react';

export type Range = { min: number; max: number; probability: number };

type RangeContextType = {
    ranges: Range[] | undefined;
    setRanges: React.Dispatch<React.SetStateAction<Range[] | undefined>>;
    isLoading: boolean;
    error: string | null;
};

const RangeContext = createContext<RangeContextType | null>(null);

const LOCAL_STORAGE_KEY = 'probability_ranges';

export const RangeProvider = ({ children }) => {
    const [ranges, setRanges] = useState<Range[] | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
            setRanges(JSON.parse(local));
            setIsLoading(false);
        } else {
            fetch("/probabilityRanges.json")
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to load probability data");
                    return res.json();
                })
                .then(data => {
                    setRanges(data);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                })
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false));
        }
    }, []);

    // Write to localStorage whenever ranges change
    useEffect(() => {
        if (ranges) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ranges));
        }
    }, [ranges]);

    return (
        <RangeContext.Provider value={{ ranges, setRanges, isLoading, error }}>
            {children}
        </RangeContext.Provider>
    );
};

export const useRangeContext = () => {
    const context = useContext(RangeContext);
    if (!context) throw new Error("useRangeContext must be used within RangeProvider");
    return context;
};
