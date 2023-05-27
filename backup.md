```bash
docker run --rm --volumes-from 0a807128be35 -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /app/prisma
```
