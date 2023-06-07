import mapboxgl from 'mapbox-gl';
import type { Marker, Map, MapboxEvent, EventData } from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import { v4 } from 'uuid';

mapboxgl.accessToken =
  'here your apikey';

interface InitialLocation {
  lng: number;
  lat: number;
  zoom: number;
}
interface MarkerWithId extends Marker {
  id: string;
}

interface Markers {
  [id: string]: MarkerWithId;
}

const initialLocation: InitialLocation = {
  lng: 47.0502,
  lat: -0.8916,
  zoom: 2,
};

export const useMapbox = () => {
  const setRef = useCallback((node: any) => {
    mapDiv.current = node;
  }, []);
  const mapDiv = useRef(null);
  const map = useRef<Map>();
  const [coords, setCoords] = useState<InitialLocation>(initialLocation);
  const markers = useRef<Markers>({});
  const markerInMoving = useRef(new Subject());
  const newMarker = useRef(new Subject());

  const addMarker = useCallback((ev: MapboxEvent & EventData, id?: string) => {
    const { lat, lng } = ev.lngLat || ev;
    const marker = new mapboxgl.Marker() as MarkerWithId;
    marker.id = id ?? v4();
    marker.setLngLat([lng, lat]).addTo(map.current!).setDraggable(true);
    markers.current[marker.id] = marker;

    if (!id) {
      newMarker.current.next({ id: marker.id, lat, lng });
    }

    // Listen move of marker
    marker.on('drag', ({ target }: any) => {
      const { id } = target;
      const { lat, lng } = target.getLngLat();
      // Emitir cambios marcador
      markerInMoving.current.next({ id, lat, lng });
    });
  }, []);

  useEffect(() => {
    if (mapDiv) {
      const mapBox = new mapboxgl.Map({
        container: mapDiv.current as unknown as HTMLElement, // Container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [initialLocation.lat, initialLocation.lng], // starting position [lng, lat]
        zoom: 9, // starting zoom
      });
      map.current = mapBox;
    }
  }, [mapDiv]);

  useEffect(() => {
    map.current?.on('move', ev => {
      const { lat, lng } = map.current?.getCenter() as {
        lat: number;
        lng: number;
      };
      setCoords({
        lng: Number(lng.toFixed(4)),
        lat: Number(lat.toFixed(4)),
        zoom: Number(map.current?.getZoom().toFixed(2)),
      });
    });
  }, []);

  useEffect(() => {
    map.current?.on('click', addMarker);
  }, []);

  return {
    coords,
    markers,
    newMarker$: newMarker.current,
    setRef,
    addMarker,
    markerInMoving$: markerInMoving.current,
  };
};
