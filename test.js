(async () => {
  const res = await fetch('//api.github.com/users')
  const json = await res.json()
  console.log(json)
})