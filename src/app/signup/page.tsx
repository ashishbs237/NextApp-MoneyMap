// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SKTextInput from "@/components/elements/SKTextInput";
import SKButton from "@/components/elements/SKButton";
import SKHeader from "@/components/common/Header";
import { registerUser } from "@/utils/ui/apiFunctions/authAPI";
import { useToast } from "@/hooks/useToast";


export default function SignupPage() {
    const router = useRouter();
    const { successToast, errorToast } = useToast();
    const [step, setStep] = useState<"signup" | "verify-otp">("signup");

    const [formData, setFormData] = useState({
        name: "Ashish Patel",
        email: "ashish.ansuya@gmail.com",
        password: "12345",
        confirmPassword: "12345",
    });

    const [otp, setOtp] = useState("");
    const [serverOtpId, setServerOtpId] = useState(""); // Optional: to track OTP token/session
    const [error, setError] = useState("");


    const handleOnChange = (key, val) => {
        setFormData({ ...formData, [key]: val })
    }
    const handleSignup = async () => {
        setError("");

        if (formData.password !== formData.confirmPassword) {
            errorToast("Passwords do not match.");
            return;
        }

        try {
            const res = await registerUser(formData);
            if (res.data.isVerified === false) {
                setStep("verify-otp");
                setServerOtpId(res?.data?.otpId); // Optional tracking
            } else {
                setError(res?.data.message || "Signup failed");
            }
        } catch (err) {
            errorToast(err)
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                body: JSON.stringify({ email: formData.email, otp }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                router.push("/login");
            } else {
                setError(data.message || "OTP verification failed");
            }
        } catch (err) {
            setError("Failed to verify OTP.");
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-5 border border-gray-200">
            <SKHeader className={'text-center'} text={step === "signup" ? "Sign Up" : "Verify Email"} />



            {error && <p className="text-red-500 text-sm">{error}</p>}

            {step === "signup" ? (
                <div className="space-y-3">
                    <SKTextInput
                        tabType="default"
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => handleOnChange('name', e.target.value)}
                    />

                    <SKTextInput
                        tabType="default"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleOnChange('email', e.target.value)}
                    />

                    <SKTextInput
                        tabType="default"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => handleOnChange('password', e.target.value)}
                    />

                    <SKTextInput
                        tabType="default"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />

                    <SKButton
                        label="Sign Up"
                        tabType="investment"
                        className="w-full"
                        onClick={handleSignup}
                    />

                    <p className="text-sm text-center">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Log in
                        </a>
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                        We've sent a 6-digit code to <strong>{formData.email}</strong>
                    </p>

                    <SKTextInput
                        tabType="default"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <SKButton
                        label="Verify Email"
                        tabType="investment"
                        className="w-full"
                        onClick={handleVerifyOtp}
                    />
                </div>
            )}
        </div>

    );
}
