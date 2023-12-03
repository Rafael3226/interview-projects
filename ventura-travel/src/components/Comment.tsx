import { CommentType } from "../core/types";
import CollapsibleText from "./CollapsibleText";
import Card from "./Card";
import SubTitle from "./SubTitle";

type CommentProps = {
  body: CommentType["body"];
  name: CommentType["name"];
};

export default function Comment({ name, body }: CommentProps) {
  return (
    <Card>
      <SubTitle>{name}</SubTitle>
      <CollapsibleText>{body}</CollapsibleText>
    </Card>
  );
}
