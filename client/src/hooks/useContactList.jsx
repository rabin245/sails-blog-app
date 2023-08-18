import useSWR from "swr";
import { contactsUrl, getContactedUsersList } from "../api/contactsApi";

export default function useContactList({ id }) {
  // using additional fetcher function to pass the id to the api
  // also to avoid revalidation of the data on each id change
  // since the url is the key for the cache
  const fetcher = (url) => getContactedUsersList(id);

  const { isLoading, error, data, mutate } = useSWR(contactsUrl, fetcher, {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    revalidateOnFocus: false,
  });

  const contacts = data?.contacts;

  return {
    isLoading,
    error,
    contacts,
    mutate,
  };
}
