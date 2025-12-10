// Simple in-memory storage for development
const users = [];
let nextId = 1;

const db = {
  insert: (table) => ({
    values: (data) => ({
      onConflictDoUpdate: ({ target, set }) => {
        const existing = users.find(u => u.identifier === data.identifier);
        if (existing) {
          Object.assign(existing, set);
          return existing;
        }
        const newUser = { id: nextId++, ...data };
        users.push(newUser);
        return newUser;
      },
      returning: () => {
        const newUser = { id: nextId++, ...data };
        users.push(newUser);
        return [newUser];
      }
    })
  }),
  select: () => ({
    from: (table) => ({
      where: (condition) => ({
        limit: (n) => users.filter(u => condition(u)).slice(0, n)
      })
    })
  }),
  update: (table) => ({
    set: (data) => ({
      where: (condition) => {
        const user = users.find(u => condition(u));
        if (user) Object.assign(user, data);
        return user;
      }
    })
  })
};

const eq = (field, value) => (user) => user[field.name] === value;

module.exports = { db, users: { identifier: { name: 'identifier' } }, eq };