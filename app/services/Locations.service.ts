import {injectable, inject} from 'tsyringe';
import {HttpService} from '~/services/Http.service';
import {ILocationSearchBody} from '~/interfaces/ILocationSearchBody.interface';
import {ILocation} from '~/interfaces/ILocation.interface';

@injectable()
export class LocationsService {
	constructor(@inject(HttpService) private readonly httpService: HttpService) {
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
	public async searchLocations(query: ILocationSearchBody): Promise<{ results: ILocation[], total: number }> {
		return this.httpService.post(`${process.env.VITE_API_BASE_URI}/locations/search`, query);
	}
}
