import { convertToHTML } from "draft-convert";
import { convertFromRaw } from "draft-js";

export const parseJSON = (html) => {
  const parsedContent = convertFromRaw(JSON.parse(html));
  const contentHTML = convertToHTML(parsedContent);

  return {
    __html: contentHTML,
  };
};
