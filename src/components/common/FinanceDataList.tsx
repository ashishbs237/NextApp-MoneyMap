import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'

const FinanceDataList = ({ rowData, onEdit, onDelete }) => {
  return (
    <div className="h-120 overflow-y-auto border border-gray-200 rounded">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            <th className="p-2 border bg-gray-100 dark:bg-gray-800">#</th>
            <th className="p-2 border bg-gray-100 dark:bg-gray-800">Label</th>
            <th className="p-2 border bg-gray-100 dark:bg-gray-800">Note</th>
            <th className="p-2 border text-center w-0 bg-gray-100 dark:bg-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rowData.length > 0 ? (
            rowData.map((item, idx) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="p-1.5 border">{idx + 1}</td>
                <td className="p-1.5 border">{item.label}</td>
                <td className="p-1.5 border">{item.note}</td>
                <td className="p-1.5 border text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:opacity-80 p-1 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => item._id && onDelete(item)}
                      className="text-red-600 hover:opacity-80 p-1 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default FinanceDataList
