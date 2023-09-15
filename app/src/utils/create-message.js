
const formatTime = require("date-format");

const createMessages = (messageText, userName) => {
  return {
    userName,
    messageText,
    createAt : formatTime('dd/MM/yyyy - hh:mm:ss',new Date())
  }
}

module.exports = {
  createMessages
}