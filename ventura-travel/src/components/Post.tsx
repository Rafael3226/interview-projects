import { PostType } from "../core/types";
import UserAvatar from "./UserAvatar";
import useUser from "../hook/useUser";
import { Card, CardBody, CardTitle } from "./card";

export type PostProps = {
  userId: PostType["userId"];
  title: PostType["title"];
  body: PostType["body"];
};

export default function Post({ title, body, userId }: PostProps) {
  const user = useUser(userId);

  return (
    <Card>
      <UserAvatar className="mb-2" name={user?.name || ""} />
      <CardTitle>{title}</CardTitle>
      <CardBody>{body}</CardBody>
    </Card>
  );
}
