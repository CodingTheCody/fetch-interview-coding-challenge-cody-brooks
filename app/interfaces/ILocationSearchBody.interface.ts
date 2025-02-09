/**
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
 */
export interface ILocationSearchBody {
	city?: string;
	states?: string[];
	geoBoundingBox: {
		lat: number,
		lon: number
	} & ({
		top: number,
		left: number,
		bottom: number,
		right: number
	} | {
		bottom_left: number,
		top_right: number
	});
}
