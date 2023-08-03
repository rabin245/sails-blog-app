module.exports = {
  friendlyName: "Get person contacts",

  description: "",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    const token = this.req.session.authToken;
    const user = await sails.helpers.getUserFromToken(token);
    const user1 = user.id;

    const contacts = await Chat.find({
      where: {
        or: [
          {
            sender: user1,
          },
          {
            receiver: user1,
          },
        ],
      },
      select: ["sender", "receiver"],
    });

    console.log(contacts);

    const contactsArray = [];

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (contact.sender === user1) {
        contactsArray.push(contact.receiver);
      } else {
        contactsArray.push(contact.sender);
      }
    }

    const uniqueContacts = [...new Set(contactsArray)];

    // Populate the user details for each unique contact
    const populatedContacts = await User.find({ id: { in: uniqueContacts } });

    return exits.success({
      contacts: populatedContacts,
    });
  },
};
