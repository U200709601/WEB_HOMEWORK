import { createContext, useReducer, useContext } from "react";
import Reducer from './Reducer'

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const initialState = {
    user: user ? user : null,
    token: token ? token : null,
    errorMessage: null,
};

const StoreContext = createContext(null);

const Store = ({ children }) => {
    const [store, dispatch] = useReducer(Reducer, initialState);
    return (
        <StoreContext.Provider value={[store, dispatch]}>
            {children}
        </StoreContext.Provider>
    )
};

export const useStore = () => useContext(StoreContext);
export default Store;
