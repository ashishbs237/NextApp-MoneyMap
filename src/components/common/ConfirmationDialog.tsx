import React from 'react';
import { X } from 'lucide-react'; // Optional icon lib, or replace with raw SVG

type Variant = 'save' | 'update' | 'delete' | 'info';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    variant: Variant;
    information?: string;
}

const VARIANT_CONFIG = {
    save: {
        title: 'Save Confirmation',
        message: 'Are you sure you want to save?',
        headerColor: 'bg-blue-100 text-blue-800',
        buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    update: {
        title: 'Update Confirmation',
        message: 'Are you sure you want to update?',
        headerColor: 'bg-yellow-100 text-yellow-800',
        buttonColor: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    },
    delete: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete?',
        headerColor: 'bg-red-100 text-red-800',
        buttonColor: 'bg-red-600 hover:bg-red-700 text-white',
    },
    info: {
        title: 'Information',
        message: 'Are you sure you want to delete?',
        headerColor: 'bg-blue-100 text-blue-800',
        buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',

    }
};

export default function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    variant,
    information
}: ConfirmationDialogProps) {
    if (!open) return null;

    const { title, message, headerColor, buttonColor } = VARIANT_CONFIG[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className={`flex justify-between items-center px-4 py-3 rounded-t-md ${headerColor}`}>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-xl font-bold hover:text-gray-600 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Message */}
                <div className="px-5 py-4">
                    <p className="text-gray-700">{information ? information : message}</p>
                </div>

                {/* Divider */}
                <hr className="border-t border-gray-200" />

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 px-5 py-3">
                    {
                        variant !== 'info' ? (<>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm?.();
                                    onClose();
                                }}
                                className={`px-4 py-2 rounded-md ${buttonColor} cursor-pointer`}
                            >
                                {variant === 'update' ? 'Update' : variant.charAt(0).toUpperCase() + variant.slice(1)}
                            </button>
                        </>) : (<button
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 cursor-pointer"
                        >
                            Okay
                        </button>)
                    }

                </div>
            </div>
        </div>
    );
}
