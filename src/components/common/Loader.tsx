'use client';

export default function Loader({ size = 8, color = 'text-gray-600' }: { size?: number; color?: string }) {
    return (
        <div className="flex justify-center items-center py-4">
            <div
                className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
                style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
            ></div>
        </div>
    );
}
