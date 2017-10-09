import is from './type_is';

export const makeUrl = (originUrl, vars) => {
  let destUrl = originUrl;
  Object.keys(vars).forEach((key) => {
    // console.log(key, vars[key]);
    destUrl = destUrl.replace(`{${key}}`, vars[key]);
  });
  return destUrl;
};

export const makeUrlParams = (params) => {
  const paramsArr = [];
  Object.keys(params).forEach((key) => {
    if (typeof params[key] !== 'undefined' && params[key] !== '') {
      paramsArr.push(`${key}=${params[key]}`);
    }
  });

  return paramsArr.join('&');
};

export const removeEmptyParams = (params) => {
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === 'undefined' || params[key] === '') {
      delete params[key];
    }
  });

  return params;
};

export const processError = (err, cb) => {
  const tempCallback = is(cb, 'function') ? cb : () => {};
  if (is(err, 'error')) {
    console.error(err);
  } else if (is(err, 'string') && err.length) {
    tempCallback(err);
  } else if (is(err, 'object') && err.obj.length) {
    tempCallback(err.obj, err);
  }
};
