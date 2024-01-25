import axios from 'axios';
import config from '../config';
const { bambuser } = config.sources;
const { apiKey, broadcastURL } = bambuser;

class BambuserClient {
  constructor() {}

  getInstance(version) {
    return axios.create({
      baseURL: broadcastURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/vnd.bambuser.${version}+json`,
        'Authorization': `Bearer ${apiKey}`
      }
    });
  }
}

export default BambuserClient;
