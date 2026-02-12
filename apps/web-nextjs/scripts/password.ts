import bcryptjs from 'bcryptjs'


const password = process.env.SOCKET_IO_ADMIN_PASSWORD;
if (!password) {
  throw new Error("password is not set.");
}

(async () => {
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10, // salt rounds，1-31（默认 10）
  });
  const hashedPassword2 = bcryptjs.hashSync(password, 10)
  console.log(password);
  console.log(hashedPassword);
  console.log(hashedPassword2);
})();
