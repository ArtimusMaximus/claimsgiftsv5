
import { createContext, useEffect, useReducer } from "react";
import { auth } from "../../firebase";
import AuthReducer from "./AuthReducer";

const user = auth.currentUser

const INITIAL_STATE = {
    // currentUser: JSON.parse(localStorage.getItem('user')) || null // development
    currentUser: user || null // production
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    // useEffect(() => {
    //     localStorage.setItem('user', JSON.stringify(state.currentUser))
        
    //     // could be wrong, but I believe this useEffect is just for setting the local storage

         
        
    // }, [state.currentUser])

    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}