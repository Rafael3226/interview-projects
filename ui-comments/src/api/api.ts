import HTTP from "./http";
import URIs from "./uris";

export default class API {
  static async fetchPosts(): Promise<unknown[]> {
    return await HTTP.GET(URIs.POSTS);
  }

  static async fetchUsers(): Promise<unknown[]> {
    return await HTTP.GET(URIs.USERS);
  }

  static async fetchComments(): Promise<unknown[]> {
    return await HTTP.GET(URIs.COMMENTS);
  }

  static async fetchGuide(): Promise<unknown> {
    return await HTTP.GET(URIs.GUIDE);
  }
}
