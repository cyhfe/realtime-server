# 注册登录与路由保护

## 需求

- /user 创建一个新用户,密码加密存储,返回 token
- /signin 登录接口,用户名和密码,返回 token
- /api 登录之后才能访问.使用 token 验证身份

```ts
// server.ts
app.post("/user", createNewUser);
app.post("/signin", signin);
app.use("/api", protect, router);
```

## prisma

```prisma
model User {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  username  String    @unique
  password  String
}
```

```bash
npx prisma migrate dev --name first-migration
npx prisma generate
```

```ts
// router
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});
```

## 创建用户

### hash passwords

```ts
// module/auth.ts
export const hashPassword = (password: User["password"]) => {
  return bcrypt.hash(password, 5);
};
```

### 创建 token

```ts
// module/auth.ts
export const createJWT = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );
  return token;
};
```

```ts
//user.ts
export const createNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });

  const token = createJWT(user);
  res.json({ token });
};
```

```ts
// server.ts
app.post("/user", createNewUser);
```

## 登录
