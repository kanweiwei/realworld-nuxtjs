import { request } from "@/plugins/request";

export default class User {
  /**
   * 登录
   * @param {*} data
   * @returns
   */
  static login(data) {
    return request.post("/api/users/login", data);
  }

  /**
   * 注册
   * @param {*} data 
   * @returns 
   */
  static register(data) {
    return request.post("/api/users", data);
  }
}
