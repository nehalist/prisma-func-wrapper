import {Prisma, PrismaClient} from "@prisma/client";

const TaskWithUser = Prisma.validator<Prisma.TaskArgs>()({
  include: {
    user: true,
  },
});
type TaskWithUser = Prisma.TaskGetPayload<typeof TaskWithUser>;

const TaskWithItem = Prisma.validator<Prisma.TaskArgs>()({
  include: {
    item: true,
  },
});
type TaskWithItem = Prisma.TaskGetPayload<typeof TaskWithItem>;

type TaskWithUserAndItem = TaskWithUser & TaskWithItem;

const prisma = new PrismaClient();

async function getTasks<T extends Prisma.TaskFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.TaskFindManyArgs>
) {
  return prisma.task.findMany<T>({
    where: {
      status: "pending",
    },
    ...args,
  });
}

async function doSomethingWithTasks(tasks: TaskWithUserAndItem[]) {
  tasks.map(task => console.log(task.id, task.user.id, task.item.id));
}

(async () => {
  const tasks = await getTasks({include: {user: true, item: true}});
  await doSomethingWithTasks(tasks);
})();
