import { useRangeContext } from "../../context.tsx";
import React from "react";

type SummaryProps = React.HTMLAttributes<HTMLDivElement>;

function Summary(props: SummaryProps) {
    const { ranges } = useRangeContext();

    if (!ranges) {
        return <div {...props}>Error: No ranges available</div>;
    }

    const totalProbability = ranges.reduce((acc, cur) => acc + cur.probability, 0);

    return (
        <div {...props}>
            <h2>Summary</h2>
            <p>Total Probability: <strong>{totalProbability.toFixed(2)}</strong></p>
        </div>
    );
}

export default Summary;
