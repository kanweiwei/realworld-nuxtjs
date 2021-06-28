import { request } from "@/plugins/request";

export default class Article {
  /**
   * 分页获取文章
   * @param {*} data
   * @returns
   */
  static getAllAsync(data) {
    return request.get("/api/articles", {
      params: data,
    });
  }

  static getFeedArticlesAsync(data) {
    return request.get("/api/articles/feed", {
      params: data,
    });
  }

  /**
   * 获取单个文章内容
   * @param {*} slug
   * @returns
   */
  static getAsync(slug) {
    return request.get(`/api/articles/${slug}`);
  }
}
