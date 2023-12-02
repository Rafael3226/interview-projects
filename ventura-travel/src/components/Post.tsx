import { PostType } from "../core/types";
import UserAvatar from "./UserAvatar";
import useUser from "../hook/useUser";
import { Card, CardBody, CardTitle } from "./card";
import CommentList from "./CommentList";
import useComments from "../hook/useComments";

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
      <CardTitle>{title}</CardTitle>
      <CardBody>
        {body}
        <aside className="italic">
          <span>{"Comment: " + comments.length}</span>
          <span className="float-right">{"Contact: " + user?.email}</span>
        </aside>
      </CardBody>
      <CommentList className="mt-2" comments={comments} />
    </Card>
  );
}
