import { useContext } from "react";
import Post, { PostProps } from "./Post";
import ApiDataContext from "../context";

export default function PostList() {
  const { posts } = useContext(ApiDataContext);

  return (
    <section className="flex flex-wrap justify-center px-4">
      {posts.map((p) => (
        <Post key={p.id} {...(p as PostProps)} />
      ))}
    </section>
  );
}
