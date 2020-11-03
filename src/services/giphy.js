import config from "../config";
import requestManager from "./requestManager";

export default class StatisticsService {
	static async getGiphys() {
		const response = await requestManager.getInstance().startRequest(config.METHOD.GET,
			`${config.domain}/v1/gifs/trending?api_key=${config.giphy_api_key}&limit=${config.limit}`,
			{}
		)
		return response;
	}

	static async getFavoriteGiphy(favorites) {
		const response = await requestManager.getInstance().startRequest(config.METHOD.GET,
			`${config.domain}/v1/gifs?api_key=${config.giphy_api_key}&ids=${favorites}`,
			{}
		)
		return response;
	}

	static async addGif(data) {
		const response = await requestManager.getInstance().startRequest(config.METHOD.PUT,
			`/api/users/user`,
			data
		)
		return response;
	}

	static async getInforUser() {
		const response = await requestManager.getInstance().startRequest(config.METHOD.GET,
			`/api/users/user`,
			{}
		)
		return response;
	}
}