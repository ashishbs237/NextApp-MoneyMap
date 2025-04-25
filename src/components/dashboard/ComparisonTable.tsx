import React from "react"
import { Card, CardContent } from "@/components/ui/card"

const ComparisonTable = ({ data, principalAmt }) => {
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
                <td className="px-4 py-2 border font-medium">{item.strategy}</td>
                <td className="px-4 py-2 border">₹{principalAmt.toLocaleString()}</td>
                <td className="px-4 py-2 border">₹{item.totalInterestPaid.toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  ₹{item.totalAmountPaid.toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{item.loanDurationMonths}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default ComparisonTable
