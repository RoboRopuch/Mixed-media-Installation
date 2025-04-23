import { useRangeContext } from "../../context";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Summary from "./probabilitySummary.tsx";
import {useRef} from "react";

const columns: GridColDef[] = [
    { field: 'min', headerName: 'Min', width: 90, editable: true, type: 'number' },
    { field: 'max', headerName: 'Max', width: 150, editable: true, type: 'number' },
    { field: 'probability', headerName: 'Probability', width: 150, editable: true, type: 'number' },
];


function SettingsPage() {
    const { ranges, setRanges, isLoading, error } = useRangeContext();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!ranges) return null;

    const probabilitySummary = ranges.reduce((acc, cur) => acc + cur.probability, 0);

    // Transform data for treemap
    const treemapData = ranges.map((range) => ({
        name: `${range.min}-${range.max}`,
        size: range.probability
    }));


    const handleProcessRowUpdate = (newRow, oldRow) => {
        const updated = ranges.map((row) =>
            row.min === oldRow.min && row.max === oldRow.max ? newRow : row
        );

        setRanges(updated);
        return newRow;
    };

    return (
        <div style={{ padding: '2rem' , display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1>Probability Ranges</h1>
            <div style={{ height:'500px',  display: "flex", justifyContent: "space-between", gap: '2rem' }}>
                <DataGrid style={{flex: 1}}
                    getRowId={(row) => `${row.min}-${row.max}`}
                    rows={ranges}
                    columns={columns}
                    checkboxSelection
                    disableRowSelectionOnClick
                    processRowUpdate={handleProcessRowUpdate}
                />
                <div style={{ width: '50%', height:'100%',  borderRadius: '0.25rem', overflow: 'hidden'}}>
                    <ResponsiveContainer >
                        <Treemap
                            data={treemapData}
                            dataKey="size"
                            nameKey="name"
                            stroke="#fff"
                            fill="#82ca9d"
                            aspectRatio={1 / 3}
                        >
                            <Tooltip />
                        </Treemap>
                    </ResponsiveContainer>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '2rem' }}>
                <Summary style={{ backgroundColor: '#D3D3D3', padding: '2rem', borderRadius: '0.25rem' }} />
            </div>
        </div>
    );
}

export default SettingsPage;
