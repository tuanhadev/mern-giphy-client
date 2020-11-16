import axios from "axios";
import config from "../config";
import requestManager from "./requestManager";

export default class StatisticsService {
	static async getGiphys() {
		const response = await requestManager.getInstance().startRequest(config.METHOD.GET,
			`${config.domainGiphy}/v1/gifs/trending?api_key=${config.giphy_api_key}&limit=${config.limit}`,
			{}
		)
		return response;
	}

	static async getListUserRocketChat() {
		const response = await axios({
			method: 'GET',
			url: `${config.domainRocketChat}/api/v1/users.list`,
			data: {},
			headers: {
				'X-Auth-Token': config.authTokenRocketChat,
				'X-User-Id': config.userIdRocketChat
			}
		})
		return response.data;
	}

	static async createUserRocketChat(userData) {
		const response = axios({
			method: 'POST',
			url: `${config.domainRocketChat}/api/v1/users.create`,
			data: userData,
			headers: {
				'X-Auth-Token': config.authTokenRocketChat,
				'X-User-Id': config.userIdRocketChat
			}
		})
		return response.data;
	}

	static async checkLoginUser(userData) {
		const response = await axios({
			method: 'POST',
			url: `${config.domain}/api/users/login`,
			data: userData
		})
		return response.data;
	}

	static async getFavoriteGiphy(favorites) {
		const response = await requestManager.getInstance().startRequest(config.METHOD.GET,
			`${config.domainGiphy}/v1/gifs?api_key=${config.giphy_api_key}&ids=${favorites}`,
			{}
		)
		return response;
	}

	static async addGif(data) {
		const response = await requestManager.getInstance().startRequest(config.METHOD.PUT,
			`${config.domain}/api/users/user`,
			data
		)
		return response;
	}

	static async getInforUser() {
		const response = await requestManager.getInstance().startRequest(config.METHOD.GET,
			`${config.domain}/api/users/user`,
			{}
		)
		return response;
	}
}