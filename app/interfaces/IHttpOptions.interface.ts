import {CommonHttpHeaders} from '~/types/CommonHttpHeaders.type';

export interface IHttpOptions {
	/**
	 * Defaults to GET
	 */
	method?: string;
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<CommonHttpHeaders | string, string>;
}
