# 增删改查

## scheme

```prisma
model User {
  id        Int        @id @default(autoincrement())
  createdAt DateTime   @default(now())
  username  String     @unique
  password  String
  todoLists TodoList[]
  todoTasks TodoTask[]
}

model TodoList {
  id        Int        @id @default(autoincrement())
  title     String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  userId    Int        @unique
  user      User       @relation(fields: [userId], references: [id])
  todoTasks TodoTask[]
}

model TodoTask {
  id         Int      @id @default(autoincrement())
  content    String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  todoListId Int      @unique
  todoList   TodoList @relation(fields: [todoListId], references: [id])
  userId     Int      @unique
  user       User     @relation(fields: [userId], references: [id])
}

```

## handlers

## migrate

```bash
npx prisma migrate dev --name todos
npx prisma generate
npx prisma studio
```
