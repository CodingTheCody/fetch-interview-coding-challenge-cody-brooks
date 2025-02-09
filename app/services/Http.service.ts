import type {IHttpOptions} from '~/interfaces/IHttpOptions.interface';
import {removeUndefinedOrNullProperties} from '~/utils/removeUndefinedOrNullProperties';
import type {CommonHttpHeaders} from '~/types/CommonHttpHeaders.type';
import {singleton} from 'tsyringe';
import {HttpServiceResponseError} from '~/errors/HttpServiceResponse.error';
import {hasOwnProperty} from '~/utils/hasOwnProperty';

@singleton()
export class HttpService {
	public readonly _defaultHeaders: Record<CommonHttpHeaders | string, string> = {};
	public _globalErrorHandler?: (err: HttpServiceResponseError) => void;

	public async fetch(input: RequestInfo | URL, init?: RequestInit) {
		if (!init) init = {};
		init.credentials = 'include';
		const response = await fetch(input, init);
		if (!response.ok) {
			const error = new HttpServiceResponseError('The request failed', response);

			if (this._globalErrorHandler) this._globalErrorHandler(error);

			throw error;
		}
		return response;
	}

	public async get<T>(url: string, options?: Omit<IHttpOptions, 'body' | 'method'>) {
		if (!options) options = {};
		// Always create a copy, as it is bad practice (not quite an anti-pattern) to modify parameters
		options = Object.assign({}, options, {method: 'GET'});
		return this.request<T>(url, options);
	}

	public async post<T>(url: string, body: unknown, options?: Omit<IHttpOptions, 'body' | 'method'>) {
		if (!options) options = {};
		options = Object.assign({}, options, {method: 'POST'});
		(options as IHttpOptions).body = body;
		return this.request<T>(url, options);
	}

	/**
	 * We could add the rest of the HTTP request types such as PUT, OPTIONS, etc, but for the sake of time
	 * they will be omitted as the API does not include these
	 */

	public async request<T>(url: string, options: IHttpOptions): Promise<T> {
		// Handle query string
		if (typeof (options?.query) !== 'undefined') {
			removeUndefinedOrNullProperties(options.query);
			// Convert all query properties to a string
			for (const key in options.query) {
				if (!hasOwnProperty(options.query, key)) continue;
				const valueAtKey = options.query[key] as string | number | boolean;

				if (typeof (options.query[key]) !== 'string') options.query[key] = valueAtKey.toString();
			}
			url += '?' + new URLSearchParams(options.query as Record<string, string>).toString();
		}

		const headers = Object.assign({}, this._defaultHeaders, options.headers || {});

		const requestInit: RequestInit = {
			headers,
			method: options.method || 'GET',
		};

		// Handle body
		if (typeof (options.body) !== 'undefined') {
			const contentType = headers['content-type'] || 'text/html';
			// We could add support for more content types, but that's all the fetch challenge api uses
			if (contentType.indexOf('application/json') >= 0) requestInit.body = JSON.stringify(options.body);
			else requestInit.body = options.body?.toString();
		}

		const response = await this.fetch(url, requestInit);
		const contentType = response.headers.get('content-type') || '';

		// We could add support for more content-type response header types, but the fetch challenge api doesn't
		// use any other kind
		return contentType.indexOf('application/json') >= 0 ?
			await response.json() as T :
			await response.text() as T;
	}

	public setDefaultHeader(header: CommonHttpHeaders | string, value: string | undefined | null) {
		if (value === null || value === undefined) return delete this._defaultHeaders[header];
		this._defaultHeaders[header] = value;
	}

	public setDefaultHeaders(headers: Record<string, string | null | undefined>) {
		for (const key of Object.keys(headers)) {
			this.setDefaultHeader(key, headers[key]);
		}
	}

	public setGlobalErrorHandler(errorHandler: (err: HttpServiceResponseError) => any) {
		this._globalErrorHandler = errorHandler;
	}
}
