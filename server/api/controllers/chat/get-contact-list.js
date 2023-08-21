module.exports = {
  friendlyName: "Get the list of people the user has contacted",

  description: "Get the list of people the user has contacted",

  inputs: {
    id: {
      type: "number",
      description: "The optional id of the contacted user to look up.",
    },
  },

  exits: {
    success: {
      description: "User found and retrieved successfully.",
      responseType: "ok",
    },
    notFound: {
      description: "User with the specified ID not found.",
      statusCode: 404,
    },
    error: {
      description: "Something went wrong.",
      responseType: "badRequest",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const userId = this.req.user.id;
      const optionalContactId = inputs.id || null;

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

      const contactsArray = contacts.map((contact) => {
        if (contact.sender === userId) {
          return contact.receiver;
        } else {
          return contact.sender;
        }
      });

      const uniqueContacts = [...new Set(contactsArray)];

      // If optionalContactId is provided and not in uniqueContacts, add it
      if (optionalContactId && !uniqueContacts.includes(optionalContactId)) {
        uniqueContacts.push(optionalContactId);
      }

      // Fetch unread message counts for each contact
      const contacedPerson = await Promise.all(
        uniqueContacts.map(async (contactId) => {
          const contact = await User.findOne({ id: contactId });

          if (!contact) {
            return exits.notFound({
              message: "User not found",
            });
          }

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
