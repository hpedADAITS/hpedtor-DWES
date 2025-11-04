export async function fetchUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  return response.json();
}

export async function fetchPosts() {
  const response = await fetch('https://api.example.com/posts');
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}
