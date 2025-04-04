import { PrismaClient, AppType, AppStatus } from '@prisma-db-base/client';
const prisma = new PrismaClient();

/**
 * Main function to execute the seeding process.
 */
async function main() {
  await seedApps();
}

/**
 * Seeds the apps table with initial data.
 * Currently, it only adds/updates the PowerCodeIde app.
 */
async function seedApps() {
  await upsertApp(AppType.PowerCodeIde, AppStatus.Active);
}

/**
 * Inset or update if exists an app record in the database.
 *
 * If an app with the given `appType` already exists, it does nothing (empty update).
 * If no app with the given `appType` exists, it creates a new one with the specified `appStatus`.
 *
 * @param appType - The type of the app.
 * @param appStatus - The status of the app to be created (if it doesn't already exist).
 * @returns A Promise that resolves to the inserted or updated app record.
 */
async function upsertApp(appType: AppType, appStatus: AppStatus) {
  return await prisma.app.upsert({
    where: { type: appType },
    update: {},
    create: {
      status: appStatus,
      type: appType
    }
  })
}

/**
 * Executes the main seeding function and handles database disconnection and error handling.
 */
main()
  .then(async () => {
    // Disconnect from the database after successful seeding
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    // Log any errors encountered during seeding
    console.error(e);
    // Ensure database disconnection even in case of errors
    await prisma.$disconnect();
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  });