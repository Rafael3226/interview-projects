import { ReactNode, useEffect, useState } from "react";
import API from "../api/api";
import { CommentType, PostType, UserType } from "../core/types";
import ApiDataContext from "../context";

type DataProviderProps = {
  children: ReactNode;
};

export default function DataProvider({ children }: DataProviderProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [newPosts, newUsers, newComments] = await Promise.all([
        API.fetchPosts(),
        API.fetchUsers(),
        API.fetchComments(),
      ]);
      setPosts(newPosts as PostType[]);
      setUsers(newUsers as UserType[]);
      setComments(newComments as CommentType[]);
    };
    fetchData();
  }, []);

  // Provide the state and functions through the context
  const contextValue = {
    posts,
    users,
    comments,
  };

  return (
    <ApiDataContext.Provider value={contextValue}>
      {children}
    </ApiDataContext.Provider>
  );
}
