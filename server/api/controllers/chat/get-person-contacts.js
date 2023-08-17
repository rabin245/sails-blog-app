module.exports = {
  friendlyName: "Get the list of people the user has contacted",

  description: "Get the list of people the user has contacted",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const userId = this.req.user.id;

      const contacts = await Chat.find({
        where: {
          or: [
            {
              sender: userId,
            },
            {
              receiver: userId,
            },
          ],
        },
        select: ["sender", "receiver"],
      });

      const contactsArray = [];

      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (contact.sender === userId) {
          contactsArray.push(contact.receiver);
        } else {
          contactsArray.push(contact.sender);
        }
      }

      const uniqueContacts = [...new Set(contactsArray)];

      // Fetch unread message counts for each contact
      const contacedPerson = await Promise.all(
        uniqueContacts.map(async (contactId) => {
          const contact = await User.findOne({ id: contactId });
          const count = await Chat.count({
            sender: contactId,
            receiver: userId,
            readStatus: false,
          });
          return { contact, count };
        })
      );

      return exits.success({
        contacts: contacedPerson,
      });
    } catch (error) {
      return exits.error({
        message: "Something went wrong",
        error,
      });
    }
  },
};
