import { useState } from "react";
import { Row, useRowContext } from "../../context";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PlusOneOutlinedIcon from "@mui/icons-material/PlusOneOutlined";
import SaveIcon from "@mui/icons-material/Save";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {setItem, wipeItem} from "../../utils/localStorage.ts";
import {BEST_SCORES_KEY, PROBABILITY_RANGES_KEY} from "../../constants.ts";

const uid = function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createRandomRow = (): Row => {
    return { id: uid(), min: 0, max: 0, probability: 0 };
};

function SettingsPage() {
    const { rows, setRows } = useRowContext();
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
        open: false,
        message: "",
        severity: "info"
    });
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    if (!rows) return null;

    // Function to validate a row
    const validateRow = (row: Row): { valid: boolean; message?: string } => {
        if (row.min > row.max) {
            return { valid: false, message: "Min value cannot be greater than Max value" };
        }

        if (row.probability < 0 || row.probability > 1) {
            return { valid: false, message: "Probability must be between 0 and 1" };
        }

        // Calculate total probability excluding this row
        const otherRowsTotal = rows
            .filter(r => r.id !== row.id)
            .reduce((acc, cur) => acc + cur.probability, 0);

        if (otherRowsTotal + row.probability > 1) {
            return {
                valid: false,
                message: `Total probability cannot exceed 1. Current total: ${otherRowsTotal.toFixed(2)}, Available: ${(1 - otherRowsTotal).toFixed(2)}`
            };
        }

        return { valid: true };
    };

    // Handle row update
    const handleUpdateRow = (
        newRow: Row,
        oldRow: Row
    ): Row => {
        if (!rows?.length) return oldRow;

        // Validate the new row
        const validation = validateRow(newRow);

        if (!validation.valid) {
            setSnackbar({
                open: true,
                message: validation.message || "Invalid row data",
                severity: "error"
            });
            return oldRow; // Reject the change
        }

        // Update the row
        const updated = rows.map(row =>
            row.id === newRow.id ? newRow : row
        );

        // Mark that we have unsaved changes
        setUnsavedChanges(true);

        // Update the temporary state
        setRows(updated);

        return newRow;
    };

    // Handle adding a new row
    const handleAddRow = () => {
        const newRow = createRandomRow();
        const updated = [...rows, newRow];
        setRows(updated);
        setUnsavedChanges(true);
    };

    // Handle deleting a row
    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
        setUnsavedChanges(true);
    };

    // Handle saving the distribution
    const handleSaveDistribution = () => {
        // Here you would typically save to localStorage, a database, or an API
        // For this example, I'm just marking the changes as saved

        // Validate the entire distribution
        const totalProbability = rows.reduce((acc, row) => acc + row.probability, 0);

        if (totalProbability > 1) {
            setSnackbar({
                open: true,
                message: `Cannot save: Total probability (${totalProbability.toFixed(2)}) exceeds 1`,
                severity: "error"
            });
            return;
        }

        // Save to localStorage as an example
        setItem(PROBABILITY_RANGES_KEY, rows);

        setUnsavedChanges(false);
        setSnackbar({
            open: true,
            message: "Distribution saved successfully!",
            severity: "success"
        });
    };

    const handleWipeBestScores = () => {
        wipeItem(BEST_SCORES_KEY);
    }

    // Handle closing the snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // DataGrid columns definition
    const columns: GridColDef[] = [
        {
            field: 'min',
            headerName: 'Min',
            width: 90,
            editable: true,
            type: 'number',
        },
        {
            field: 'max',
            headerName: 'Max',
            width: 90,
            editable: true,
            type: 'number',
        },
        {
            field: 'probability',
            headerName: 'Probability',
            width: 120,
            editable: true,
            type: 'number',
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 120,
            cellClassName: "actions",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />
                ];
            }
        }
    ];

    // Prepare data for treemap visualization
    const treemapData = rows.map((range) => ({
        id: range.id,
        name: `${range.min}-${range.max}`,
        size: range.probability,
        fill: range.probability > 0 ? "#82ca9d" : "#f5f5f5" // Different color for zero probability
    }));

    // Calculate the total probability
    const totalProbability = rows.reduce((acc, row) => acc + row.probability, 0);

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Probability Distribution Editor</h2>
                <div>
                    <span style={{ marginRight: '1rem', color: totalProbability > 1 ? 'red' : 'inherit' }}>
                        Total Probability: {totalProbability.toFixed(2)}/1.00
                    </span>
                    {totalProbability > 1 && (
                        <span style={{ color: 'red', fontWeight: 'bold', marginRight: '1rem' }}>
                            ⚠️ Exceeds maximum!
                        </span>
                    )}
                </div>
            </div>

            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    startIcon={<PlusOneOutlinedIcon />}
                    onClick={handleAddRow}
                >
                    Add Range
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDistribution}
                    disabled={!unsavedChanges}
                >
                    Save Distribution
                </Button>
                <Button
                    onClick={handleWipeBestScores}
                >
                    Clear best scores
                </Button>
            </Stack>

            <div style={{ height: '500px', display: "flex", justifyContent: "space-between", gap: '2rem' }}>
                <DataGrid
                    style={{ flex: 1 }}
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    processRowUpdate={handleUpdateRow}
                    getRowId={(row) => row.id}
                    onProcessRowUpdateError={(error) => {
                        setSnackbar({
                            open: true,
                            message: error.message,
                            severity: "error"
                        });
                    }}
                />
                <div style={{
                    width: '50%',
                    height: '100%',
                    borderRadius: '0.25rem',
                    overflow: 'hidden',
                    border: '1px solid #ddd'
                }}>
                    <ResponsiveContainer>
                        <Treemap
                            data={treemapData}
                            dataKey="size"
                            nameKey="name"
                            stroke="#fff"
                            fill="#82ca9d"
                            aspectRatio={1 / 1}
                        >
                            <Tooltip
                                formatter={(value) => [`Probability: ${Number(value).toFixed(2)}`, 'Value']}
                                labelFormatter={(label) => `Range: ${label}`}
                            />
                        </Treemap>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Information about remaining probability */}
            <div style={{
                padding: '1rem',
                backgroundColor: '#f8f8f8',
                borderRadius: '4px',
                border: '1px solid #ddd'
            }}>
                <p>Remaining probability: <strong>{(1 - totalProbability).toFixed(2)}</strong></p>
                <p>Remember that the total probability across all ranges should not exceed 1.0</p>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SettingsPage;