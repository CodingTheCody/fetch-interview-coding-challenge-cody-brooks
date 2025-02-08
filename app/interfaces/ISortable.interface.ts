export interface ISortable<T> {
	order: 'asc' | 'desc';
	sort: T;
}
