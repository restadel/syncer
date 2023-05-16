let secretToken = "";
for (let i = 0; i < 64; i++) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  secretToken += chars.charAt(Math.floor(Math.random() * chars.length));
}

console.log(secretToken);
