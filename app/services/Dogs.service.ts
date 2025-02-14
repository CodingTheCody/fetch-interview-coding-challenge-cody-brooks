import {ISearchDogsQuery} from '~/interfaces/ISearchDogsQuery.interface';
import {HttpService} from './Http.service';
import {injectable, inject} from 'tsyringe';
import {IDogSearchResponse} from '~/interfaces/IDogSearchResponse.interface';
import {IDog} from '~/interfaces/IDog.interface';

@injectable()
export class DogsService {
	constructor(@inject(HttpService) private readonly httpService: HttpService) {
	}

	/**
	 * GET /dogs/breeds
	 * Return Value
	 * Returns an array of all possible breed names.
	 */
	public async getBreeds(): Promise<string[]> {
		return await this.httpService.get<string[]>(`${import.meta.env.VITE_API_BASE_URI}/dogs/breeds`);
	}

	/**
	 * GET /dogs/search
	 * Query Parameters
	 * The following query parameters can be supplied to filter the search results. All are optional; if none are provided, the search will match all dogs.
	 *
	 * breeds - an array of breeds
	 * zipCodes - an array of zip codes
	 * ageMin - a minimum age
	 * ageMax - a maximum age
	 * Additionally, the following query parameters can be used to configure the search:
	 *
	 * size - the number of results to return; defaults to 25 if omitted
	 * from - a cursor to be used when paginating results (optional)
	 * sort - the field by which to sort results, and the direction of the sort; in the format sort=field:[asc|desc].
	 * results can be sorted by the following fields:
	 * breed
	 * name
	 * age
	 * Ex: sort=breed:asc
	 * Return Value
	 * Returns an object with the following properties:
	 *
	 * resultIds - an array of dog IDs matching your query
	 * total - the total number of results for the query (not just the current page)
	 * next - a query to request the next page of results (if one exists)
	 * prev - a query to request the previous page of results (if one exists)
	 * The maximum total number of dogs that will be matched by a single query is 10,000.
	 */
	public async searchDogs(searchQuery: ISearchDogsQuery) {
		return this.httpService.get<IDogSearchResponse>(`${process.env.VITE_API_BASE_URI}/dogs/search`, {
			query: {
				breeds: searchQuery.breeds?.join(','),
				zipCodes: searchQuery.zipCodes?.join(','),
				ageMin: searchQuery.ageMin?.toString(),
				ageMax: searchQuery.ageMax?.toString(),
				size: searchQuery.size?.toString(),
				from: searchQuery.from?.toString(),
				sort: searchQuery.sort === undefined ? undefined : `${searchQuery.sort.sort}:${searchQuery.sort.order}`
			},
		})
	}

	public async getDogsByDogIds(dogIds: string[]): Promise<IDog[]> {
		return this.httpService.post<IDog[]>(`${process.env.VITE_API_BASE_URI}/dogs`, dogIds);
	}

	public async matchWithDog(dogIds: string[]) {
		return this.httpService.post<{ match: string }>(`${process.env.VITE_API_BASE_URI}/dogs/match`, dogIds);
	}
}
