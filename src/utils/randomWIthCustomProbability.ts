import { useRowContext } from "../context.tsx";

export type Range = {
    min: number;
    max: number;
    probability: number;
};

function validateAndNormalizeRanges(ranges: Range[]): Range[] {
    const validRanges = ranges
        .filter(range => range.min <= range.max)
        .map(range => ({
            ...range,
            probability: Math.max(0, Math.min(1, range.probability))
        }));

    if (validRanges.length === 0) {
        throw new Error("No valid ranges provided");
    }

    const total = validRanges.reduce((sum, r) => sum + r.probability, 0);

    if (total === 0) {
        return validRanges.map(r => ({
            ...r,
            probability: 1 / validRanges.length
        }));
    }

    return validRanges.map(r => ({
        ...r,
        probability: r.probability / total
    }));
}

export function drawFromRanges(ranges: Range[]): number {
    try {
        const normalized = validateAndNormalizeRanges(ranges);

        const rand = Math.random();
        let cumulativeProbability = 0;

        for (const range of normalized) {
            cumulativeProbability += range.probability;

            if (rand <= cumulativeProbability) {
                return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            }
        }

        // Fallback: return a value from the last range
        const lastRange = normalized[normalized.length - 1];
        return Math.floor(Math.random() * (lastRange.max - lastRange.min + 1)) + lastRange.min;
    } catch (error) {
        console.error("Error in drawFromRanges:", error);
        return 0;
    }
}

export function useDrawFromRanges(): number {
    const { rows } = useRowContext();
    if (!rows || rows.length === 0) return 0;

    return drawFromRanges(rows);
}
