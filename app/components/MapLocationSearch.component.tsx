import './MapLocationSearch.component.scss';
import {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import mapboxgl, {LngLatBounds} from 'mapbox-gl';
import {container} from 'tsyringe';
import {LocationsService} from '~/services/Locations.service';
import {ILocation} from '~/interfaces/ILocation.interface';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router';
import {SearchRouteState} from '~/routes/search.route.state';

export function MapLocationSearchComponent() {
	const navigate = useNavigate();
	const mapDivRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<mapboxgl.Map | null>(null);
	const timeoutIdRef = useRef<number | null>(null);
	const [locations, setLocations] = useState<ILocation[]>([]);

	const locationsService = useMemo(() => container.resolve(LocationsService), []);

	const onMapMoveOrZoom = useCallback(() => {
		if (!map) return;
		if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
		timeoutIdRef.current = setTimeout(() => {
			searchLocationsByMapBoundsAndAddMarkers();
		}, 500) as unknown as number;
	}, [map]);

	const searchLocationsByMapBoundsAndAddMarkers = useCallback(async () => {
		if (!map) return;
		const mapBounds = map.getBounds() as LngLatBounds;

		console.log('searching for locations');
		map._markers.forEach((marker) => marker.remove());

		const response = await locationsService.searchLocationsByMapBounds(
			mapBounds.getSouthWest().lng,
			mapBounds.getSouthWest().lat,
			mapBounds.getNorthEast().lng,
			mapBounds.getNorthEast().lat,
		);

		response.results.forEach((location) => {
			// create the marker
			const marker = new mapboxgl.Marker({element: document.createElement('div'), className: 'marker dog'})
				.setLngLat([location.longitude, location.latitude])
				.addTo(map);
		});

		setLocations(response.results);
	}, [map]);

	useEffect(() => {
		if (!mapDivRef.current) return;
		if (map) {
			if (map._container === mapDivRef.current) return;
			map.remove();
		}

		mapboxgl.accessToken = process.env.VITE_MAP_BOX_API_KEY;

		const mapboxMap = new mapboxgl.Map({
			container: mapDivRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-96, 37.8],
			zoom: 3,
		});

		mapboxMap.once('load', () => setMap(mapboxMap));
	}, [mapDivRef.current, map]);

	// Binds effects to map
	useEffect(() => {
		if (!map) return;
		map.on('move', onMapMoveOrZoom);
		map.on('zoom', onMapMoveOrZoom);
		map.once('load', onMapMoveOrZoom);
		searchLocationsByMapBoundsAndAddMarkers();
	}, [map]);


	return (
		<div className="map-location-search">
			<Button variant='outlined' className='map-location-search-button' onClick={() => {
				const zipCodes = locations.map((location) => location.zip_code);
				navigate('/search', {state: {zipCodes} as SearchRouteState});
			}}>Search This Area</Button>
			<div className="mapbox-gl-container" ref={mapDivRef}></div>
		</div>
	);
}
