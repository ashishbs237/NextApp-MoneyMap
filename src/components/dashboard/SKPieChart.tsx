'use client'

import React, { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { TAB_COLORS } from '../constants/colors';


const COLORS = ["#82ca9d", "#8884d8"];

const strategyStyles = {
    regular: {
        border: '#1976D2',
        gradient: 'bg-gradient-to-r from-blue-600 to-indigo-500',
    },
    extra: {
        border: '#2E7D32',
        gradient: 'bg-gradient-to-r from-green-600 to-emerald-400',
    },
    lump: {
        border: '#F9A825',
        gradient: 'bg-gradient-to-r from-yellow-500 to-amber-400',
    },
    combined: {
        border: '#6A1B9A',
        gradient: 'bg-gradient-to-r from-purple-700 to-fuchsia-400',
    },
};

const SKPieChart = ({ chartData = {} }) => {
    console.log("chartData :", chartData);
    const { border, gradient, bg, text } = strategyStyles?.[chartData?.strategy];
    // const { border, gradient , bg, text } = TAB_COLORS?.[chartData?.strategy];

    const [data, setData] = useState<any>();

    useEffect(() => {
        setData([
            { name: "Principal", value: chartData?.totalAmountPaid - chartData?.totalInterestPaid },
            { name: "Interest", value: chartData?.totalInterestPaid }])
    }, [chartData]);

    const renderCenterLabel = ({ cx, cy }) => {
        const total = data.reduce((acc, cur) => acc + cur.value, 0);
        return (
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={14}>
                <tspan x={cx} dy="-1.4em" fontSize={12} fill="#555">💰</tspan>
                <tspan x={cx} dy="1.1em" fontSize={12} fill="#555">Total Amount Paid</tspan>
                <tspan x={cx} dy="1.2em" fontSize={16} fontWeight="bold">{total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</tspan>
            </text>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;

        return (
            <div style={{
                background: '#1e1e2f',
                borderRadius: 8,
                padding: '10px 12px',
                color: '#fff',
            }}>
                {/* Label styling */}
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>
                    {label}
                </div>

                {/* Payload items */}
                {payload.map((entry, index) => (
                    <div key={index} style={{
                        color: entry.color,
                        fontWeight: 500,
                        fontSize: 14,
                    }}>
                        {entry.name}: {entry.value}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div
            className="grid-col gap-1 items-center rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border"
            style={{ borderColor: border }}
        >
            <div className={`${gradient} text-white px-4 py-2 rounded-t-lg`}>
                <h2 className="font-semibold text-lg capitalize">Strategy</h2>
            </div>
            {/* <div className={`${bg} ${text} px-4 py-2 rounded-t-lg`}>
                <h2 className="font-semibold text-lg capitalize">Strategy</h2>
            </div> */}

            <div className="flex flex-col items-center justify-center h-70">

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx={"50%"}
                            cy={"50%"}
                            startAngle={0}
                            endAngle={360}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            // paddingAngle={5}
                            labelLine={false}
                            dataKey="value"
                            label={renderCenterLabel}
                        >
                            {data?.map((entry, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend margin={{ left: 100, top: 10 }} verticalAlign="bottom" height={36} />
                        {/* <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e1e2f', // dark background
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 0 10px rgba(0,0,0,0.15)',
                            }}
                            itemStyle={{
                                color: '#ffffff',          // font color
                                fontSize: '14px',
                            }}
                            labelStyle={{ color: '#ccc' }} // optional: label text style
                        /> */}
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

            </div>


        </div>
    )
}

export default SKPieChart