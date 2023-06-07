import { SocketProvider } from './contexts';
import { MapPage } from './pages/map';

function App() {
  return (
    <>
      <SocketProvider>
        <MapPage />
      </SocketProvider>
    </>
  );
}

export default App;
