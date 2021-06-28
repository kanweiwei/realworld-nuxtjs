import { request } from "@/plugins/request";

export default class Profile {
  /**
   * 获取用户信息
   * @param {*} username
   * @returns
   */
  static getProfile(username) {
    return request.get(`/api/profiles/${username}`);
  }

  static follow(username) {
    return request.post(`/api/profiles/${username}/follow`);
  }

  static unFollow(username) {
    return request.delete(`/api/profiles/${username}/follow`);
  }
}
