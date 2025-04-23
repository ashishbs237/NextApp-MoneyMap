import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ["#82ca9d", "#8884d8"]

const SKPieChart = ({ chartData = [], totalInterest = 0 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            // cx="50%"
                            // cy="50%"
                            label
                        >
                            {chartData.map((entry, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-3">
                {/* <div className="space-y-1">
                    <p className="text-sm text-gray-600">💳 EMI</p>
                    <p className="text-lg font-bold">₹{emi.toFixed(0)}</p>
                </div> */}
                <div className="space-y-1">
                    <p className="text-sm text-gray-600">💰 Total Interest</p>
                    <p className="text-lg font-bold">₹{totalInterest.toFixed(0)}</p>
                </div>
                {/* <div className="space-y-1">
                    <p className="text-sm text-gray-600">⏱ Interest Saved</p>
                    <p className="text-lg font-bold">{originalMonths - newMonths} months</p>
                </div> */}
            </div>
        </div>
    )
}

export default SKPieChart