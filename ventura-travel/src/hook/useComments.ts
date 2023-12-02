import { useCallback, useContext, useMemo } from "react";
import { CommentType } from "../core/types";
import ApiDataContext from "../context";

export default function useComments(postId: number): CommentType[] {
  const { comments } = useContext(ApiDataContext);

  const findComments = useCallback(
    (pId: number) => comments.filter((u) => u.postId === pId),
    [comments]
  );

  const postComments = useMemo(
    () => findComments(postId),
    [findComments, postId]
  );

  return postComments;
}
