import { request } from "@/plugins/request";

export default class Favorite {
  /**
   * 点赞
   * @param {*} slug
   * @returns
   */
  static addFavorite(slug) {
    return request.post(`/api/articles/${slug}/favorite`);
  }

  static deleteFavorite(slug) {
    return request.delete(`/api/articles/${slug}/favorite`);
  }
}
