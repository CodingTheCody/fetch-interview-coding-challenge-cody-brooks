import {container} from 'tsyringe';
import * as http from 'node:http';
import {HttpService} from '~/services/Http.service';

describe('HttpService', () => {
	let service: HttpService;
	let server: http.Server;

	beforeAll(async () => {
		return new Promise<void>((resolve, reject) => {
			server = http.createServer((req, res) => {
				res.writeHead(200);
				res.end('Hello world');
			});
			server.listen(4111, () => resolve());
		});
	});

	afterAll(async () => {
		server.close();
	});

	beforeEach(() => {
		service = container.resolve(HttpService);
	});

	it('should make an http call to google', async () => {
		const result = await service.get<string>('http://localhost:4111', {});
		expect(result).toBe('Hello world');
		expect(result).toBeDefined();
	});
});
