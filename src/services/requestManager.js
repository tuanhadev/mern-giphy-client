import axios from "axios";

let instance = null;

export default class ManagerRequest {
	static getInstance() {
		if (instance == null) {
			instance = new ManagerRequest();
		}
		return instance;
	}

	async startRequest(method, url, body) {
		try {
			axios.defaults.headers.common['Content-Type'] = "application/json";
			axios.defaults.headers.common['Authorization'] = localStorage.getItem("jwtToken");
			const response = await axios({
				method: method,
				url: url,
				data: body
			})
			return response.data;
		} catch (e) {
			console.log(e)
		}
	}
}