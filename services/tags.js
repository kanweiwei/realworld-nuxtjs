import { request } from "@/plugins/request";

export default class Tag {
  static getAsync() {
    return request.get("/api/tags");
  }
}
