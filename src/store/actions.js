import * as types from './mutation-types';
import Vue from 'vue';
import {MsgType} from '../common/js/constants';
import utils from '../common/js/sysUtils';

// 登录
export const login = ({commit}, param) => {
  let data = {...param};
  // md5 加密
  data.password = utils.encryptor(data.password);
  return new Promise((resolve, reject) => {
    Vue.api.login(data).then(ret => {
      if (ret.type === MsgType.SUCCESS) {
        Vue.api.getContextData().then(ret2 => {
          let menusMap = {};
          let menus = utils.findCheckedMenus(ret2.user.menuTree, menusMap);
          commit(types.SET_LOGIN_STATE, true);
          commit(types.SET_MENUS, menus);
          commit(types.SET_MENUS_MAP, menusMap);
          commit(types.SET_CONTEXT_DATA, ret2);
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
};

// 注销
export const logout = ({commit}) => {
  commit(types.SET_LOGIN_STATE, false);
  commit(types.SET_CONTEXT_DATA, {});
  commit(types.SET_MENUS, []);
  commit(types.SET_CUR_MENU, []);
  commit(types.SET_MENUS_MAP, {});
};
