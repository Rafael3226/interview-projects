export default class HTTP {
  static async GET(uri: string) {
    const response = await fetch(uri);

    if (response.status !== 200)
      throw new Error(`Request Error: Status ${response.status}`);

    return await response.json();
  }
}
