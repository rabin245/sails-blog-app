module.exports = {
  friendlyName: "Get unread message counts",

  description: "Fetch the unread message counts for a user's contacts.",

  inputs: {
    // userId: {
    //   type: "number",
    //   required: true,
    //   description: "The ID of the user to fetch unread message counts for.",
    // },
  },

  exits: {},

  fn: async function (inputs, exits) {
    // const userId = inputs.userId;
    const token = this.req.session.authToken;
    const { id: userId } = await sails.helpers.getUserFromToken(token);

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
        console.log(contactId);
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
  },
};
