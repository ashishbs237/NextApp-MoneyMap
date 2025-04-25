import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LoanInput } from '@/utils/ui/loanCalculation';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';


const InputData = ({ onCalculate, }) => {

    const [target, setTarget] = useState(5000000);
    const [downPayment, setDownPayment] = useState(1000000);
    const [data, setData] = useState<LoanInput>({
        loanAmount: 4000000,
        annualInterestRate: 8.5,
        tenureYears: 20,
        extraEMIsPerYear: 1,
        repaymentAmount: 100000,
        repaymentFrequencyMonths: 6,
    });

    const handleChange = (key: keyof LoanInput, value: string) => {
        setData({ ...data, [key]: Number(value) });
    };

    const handleCalculate = () => {
        onCalculate(data);
    }
    return (
        <Card className="p-0">
            <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <Label>🎯 Target Price</Label>
                        <Input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 10,00,000"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>💰 Downpayment : ₹{downPayment}</Label>
                        <Slider
                            className="mt-4"
                            min={0}
                            max={target}
                            step={1000}
                            value={[downPayment]}
                            onValueChange={(value) => {
                                setDownPayment(value[0]);
                                handleChange("loanAmount", (target - value[0]).toString());
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>📉 Loan Amount (Auto)</Label>
                        <Input
                            value={data.loanAmount}
                            readOnly placeholder="Loan Amount (₹)"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>📈 Interest Rate (Annual %)</Label>
                        <Input
                            value={data.annualInterestRate}
                            onChange={(e) => handleChange("annualInterestRate", e.target.value)}
                            type="number"
                            placeholder="Interest Rate (%)"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>📅 Loan Tenure (Years)</Label>
                        <Input
                            type="number"
                            value={data.tenureYears}
                            onChange={(e) => handleChange("tenureYears", e.target.value)} placeholder="Tenure (years)"
                        />
                    </div>
                </div>

                <hr />

                <h6 className="text-lg font-bold">Interest Saving Tactics</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <Label>⚡ Extra Monthly Payment (Optional)</Label>
                        <Input
                            type="number"
                            value={data.extraEMIsPerYear || 0}
                            onChange={(e) => handleChange("extraEMIsPerYear", e.target.value)} placeholder="Extra EMIs/Year"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>⚡ Repayment Amount (Optional)</Label>
                        <Input
                            type="number"
                            value={data.repaymentAmount || 0}
                            onChange={(e) => handleChange("repaymentAmount", e.target.value)} placeholder="Lump Sum Amount (₹)"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>⚡ Repayment Frequency (Optional)</Label>
                        <Input
                            type="number"
                            value={data.repaymentFrequencyMonths || 0}
                            onChange={(e) => handleChange("repaymentFrequencyMonths", e.target.value)}
                            placeholder="Lump Sum Every (months)"
                        />
                    </div>
                </div>
                <Button onClick={handleCalculate}>Compare Strategies</Button>
            </CardContent>
        </Card>
    )
}

export default InputData