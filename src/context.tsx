import React, { createContext, useContext, useEffect, useState } from 'react';

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

const LOCAL_STORAGE_KEY = 'probability_rows';

export const RowProvider = ({ children } : {children : React.ReactNode}) => {
    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
            setRows(JSON.parse(local));
        }
    }, []);

    // Write to localStorage whenever Rows change
    useEffect(() => {
        if (rows.length === 0) {
            return;
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rows));

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
