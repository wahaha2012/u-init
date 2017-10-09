import { get, post } from './request';
import * as Api from './config';
// import { removeEmptyParams } from '../utils';

export const getTitle = data => get(Api.getTitle, data);

export const userLogin = data => post(Api.base, data);
