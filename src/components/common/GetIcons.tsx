'use client';

import React from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';


const tabIcons = {
    Home: 'home',
    Income: 'money-bag', // You can pick appropriate icons from Lucid React's library
    Expense: 'money-out', // Change as per availability
    Investment: 'growth',
    EMI: 'receipt',
    Forecast: 'chart-line',
};

const GetIcons = ({ screenName, size, color }: { screenName; size: number; color: string }) => {
    return (
        <DynamicIcon name={tabIcons[screenName]} size={size} color={color} />
    );
};

export default GetIcons;