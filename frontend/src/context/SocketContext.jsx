// context/SocketContext.js
import { createContext, useContext } from "react";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export default SocketContext;
