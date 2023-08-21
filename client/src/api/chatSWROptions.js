export const postChatOptions = (newChat) => ({
  optimisticData: (oldData) => {
    return {
      conversation: [...oldData.conversation, newChat],
    };
  },
  rollbackOnError: true,
  populateCache: false,
  revalidate: false,
});
