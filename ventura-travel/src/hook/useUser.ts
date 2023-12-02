import { useCallback, useContext, useMemo } from "react";
import { UserType } from "../core/types";
import ApiDataContext from "../context";

export default function useUser(id: number): UserType | undefined {
  const { users } = useContext(ApiDataContext);

  const findUser = useCallback(
    (userId: number) => users.find((u) => u.id === userId),
    [users]
  );

  const user = useMemo(() => findUser(id), [findUser, id]);

  return user;
}
