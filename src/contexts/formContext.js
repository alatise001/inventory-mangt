'use client';
import React from "react";

export const FormContext = React.createContext();

function FormContextProvider({ children }) {
    const [isform, setFormData] = React.useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("icanMemberInfo");
            if (saved) {
                return JSON.parse(saved);
            }
        }
        return {
            membershipNo: "",
            emailAddress: "",
            adminmembershipNo: "",
            adminemailAddress: "",
            isAdmin: false

        };
    });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("icanMemberInfo", JSON.stringify(isform));
        }
    }, [isform]);

    return (
        <FormContext.Provider value={{ isform, setFormData }}>
            {children}
        </FormContext.Provider>
    );
}

export default FormContextProvider;
