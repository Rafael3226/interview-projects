import { MouseEvent, useContext, useState } from "react";
import Post, { PostProps } from "./Post";
import ApiDataContext from "../context";

export default function PostList() {
  const [limit, setLimit] = useState(3);
  const { posts } = useContext(ApiDataContext);

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setLimit((l) => l + 2);
  }

  const postRenderList = [...posts].slice(0, limit);

  return (
    <section>
      <div className="mt-2 px-2 md:px-8 lg:px-32 xl:px-64">
        {postRenderList.map((p) => (
          <Post key={p.id} {...(p as PostProps)} />
        ))}
      </div>
      <div className="flex flex-wrap justify-center">
        <button
          type="button"
          onClick={handleClick}
          className="bg-white text-blue-700 hover:text-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Load More Posts
        </button>
      </div>
    </section>
  );
}
