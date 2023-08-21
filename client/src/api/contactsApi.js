import axios from "axios";

export const contactsUrl = "/api/chat/contact-list";

export const getContactedUsersList = async (id) => {
  let url;
  if (id) {
    url = `/api/chat/contact-list/?id=${id}`;
  } else {
    url = `/api/chat/contact-list`;
  }
  const response = await axios.get(url, {
    withCredentials: true,
  });

  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axios.put(
    `/api/chat/mark-read/${id}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};
