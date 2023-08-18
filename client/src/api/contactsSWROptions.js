export const markAsReadOptions = (id) => ({
  optimisticData: (oldData) => {
    const newContactList = {
      contacts: oldData.contacts.map((contactInfo) => {
        if (contactInfo.contact.id == id) {
          return { ...contactInfo, count: 0 };
        }
        return contactInfo;
      }),
    };

    return newContactList;
  },
  rollbackOnError: true,
  revalidate: false,
  populateCache: (newData, oldData) => {
    const newContactList = {
      contacts: oldData.contacts.map((contactInfo) => {
        if (contactInfo.contact.id == newData.sender) {
          return { ...contactInfo, count: 0 };
        }
        return contactInfo;
      }),
    };

    return newContactList;
  },
});
