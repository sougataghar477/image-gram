'use client';
import { createContext, useState, useEffect, useCallback,useRef } from "react";
import { useSession } from "next-auth/react";

// Create Context
export const AppContext = createContext();

// Create Provider Wrapper
export const ContextProvider = ({ children }) => {
  let { status, data } = useSession();
  const [state, setState] = useState(null); // Use `null` to track if fetch is needed
  const [selectedElementRefId,setselectedElement]=useState(null);
 
  const setUserdata = (data) => {
    setState(data);
  };

  const setUser = useCallback(async () => {
    if (status === "authenticated" && data?.user?.email && !state) {
      try {
        const response = await fetch("http://localhost:3000/api/fetchUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        });

        const responseBody = await response.json();
        setUserdata({ ...responseBody });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }, [status, data, state]); // Depend on `state` to avoid redundant calls

  useEffect(() => {
    setUser();
  }, [setUser]); // Only re-run if `setUser` changes

  return (
    <AppContext.Provider value={{ state, setUserdata,selectedElementRefId,setselectedElement}}>
      {children}
    </AppContext.Provider>
  );
};
