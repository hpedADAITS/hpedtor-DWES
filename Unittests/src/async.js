export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchDataAsync(id) {
  await delay(100);
  if (id < 0) {
    throw new Error('Invalid ID');
  }
  return { id, data: `Data for ${id}` };
}

export async function processMultipleItems(items) {
  const results = [];
  for (const item of items) {
    await delay(50);
    results.push(item * 2);
  }
  return results;
}

export async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
