import {IPagination} from '~/interfaces/IPagination.interface';
import {ISortable} from '~/interfaces/ISortable.interface';
import {DogSortableKeys} from '~/types/DogSortableKeys.type';

export interface ISearchDogsQuery extends IPagination {
	breeds?: string[];
	zipCodes?: number[];
	ageMin?: number;
	ageMax?: number;
	sort?: ISortable<DogSortableKeys>;
}
