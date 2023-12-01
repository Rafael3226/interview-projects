import avatar from "../assets/avatar.png";
import { PostType } from "../core/types";

export type PostProps = {
  userId: PostType["userId"];
  title: PostType["title"];
  body: PostType["body"];
};

export default function Post({ title, body }: PostProps) {
  return (
    <div className="w-full p-6 mt-2 mx-20 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <img
          className="w-10 h-10 rounded-full"
          src={avatar}
          alt="User Avatar"
        />
        <div className="font-medium dark:text-white">
          <div>Rafael</div>
        </div>
      </div>

      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {body}
      </p>
      <a
        href="#"
        className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
      >
        See more ...
      </a>
    </div>
  );
}
