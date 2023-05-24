## 初始化 prisma

```bash
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
npm install @prisma/client
```

```ts
// db.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

```bash
# Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code in the node_modules/.prisma/client directory:
prisma generate

```
