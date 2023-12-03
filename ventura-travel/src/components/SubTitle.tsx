import { ReactNode } from "react";

export default function SubTitle({ children }: { children: ReactNode }) {
  return (
    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
      {children}
    </h5>
  );
}
