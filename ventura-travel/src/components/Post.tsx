import { PostType } from "../core/types";
import UserAvatar from "./UserAvatar";
import useUser from "../hook/useUser";
import CommentList from "./CommentList";
import useComments from "../hook/useComments";
import CollapsibleText from "./CollapsibleText";
import Card from "./Card";
import Title from "./Title";

export type PostProps = {
  id: PostType["id"];
  userId: PostType["userId"];
  title: PostType["title"];
  body: PostType["body"];
};

export default function Post({ id, title, body, userId }: PostProps) {
  const user = useUser(userId);
  const comments = useComments(id);

  return (
    <Card>
      <UserAvatar className="mb-2" name={user?.name || ""} />
      <Title>{title}</Title>
      <CollapsibleText>
        {body}
        <span className="italic">
          <span>{"Comment: " + comments.length}</span>
          <span className="float-right">{"Contact: " + user?.email}</span>
        </span>
      </CollapsibleText>
      <CommentList comments={comments} />
    </Card>
  );
}
