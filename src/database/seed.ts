import { config as loadEnv } from 'dotenv';
loadEnv();

import { AppDataSource } from '../config/db';
import { Role } from './models';
import { UserRole } from '../common/enums/user-role.enum';

async function seed() {
  await AppDataSource.initialize();

  const roleRepo = AppDataSource.getRepository(Role);

  for (const roleName of Object.values(UserRole)) {
    const exists = await roleRepo.findOne({ where: { name: roleName } });
    if (!exists) {
      await roleRepo.save(roleRepo.create({ name: roleName }));
      console.log(`Created role: ${roleName}`);
    } else {
      console.log(`Role already exists: ${roleName}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
