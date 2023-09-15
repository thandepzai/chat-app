let userList = [
  {
    id: '1',
    username: 'Nguyen phong hao',
    room: 'fe02'
  },
  {
    id: '2',
    username: 'Nguyen phong hao 2',
    room: 'fe01'
  }
]

const addUser = (newUser) => userList = [...userList, newUser]; 

const getUserList = (room) => userList.filter((user) => user.room === room);

const removeUser = (id) => userList = userList.filter((user) => user.id !== id);

const findUser = (id) => userList = userList.filter((user) => user.id === id);
module.exports = {
  getUserList,
  addUser,
  removeUser,
  findUser
}