import { CommentType } from "../core/types";
import { Card, CardBody, CardTitle } from "./card";

type CommentProps = {
  body: CommentType["body"];
  name: CommentType["name"];
};

export default function Comment({ name, body }: CommentProps) {
  return (
    <Card>
      <CardTitle>{name}</CardTitle>
      <CardBody>{body}</CardBody>
    </Card>
  );
}
