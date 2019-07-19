(async () => {
  const res = await fetch('//api.github.com/users')
  const json = await res.json()
  console.log(json)
})

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDMxOTA2ZWFlMDUzZGNjNDhmNzNjMzQiLCJuYW1lIjoi5p2O6Zu3IiwiaWF0IjoxNTYzNTQ0MjU4LCJleHAiOjE1NjM2MzA2NTh9.T_9JGQMKxIyL3rawkBE9bzHw7wwfACjzQY6rFdbEBv8"
}

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDMxOTA2ZWFlMDUzZGNjNDhmNzNjMzQiLCJuYW1lIjoi5p2O6Zu3IiwiaWF0IjoxNTYzNTQ0MjU4LCJleHAiOjE1NjM2MzA2NTh9.T_9JGQMKxIyL3rawkBE9bzHw7wwfACjzQY6rFdbEBv8