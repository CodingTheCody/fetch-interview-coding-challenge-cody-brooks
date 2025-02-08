import {HttpService} from './Http.service';
import {container} from 'tsyringe';

describe('HttpService', () => {
	let service: HttpService;

	beforeEach(() => {
		service = container.resolve(HttpService);
	});

	it('should make an http call to google', async () => {
		const result = await service.get<string>('https://www.google.com', {});
		expect(result).toBeDefined();
	});
});
