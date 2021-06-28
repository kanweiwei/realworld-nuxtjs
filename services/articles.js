import { request } from "@/plugins/request";

export default class Article {
  static getAsync(data) {
    return request.get("/api/articles", {
      params: data,
    });
  }

  static getFeedArticlesAsync(data) {
    return request.get("/api/articles/feed", {
      params: data,
    });
  }
}
