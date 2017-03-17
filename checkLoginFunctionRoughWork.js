// convert to an array of user objects
const newUsers = Object.keys(users).map((userId) => {
  return users[userId]
})

// console.log(newUsers)
          // fidn the user for which the submitted email and password match the userid(user)
const matchedUser = newUsers.find((user) => {
  return user.email === "jane@example.com" && user.password === "dishwasherfunk"
})

console.log(user)

function checkLogin (database, userEmail, userPassword) {
  let usersArr = Object.keys(database).map((id) => {
    return database[id]
  })

  let foundUser = usersArr.find((user) => {
    return user.email === userEmail && user.password === userPassword;
  })

}

const users = {
  "aaa111": {
    id: "aaa111",
    email: "john@example.com",
    password: "purplemonkeydinosaur"
  },
 "bbb222": {
    id: "bbb222",
    email: "jane@example.com",
    password: "dishwasherfunk"
  }
}

let usersArr = Object.values(users)
