module.exports = async function (req, res, proceced) {
  try {
    const receiverId = req.query.receiverId || req.body.receiverId;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver id is required",
      });
    }

    const receiver = await User.findOne({
      id: receiverId,
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver with this id does not exist",
      });
    }

    return proceced();
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
