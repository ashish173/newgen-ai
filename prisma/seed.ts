import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password', 10);

  const roles = [
    Role.SALESPERSON,
    Role.BACK_OFFICE,
    Role.SURVEYOR,
    Role.PRODUCTION_MANAGER,
    Role.INSTALLATION,
  ];

  const users = await Promise.all(
    roles.map((role) =>
      prisma.user.upsert({
        where: { email: `${role.toLowerCase()}@example.com` },
        update: {},
        create: {
          name: role.replace('_', ' '),
          email: `${role.toLowerCase()}@example.com`,
          password_hash: password,
          role,
        },
      })
    )
  );

  const surveyTeam = await prisma.team.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Survey Team A', role: Role.SURVEYOR },
  });

  const installTeam = await prisma.team.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Install Team A', role: Role.INSTALLATION },
  });

  // assign members
  await prisma.team.update({
    where: { id: surveyTeam.id },
    data: {
      members: {
        connect: users.filter((u) => u.role === Role.SURVEYOR).map((u) => ({ id: u.id })),
      },
    },
  });
  await prisma.team.update({
    where: { id: installTeam.id },
    data: {
      members: {
        connect: users.filter((u) => u.role === Role.INSTALLATION).map((u) => ({ id: u.id })),
      },
    },
  });

  console.log('Seeded users and teams');
}

main().finally(async () => {
  await prisma.$disconnect();
});
