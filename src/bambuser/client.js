'use strict';

import axios from 'axios';

class BambuserClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  getInstance(version) {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': `application/vnd.bambuser.${version}+json`,
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
  }
}

export default BambuserClient;
