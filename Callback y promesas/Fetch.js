import fetch from "fetch";

async function get(url) {
  const response = await fetch(url);
  return response.json();
}

async function init(){
  const data = await get('https://reqres.in/api/users?page=2');
  const data2 = await get('https://reqres.in/api/users?page=3');
  console.log(data, data2);
}

init();
