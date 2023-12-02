import { useState, MouseEvent, ReactNode } from "react";

export default function CardBody({ children }: { children: ReactNode }) {
  const [isBodyOpen, setIsBodyOpen] = useState(false);

  function toggleSeeMore(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsBodyOpen((s) => !s);
  }

  return (
    <>
      <p
        className={`mb-2 font-normal text-gray-700 dark:text-gray-400 overflow-hidden overflow-ellipsis ${
          isBodyOpen ? "" : "whitespace-nowrap max-h-6"
        }`}
      >
        {children}
      </p>
      <button
        onClick={(e) => toggleSeeMore(e)}
        className={`inline-flex items-center font-medium ${
          isBodyOpen ? "" : "text-blue-600"
        } hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700`}
      >
        See more...
      </button>
    </>
  );
}
