import React, { createContext, useReducer } from "react"
import { reducer } from './reducer';
export const GlobalContext = createContext("Initial Value");
let data = {
  user: {},
  isLogin: null,
  name: "some Randome name",
  darkTheme: true
}
export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}