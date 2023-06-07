import { useContext, useEffect } from 'react';
import { useMapbox } from '../../hooks/useMapbox';
import { SocketContext } from '../../contexts';

export const MapPage = () => {
  const { coords, setRef, newMarker$, markerInMoving$, markers, addMarker } =
    useMapbox();
  const { socket, isOnline } = useContext(SocketContext);

  useEffect(() => {
    socket.on('markers', markers => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  }, []);

  useEffect(() => {
    newMarker$.subscribe(newMarker => {
      socket.emit('new-marker', newMarker);
    });
  }, []);

  useEffect(() => {
    socket.on('marker-added', markerAdded => {
      addMarker(markerAdded, markerAdded.id);
    });
  }, []);

  useEffect(() => {
    markerInMoving$.subscribe(markerInMoving => {
      socket.emit('marker-in-moving', markerInMoving);
    });
  }, []);
  useEffect(() => {
    socket.on('marker-moved', markerMoved => {
      // addMarker(markerMoved, markerMoved.id);
      // console.log((markers.current as any)[markerMoved.id]);
      markers.current[markerMoved.id]?.setLngLat([
        markerMoved.lng,
        markerMoved.lat,
      ]);
    });
  }, []);

  return (
    <>
      <div className='info'>
        <p style={{ color: 'red', display: isOnline ? 'none' : 'block' }}>
          Offline
        </p>
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className='mapContainer' />
    </>
  );
};
