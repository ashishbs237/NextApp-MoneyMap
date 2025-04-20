import fetchWrapper from "@/utils/ui/fetchWrapper";

const signUpUrl = "/api/auth/signup";
const loginUrl = "/api/auth/login";
const veryOtp = "/api/auth/verify-otp";

// signup api
export const registerUser = (payload) => {
    return fetchWrapper.post(signUpUrl, payload);
}

// login api
export const loginUser = (payload) => {
    return fetchWrapper.post(loginUrl, payload);
}
