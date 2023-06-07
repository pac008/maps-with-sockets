import { type FC } from 'react';
import { SocketContext } from '.';
import { useSocket } from '../../hooks/useSocket';

// export interface SocketState {
//   prop1: boolean;
// }

// export const SocketInitialState: SocketState = {
//   prop1: false,
// };

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const SocketProvider: FC<Props> = ({ children }) => {
  //   const [state, dispatch] = useReducer(socketReducer, SocketInitialState)
  const { socket, isOnline } = useSocket('http://localhost:8080');

  return (
    <SocketContext.Provider value={{ socket, isOnline }}>
      {children}
    </SocketContext.Provider>
  );
};
