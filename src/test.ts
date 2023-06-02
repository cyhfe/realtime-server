import prisma from "./db";
async function main() {
  const users = await prisma.privateMessage.findMany({
    where: {
      OR: [
        {
          fromUserId: "7fdb2b7d-46d2-4666-895c-dab16f876605",
          toUserId: "abfb4449-b64b-49e3-a36e-c0d45dda1401",
        },
        {
          toUserId: "7fdb2b7d-46d2-4666-895c-dab16f876605",
          fromUserId: "abfb4449-b64b-49e3-a36e-c0d45dda1401",
        },
      ],
    },
    include: {
      from: {
        select: {
          id: true,
          createdAt: true,
          username: true,
          avatar: true,
        },
      },
      to: {
        select: {
          id: true,
          createdAt: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
