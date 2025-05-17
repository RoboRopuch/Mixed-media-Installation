import React, { createContext, useContext, useEffect, useState } from 'react';
import {getItem, setItem} from "./utils/localStorage.ts";
import {PROBABILITY_RANGES_KEY} from "./constants.ts";

export type Row = {
    id: string;
    min: number;
    max: number;
    probability: number };

type RowContextType = {
    rows: Row[];
    setRows: (rows: Row[]) => void;
};

const RowContext = createContext<RowContextType | null>(null);


export const RowProvider = ({ children } : {children : React.ReactNode}) => {
    const [rows, setRows] = useState<Row[]>([{id:'default', min: 1, max: 100, probability: 1 }]);

    useEffect(() => {
        const local = getItem(PROBABILITY_RANGES_KEY);
        console.log(local);
        console.log(typeof local);
        if (local) {
            setRows(local);
        }
    }, []);

    // Write to localStorage whenever Rows change
    useEffect(() => {
        if (rows.length === 0) {
            return;
        }
        setItem(PROBABILITY_RANGES_KEY, rows); // Pass rows array directly, without stringifying here
    }, [rows]);

    return (
        <RowContext.Provider value={{ rows, setRows }}>
            {children}
        </RowContext.Provider>
    );
};

export const useRowContext = () => {
    const context = useContext(RowContext);
    if (!context) throw new Error("useRowContext must be used within RowProvider");
    return context;
};
