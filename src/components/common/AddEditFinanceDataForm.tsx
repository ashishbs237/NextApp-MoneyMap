import React, { useEffect, useState } from 'react';
import { Plus, Save } from "lucide-react";

interface Data {
    label: string;
    note: string
}

const AddEditFinanceDataForm = ({ onSubmit, ref, editData }) => {
    const [data, setData] = useState<Data>({
        label: editData?.label || '',
        note: editData?.note || ''
    });

    useEffect(() => {
        if (editData) {
            setData({
                label: editData?.label,
                note: editData?.note
            });
        }
    }, [editData]);

    const handleChange = (key: string, value: string) => {
        setData({ ...data, [key]: value })
    }

    const handleSubmit = () => {
        onSubmit(data);
        setData({ label: '', note: '' })
    }

    return (
        <div className="mb-4 space-y-4">
            <div className="flex gap-4">
                <input
                    type="text"
                    ref={ref}
                    placeholder="Label"
                    value={data.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                    required
                    className="px-2 py-1 border border-gray-300 rounded-md w-1/2"
                />
                <input
                    type="text"
                    placeholder="Note"
                    value={data.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md w-1/2"
                />
                <button
                    onClick={() => handleSubmit()}
                    className="bg-[var(--accent)] text-white px-6 py-2 rounded hover:opacity-90 flex items-center gap-2 cursor-pointer"
                >
                    {editData ? (
                        <>
                            <Save size={16} /> Update
                        </>
                    ) : (
                        <>
                            <Plus size={16} /> Add
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddEditFinanceDataForm