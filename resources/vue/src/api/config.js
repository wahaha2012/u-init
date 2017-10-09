const TestHost = 'https://test.xxx.com/';
const ProdHost = 'https://xxx.com';

export const base = process.env.API_HOST === 'ProdHost' ? ProdHost : TestHost;

export const getTitle = '/api/getTitle';
