import axios from 'axios';
// import { Notification, Message, Loading } from 'element-ui';
import { is } from '../utils';
import { base } from './config';
// import store from '../store/index';

// let loading;

// const TOKEN_KEY = 'XXX_TOKEN';
const getToken = (noVerify) => {
  // const token = (localStorage[TOKEN_KEY] && localStorage[TOKEN_KEY] !== 'undefined') ? localStorage[TOKEN_KEY] : false;
  // if (!noVerify && !token) {
  //   Notification.error({
  //     title: '提示',
  //     message: '用户标识过期, 请重新登录!',
  //   });
  //   store.dispatch('LogOut');
  // }

  // return {
  //   'X-TOKEN': token,
  // };
};

const ValidResponse = (code, cb, fail) => {
  let errMsg;
  // if (code === 11000 || code === 401) {
  //   Notification.error({
  //     title: '提示',
  //     message: '用户标识过期, 请重新登录!',
  //   });

  //   store.dispatch('LogOut');
  // } else if (code === 402 || code === 403) {
  //   Notification.error({
  //     title: '提示',
  //     message: '你没有权限进行此操作!',
  //   });
  // } else if (code === 404 || code === 405 || code === 415) {
  //   Message.error('错误的请求内容!!');
  // } else if (code === 500 || code === 502) {
  //   Message.error('系统错误!!');
  // }

  if (typeof cb === 'function') {
    cb(errMsg);
  }
};

const axiosConfig = {
  baseURL: base,
  timeout: 9000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const request = axios.create(axiosConfig);

request.interceptors.request.use((config) => {
  // Do something before request is sent
  // loading = Loading.service({
  //   text: 'Loading...',
  // });
  console.info('Loading Start...');
  return config;
}, error => Promise.reject(error));

// Add a response interceptor
request.interceptors.response.use((response) => {
  // loading.close();
  console.info('Loading End');

  return new Promise((resolve, reject) => {
    ValidResponse(response.status, () => {
      if (is(response.data, 'object') && response.data.code !== 200) {
        reject(response.data.msg);
      } else {
        resolve(response);
      }
    });
  });
  // Do something with response data
}, (error) => {
  // loading.close();
  console.info('Loading End');
  // console.log(error, error.toString());
  const errRes = error.response;
  return new Promise((resolve, reject) => {
    if (!errRes || typeof errRes.status === 'undefined') {
      reject(error.toString());
    } else {
      ValidResponse(errRes.status, () => {
        if (errRes.data.code !== 200) {
          reject(errRes.data.msg);
        } else {
          reject(errRes);
        }
      });
    }
  });
  // Do something with response error
  // return Promise.reject(error);
});

// get common
const get = (url, params, config, noToken) => request.get(url, Object.assign({
  headers: getToken(noToken),
  params,
}, config || {})).then(res => res.data);

// post common
const post = (url, data, config) => request.post(url, data, Object.assign({
  headers: getToken(),
}, config || {})).then(res => res.data);

// put common
const put = (url, data, config) => request.put(url, data, Object.assign({
  headers: getToken(),
}, config || {})).then(res => res.data);

// patch common
const patch = (url, data, config) => request.patch(url, data, Object.assign({
  headers: getToken(),
}, config || {})).then(res => res.data);

export {
  get,
  post,
  put,
  patch,
  request,
  getToken,
  ValidResponse,
};
