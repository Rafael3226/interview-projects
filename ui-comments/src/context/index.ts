import { createContext } from "react";
import { CommentType, PostType, UserType } from "../core/types";

const DefaultProviderValues = {
  posts: [] as PostType[],
  users: [] as UserType[],
  comments: [] as CommentType[],
};

// Create a context to manage the state
const ApiDataContext = createContext(DefaultProviderValues);

export default ApiDataContext;
