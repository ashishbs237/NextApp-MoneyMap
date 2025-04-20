"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SKTextInput from "@/components/elements/SKTextInput";
import SKButton from "@/components/elements/SKButton";
import SKHeader from "@/components/common/Header";
import { useStore } from "@/context/authContext";
import { loginUser } from "@/utils/ui/apiFunctions/authAPI";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useStore();
    const { errorToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password })
            if (res) {
                setUser({ ...res.data })
                router.push("/dashboard");
            }
        } catch (err) {
            errorToast(err)
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-5 border border-gray-200">

            <SKHeader className={'text-center'} text="Log In" />

            <SKTextInput
                tabType="default"
                type="email"
                placeholder="Email"
                className="w-full input input-bordered border border-gray-300 px-4 py-2 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <SKTextInput
                tabType="default"
                type="password"
                placeholder="Password"
                className="w-full input input-bordered border border-gray-300 px-4 py-2 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <SKButton
                label="Log In"
                tabType="investment"
                className="w-full"
                onClick={handleLogin}
            />

            <p className="text-sm text-center text-gray-600">
                Don’t have an account?{" "}
                <a href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                </a>
            </p>
        </div>
    );
}
