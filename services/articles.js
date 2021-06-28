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

  static create(data) {
    return request.post("/api/articles", data);
  }

  static getArticle(slug) {
    return request.get(`/api/articles/${slug}`);
  }

  static deleteArticle(slug) {
    return request.delete(`/api/articles/${slug}`);
  }

  static updateArticle(slug, data) {
    return request.put(`/api/articles/${slug}`, data);
  }

  /**
   * 获取单个文章内容
   * @param {*} slug
   * @returns
   */
  static getAsync(slug) {
    return request.get(`/api/articles/${slug}`);
  }

  /**
   * 获取文章评论
   * @param {*} slug
   * @returns
   */
  static getComments(slug) {
    return request.get(`/api/articles/${slug}/comments`);
  }

  /**
   * 新增评论
   * @param {*} slug
   * @param {*} data
   * @returns
   */
  static postComment(slug, data) {
    return request.post(`/api/articles/${slug}/comments`, data);
  }

  /**
   * 删除评论
   * @param {*} slug
   * @param {*} id
   * @returns
   */
  static deleteComment(slug, id) {
    return request.delete(`/api/articles/${slug}/comments/${id}`);
  }
}
