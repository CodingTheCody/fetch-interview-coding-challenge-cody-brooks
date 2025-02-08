export class HttpServiceResponseError extends Error {
	constructor(message: string, public readonly response: Response) {
		super(message);
	}
}
