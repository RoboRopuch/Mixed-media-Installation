export type Range = {
    min: number;
    max: number;
    probability: number;
};

export function drawFromRanges(ranges: Range[]): number {
    // Step 1: normalize probabilities
    const total = ranges.reduce((sum, r) => sum + r.probability, 0);
    const normalized = ranges.map(r => ({ ...r, probability: r.probability / total }));

    // Step 2: pick range by weight
    const rand = Math.random();
    let acc = 0;
    for (const r of normalized) {
        acc += r.probability;
        if (rand <= acc) {
            // Step 3: draw number from this range
            return Math.floor(Math.random() * (r.max - r.min + 1)) + r.min;
        }
    }

    // Fallback (floating point issue)
    const last = normalized[normalized.length - 1];
    return Math.floor(Math.random() * (last.max - last.min + 1)) + last.min;
}
