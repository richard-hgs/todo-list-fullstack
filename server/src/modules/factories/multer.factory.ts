import { MulterModule } from "@nestjs/platform-express";
import { ResourcesService } from "../resources/resources.service";
import { diskStorage } from "multer";
import { ResourcesModule } from "../resources/resources.module";
import { DynamicModule } from "@nestjs/common";
import fs from "fs";
import { User } from "@prisma/client";
import { Request } from "express";

/**
 * Factory function to create a dynamically configured MulterModule.
 * Uses the ResourcesService to determine the file upload directory.
 *
 * @returns {DynamicModule} The dynamically configured MulterModule.
 */
export function multerModuleFactory(): DynamicModule {
  return MulterModule.registerAsync({
    useFactory: (
      resourcesService: ResourcesService
    ) => {
      const destinationDir = resourcesService.getFileUploadDir();
      return {
        storage: diskStorage({
          destination: destinationDir,
          filename   : (req, file, callback) => fileNameBuilder(destinationDir, req, file, callback),
        })
      }
    },
    imports: [ResourcesModule],
    inject: [ResourcesService]
  })
}

/**
 * Builds a file name based on the request path, user ID, timestamp, and original file name.
 * Creates necessary directories if they don't exist.
 *
 * @param destinationDir - The base destination directory for uploads.
 * @param req - The Express request object.  Should contain `req.path` for routing and optionally `req.user` with a `id` property.
 * @param file - The Multer file object containing the `originalname`.
 * @param callback - The callback function to execute with the generated filename or an error.  Signature: `(error: Error | null, filename: string) => void`.
 */
export function fileNameBuilder(
  destinationDir: string,
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
): void {
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }
  let appUserDir = "";

  const reqPath = req.path;
  const reqPathSplit = reqPath.split("/");
  const appDir = `${reqPathSplit[1]}/`;
  let userDir = "users/unknown/";

  if (req.user) {
    const user = req.user as User;
    userDir = `users/${user.id}/`;
  }

  appUserDir = `/${appDir}${userDir}`;

  if (appUserDir.trim().length > 0) {
    if (!fs.existsSync(`${destinationDir}${appUserDir}`)) {
      fs.mkdirSync(`${destinationDir}${appUserDir}`, { recursive: true });
    }
  }

  const filename = `${appUserDir}${Date.now()}-${file.originalname}`;
  callback(null, filename);
}