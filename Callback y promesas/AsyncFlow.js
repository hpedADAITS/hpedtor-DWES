function sumarSync(a, b) {
    return a + b;
  }
  
  async function sumarAsync(a, b) {
    return a + b;
  }
  
  console.log("Sync:", sumarSync(2, 3));
  
  sumarAsync(4, 5).then(r => console.log("Async:", r));
  