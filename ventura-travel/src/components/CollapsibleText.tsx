import { useState, MouseEvent, ReactNode } from "react";

export default function CollapsibleText({ children }: { children: ReactNode }) {
  const [isBodyOpen, setIsBodyOpen] = useState(false);

  function toggleSeeMore(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsBodyOpen((s) => !s);
  }

  const buttonMessage = isBodyOpen ? "See Less..." : "See More...";

  return (
    <>
      <p
        className={`font-normal text-gray-700 dark:text-gray-400 overflow-hidden overflow-ellipsis ${
          isBodyOpen ? "" : "whitespace-nowrap max-h-6"
        }`}
      >
        {children}
      </p>
      <button
        onClick={toggleSeeMore}
        className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700"
      >
        {buttonMessage}
      </button>
    </>
  );
}
