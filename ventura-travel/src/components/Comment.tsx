import { CommentType } from "../core/types";
import CollapsibleText from "./CollapsibleText";
import Title from "./Title";
import Card from "./Card";

type CommentProps = {
  body: CommentType["body"];
  name: CommentType["name"];
};

export default function Comment({ name, body }: CommentProps) {
  return (
    <Card>
      <Title>{name}</Title>
      <CollapsibleText>{body}</CollapsibleText>
    </Card>
  );
}
