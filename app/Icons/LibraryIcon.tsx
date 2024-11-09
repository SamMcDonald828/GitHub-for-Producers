// icon:library | Lucide https://lucide.dev/ | Lucide
import * as React from "react";

export default function IconLibrary(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      className="size-6"
      {...props}
    >
      <path d="M16 6l4 14M12 6v14M8 8v12M4 4v16" />
    </svg>
  );
}
