import React from "react";

function PostInteractionIcons({ value, children }) {
  return (
    <>
      {children}
      <span>{value}</span>
    </>
  );
}

export default PostInteractionIcons;
