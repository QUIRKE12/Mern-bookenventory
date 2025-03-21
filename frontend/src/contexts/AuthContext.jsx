import { createContext, useContext } from "react";

// Create AuthContext
export const AuthContext = createContext(null);

// Custom hook to use authentication
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
