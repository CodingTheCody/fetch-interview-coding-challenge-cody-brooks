import {IPagination} from '~/interfaces/IPagination.interface';
import {ISortable} from '~/interfaces/ISortable.interface';

export interface ISearchDogsQuery extends IPagination {
	breeds?: string[];
	zipCodes?: number[];
	ageMin?: number;
	ageMax?: number;
	sort?: ISortable<['breed', 'name', 'age']>;
}
