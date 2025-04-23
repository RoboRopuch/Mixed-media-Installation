import { useEffect, useState } from "react";

type Range = {
    min: number;
    max: number;
    probability: number;
};


export function useProbabilityRanges() {
    const [ranges, setRanges] = useState<Range[] | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/probabilityRanges.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load probability data");
                return res.json();
            })
            .then(setRanges)
            .catch((err) => setError(err.message));
    }, []);

    return { ranges, error, isLoading: !ranges && !error };
}
