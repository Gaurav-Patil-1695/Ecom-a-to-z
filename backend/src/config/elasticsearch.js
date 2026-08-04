import { Client } from '@elastic/elasticsearch';
import config from './index.js';

const clientOptions = {
  node: config.elasticsearch.node,
};

if (config.elasticsearch.username && config.elasticsearch.password) {
  clientOptions.auth = {
    username: config.elasticsearch.username,
    password: config.elasticsearch.password,
  };
}

const elasticsearchClient = new Client(clientOptions);

export default elasticsearchClient;
