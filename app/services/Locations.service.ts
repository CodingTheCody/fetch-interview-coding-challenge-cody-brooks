import {injectable, inject, container} from 'tsyringe';
import {HttpService} from '~/services/Http.service';
import {ILocationSearchBody} from '~/interfaces/ILocationSearchBody.interface';
import {ILocation} from '~/interfaces/ILocation.interface';
import {IResults} from '~/interfaces/IResults.interface';


@injectable()
export class LocationsService {
	constructor(@inject(HttpService) private readonly httpService: HttpService) {
		(window as any).cody = this;
	}

	/**
	 * POST /locations
	 * Body Parameters
	 * The body of this request should be an array of no more than 100 ZIP codes.
	 *
	 * Example
	 *
	 * // API Request Function
	 * ...
	 * body: string[]
	 * ...
	 * Return Value
	 * Returns an array of Location objects.
	 */
	public async searchLocationByZipCodes(zipCodes: string[]): Promise<ILocation[]> {
		if (zipCodes.length > 100) throw new Error('Only 100 zip codes are allowed');
		return this.httpService.post(`${process.env.VITE_API_BASE_URI}/locations`, zipCodes);
	}

	public async searchLocationsByGeolocation(lat: number, lon: number, distanceInMiles = 25): Promise<ILocation[]> {

		// convert distanceInMiles to lat and long distance
		// 1 degree of latitude is approximately 69 miles
		// 1 degree of longitude is approximately 69 miles at the equator and gradually decreases to 0 miles at the poles
		// 1 mile is approximately 0.0144927536 degrees
		const distanceInDegrees = distanceInMiles * 0.0144927536;

		const body: ILocationSearchBody = {
			geoBoundingBox: {
				bottom_left: {lat: lat - distanceInDegrees, lon: lon - distanceInDegrees},
				top_right: {lat: lat + distanceInDegrees, lon: lon + distanceInDegrees},
				// top: {lat: lat + distanceInDegrees, lon},
				// left: {lat, lon: lon - distanceInDegrees},
				// bottom: {lat: lat - distanceInDegrees, lon},
				// right: {lat, lon: lon + distanceInDegrees},
			}
		};

		console.log('body', body);

		return this.httpService.post(`${process.env.VITE_API_BASE_URI}/locations/search`, body);
	}

	/**
	 * POST /locations/search
	 * Body Parameters
	 * The following body parameters can be supplied to filter the search results. All are optional; if none are provided, the search will match all locations.
	 *
	 * city - the full or partial name of a city
	 * states - an array of two-letter state/territory abbreviations
	 * geoBoundingBox - an object defining a geographic bounding box:
	 * This object must contain one of the following combinations of properties:
	 * top, left, bottom, right
	 * bottom_left, top_right
	 * bottom_right, top_left
	 * Each property should have the following data:
	 * lat - latitude
	 * lon - longitude
	 * Additionally, the following body parameters can be used to configure the search:
	 *
	 * size - the number of results to return; defaults to 25 if omitted
	 * from - a cursor to be used when paginating results (optional)
	 * The maximum total number of ZIP codes that will be matched by a single query is 10,000.
	 *
	 * Example
	 *
	 * // API Request Function
	 * ...
	 * body: {
	 *     city?: string,
	 *     states?: string[],
	 *     geoBoundingBox?: {
	 *         top?: Coordinates,
	 *         left?: Coordinates,
	 *         bottom?: Coordinates,
	 *         right?: Coordinates,
	 *         bottom_left?: Coordinates,
	 *         top_left?: Coordinates
	 *     },
	 *     size?: number,
	 *     from?: number
	 * }
	 * ...
	 * Return Value
	 * Returns an object with the following properties:
	 *
	 * results - an array of Location objects
	 * total - the total number of results for the query (not just the current page)
	 * {
	 *     results: Location[],
	 *     total: number
	 * }
	 */
	public async searchLocations(query: ILocationSearchBody): Promise<IResults<ILocation>> {
		return this.httpService.post(`${process.env.VITE_API_BASE_URI}/locations/search`, query);
	}

	async searchLocationsByMapBounds(lng: number, lat: number, lng2: number, lat2: number): Promise<IResults<ILocation>> {
		const body: ILocationSearchBody = {
			geoBoundingBox: {
				bottom_left: {lat, lon: lng},
				top_right: {lat: lat2, lon: lng2},
			},
			size: 50,
		};

		return this.httpService.post(`${process.env.VITE_API_BASE_URI}/locations/search`, body);
	}
}
