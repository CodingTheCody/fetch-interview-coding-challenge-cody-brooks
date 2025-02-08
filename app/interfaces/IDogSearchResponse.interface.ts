/**
 * Return Value
 * Returns an object with the following properties:
 *
 * resultIds - an array of dog IDs matching your query
 * total - the total number of results for the query (not just the current page)
 * next - a query to request the next page of results (if one exists)
 * prev - a query to request the previous page of results (if one exists)
 * The maximum total number of dogs that will be matched by a single query is 10,000.
 */
export interface IDogSearchResponse {
	resultIds: string[];
	total: number;
	next: string;
	prev: string;
}
