import type {ILoginBody} from '~/interfaces/ILoginBody.interface';
import {HttpService} from './Http.service';
import {singleton, inject} from 'tsyringe';

const SESSION_STORAGE_AUTH_KEY = 'authenticated';

@singleton()
export class AuthService {
	constructor(@inject(HttpService) private readonly httpService: HttpService) {
	}

	public async login(loginBody: ILoginBody) {
		const response =  await this.httpService.post(`${process.env.VITE_API_BASE_URI}/auth/login`, loginBody);
		const oneHourFromNow = new Date();
		oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
		sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY, oneHourFromNow.toString());
		return response;
	}

	public async logout(): Promise<void> {
		await this.httpService.fetch(`${process.env.VITE_API_BASE_URI}/auth/logout`, {
			method: 'POST',
		});
		sessionStorage.clear();
	}

	public isAuthenticated(): boolean {
		if (!sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY)) return false;

		const dateAsString = sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY);
		const date = new Date(dateAsString as string);
		const now = new Date();
		return now < date;
	}
}
