import React, { useState } from 'react';

type RowData = {
    _id?: string | number;
    [key: string]: any;
};

export type ColumnDefinition = {
    label: string;
    accessor: string;
    renderCell?: (row: RowData) => React.ReactNode;
};

type SKDataTableProps = {
    columns: ColumnDefinition[];
    rows: RowData[];
    totalSelectedRows?: number;
    onDeleteSelected?: (ids: (string | number)[]) => void;
    checkBoxSelection?: boolean;
    alternateRowColors?: [string, string]; // [even, odd]
};

const SKDataTable: React.FC<SKDataTableProps> = ({
    columns,
    rows,
    checkBoxSelection = false,
    alternateRowColors = ['bg-white', 'bg-gray-50']
}) => {
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

    const handleSelectRow = (id: string | number) => {
        const updatedSelection = new Set(selectedRows);
        if (updatedSelection.has(id)) {
            updatedSelection.delete(id);
        } else {
            updatedSelection.add(id);
        }
        setSelectedRows(updatedSelection);
    };

    return (
        // <div className="w-full bg-white rounded-lg shadow-md p-4">
        <div>
            {/* Table */}
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 border-b">
                        <tr >
                            {
                                checkBoxSelection && <th className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            if (selectedRows.size === rows.length) {
                                                setSelectedRows(new Set());
                                            } else {
                                                setSelectedRows(new Set(rows.map((row) => row._id)));
                                            }
                                        }}
                                    />
                                </th>
                            }
                            {columns.map((column, index) => (
                                <th key={index} className="px-4 py-2 ">
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => {
                            const isSelected = selectedRows.has(row._id);
                            const rowColor = isSelected
                                ? 'bg-gray-200'
                                : index % 2 === 0
                                    ? alternateRowColors[0]
                                    : alternateRowColors[1];

                            return (
                                <tr key={row._id} className={`hover:bg-gray-300 ${rowColor}`}>
                                    {
                                        checkBoxSelection &&
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(row._id)}
                                            />
                                        </td>
                                    }
                                    {columns.map((column) => (
                                        <td key={column.accessor} className="px-4 py-2">
                                            {column.renderCell ? column.renderCell(row) : row[column.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2 text-sm">
                    <span>Total Rows: {rows.length}</span>
                </div>
            </div>
        </div>
    );
};

export default SKDataTable;
