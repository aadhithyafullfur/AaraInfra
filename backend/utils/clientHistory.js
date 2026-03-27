const Client = require("../models/Client");

const MAX_HISTORY = 100;

const appendClientHistory = async (clientId, eventType, description, meta = {}) => {
  if (!clientId || !eventType || !description) {
    return;
  }

  const entry = {
    eventType,
    description,
    meta,
    createdAt: new Date(),
  };

  await Client.findByIdAndUpdate(clientId, {
    $push: {
      activityHistory: {
        $each: [entry],
        $slice: -MAX_HISTORY,
      },
    },
  });
};

module.exports = {
  appendClientHistory,
};
