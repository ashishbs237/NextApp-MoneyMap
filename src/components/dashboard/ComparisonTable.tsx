import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const ComparisonTable = ({ data }) => {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-4">
        <table className="min-w-full text-left text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Strategy</th>
              <th className="px-4 py-2 border">Principal</th>
              <th className="px-4 py-2 border">Interest Paid</th>
              <th className="px-4 py-2 border">Total Cost</th>
              <th className="px-4 py-2 border">Time (Months)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border font-medium">{item.name}</td>
                <td className="px-4 py-2 border">₹{item.Principal.toLocaleString()}</td>
                <td className="px-4 py-2 border">₹{item.Interest.toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  ₹{(item.Principal + item.Interest).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{item.Tenure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default ComparisonTable
