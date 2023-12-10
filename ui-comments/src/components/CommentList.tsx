import { useState, MouseEvent } from "react";
import { CommentType } from "../core/types";
import Comment from "./Comment";

export default function CommentList({ comments }: { comments: CommentType[] }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsCommentsOpen((s) => !s);
  }

  const buttonMessage = isCommentsOpen ? "Close Less" : "Open Comments";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="float-right inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
      >
        {buttonMessage}
      </button>
      <div className="mt-2">
        {isCommentsOpen &&
          comments.map(({ name, body }, key) => (
            <Comment key={key} name={name} body={body} />
          ))}
      </div>
    </>
  );
}
