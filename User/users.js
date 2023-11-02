const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const exitingUser = users.find(
    (user) => user.name === name && user.room === room
  );
  if (exitingUser) {
    return { error: "username is taken." };
  }
  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getUser = (id) => users.find((user) => user.id === id);

export { addUser, getUser, removeUser, getUsersInRoom };
