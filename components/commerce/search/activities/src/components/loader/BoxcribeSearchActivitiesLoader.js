import React from "react";
import ContentLoader from "react-content-loader";

export default function BoxcribeSearchActivitiesLoader() {
  return (
    <ContentLoader height={400} width="100%">
      <rect x="0" y="0" rx="10" ry="10" width="100%" height="234" />
      <rect x="0" y="250" width="90%" height="24" rx="10" />
      <rect x="0" y="282" width="20%" height="12" rx="10" />
      <rect x="0" y="310" width="100%" height="12" rx="10" />
      <rect x="0" y="330" width="90%" height="12" rx="10" />
      <rect x="0" y="350" width="80%" height="12" rx="10" />
      <rect
        x="0"
        y="378"
        width="30%"
        height="24"
        rx="10"
        style={{ transform: "translateX(70%)" }}
      />
    </ContentLoader>
  );
}
