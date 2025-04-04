import { Injectable } from "@nestjs/common";
import path from "path";
import fs from "fs";
import { Buffer } from 'buffer';
import { ConfigService } from "../config/config.service";

/**
 * Provides methods for accessing various directories and files within the project structure.
 */
@Injectable()
export class ResourcesService {

  constructor(private readonly configService: ConfigService) {}

  /**
   * Gets the root directory of the project.
   *
   * This method resolves the root directory by navigating two levels up from the current directory (`__dirname`).
   * It uses `path.normalize` to ensure consistent path separators across different operating systems.
   *
   * @returns {string} The normalized path to the project's root directory (dist).
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const rootDir = resourcesService.getRootDir();
   *     // rootDir will contain the path to the project's root directory (dist)
   *   }
   * }
   * ```
   */
  getRootDir(): string {
    if (this.configService.isUnitTestRunning()) {
      return path.normalize(`${__dirname}/../../../dist`);
    } else {
      return path.normalize(`${__dirname}/../..`);
    }
  }

  /**
   * Gets the source directory of the project, where the TypeScript code resides.
   *
   * This method combines the root directory path obtained from `getRootDir()` with "../src" to form the source directory path.
   * It uses `path.normalize` for consistent path representation across operating systems.
   *
   * @returns {string} The normalized path to the project's source directory.
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const sourceDir = resourcesService.getSourceDir();
   *     // sourceDir will contain the path to the "src" directory within the project
   *   }
   * }
   * ```
   */
  getSourceDir(): string {
    return path.normalize(`${this.getRootDir()}/../src`)
  }

  /**
   * Gets the assets directory of the project, which contains static files like images, fonts, etc.
   *
   * This method combines the root directory path obtained from `getRootDir()` with "assets" to form the assets directory path.
   * It uses `path.normalize` for cross-platform path consistency.
   *
   * @returns {string} The normalized path to the project's assets directory.
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const assetsDir = resourcesService.getAssetsDir();
   *     // assetsDir will contain the path to the "assets" directory within the project
   *   }
   * }
   * ```
   */
  getAssetsDir(): string {
    return path.normalize(`${this.getRootDir()}/assets`);
  }

  /**
   * Gets the internationalization (i18n) directory, which typically contains translation files.
   *
   * This method combines the assets directory path obtained from `getAssetsDir()` with "i18n" to form the i18n directory path.
   * It uses `path.normalize` for path consistency.
   *
   * @returns {string} The normalized path to the i18n directory.
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const i18nDir = resourcesService.getI18nDir();
   *     // i18nDir will contain the path to the "assets/i18n" directory
   *   }
   * }
   * ```
   */
  getI18nDir(): string {
    return path.normalize(`${this.getAssetsDir()}/i18n`);
  }

  /**
   * Gets the name of the i18n directory.
   *
   * This method extracts the last part of the i18n directory path (which is "i18n") using `path.sep` as the separator.
   *
   * @returns {string} The name of the i18n directory ("i18n").
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const i18nDirName = resourcesService.getI18nDirName();
   *     // i18nDirName will be "i18n"
   *   }
   * }
   * ```
   */
  getI18nDirName(): string {
    const i18nDir = this.getI18nDir();
    const i18nDirPaths = i18nDir.split(path.sep);
    return i18nDirPaths[i18nDirPaths.length - 1];
  }

  /**
   * Gets the generated directory, which typically contains files generated during the build process.
   *
   * This method combines the source directory path obtained from `getSourceDir()` with "generated" to form the generated directory path.
   * It uses `path.normalize` for consistent path representation.
   *
   * @returns {string} The normalized path to the generated directory.
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const generatedDir = resourcesService.getGeneratedDir();
   *     // generatedDir will contain the path to the "src/generated" directory
   *   }
   * }
   * ```
   */
  getGeneratedDir(): string {
    return path.normalize(`${this.getSourceDir()}/generated`)
  }

  /**
   * Reads and returns the content of an asset file as a Buffer.
   *
   * This method takes a relative file path within the assets directory and reads the file synchronously using `fs.readFileSync`.
   *
   * @param {string} filePath - The relative path to the file within the assets' directory.
   * @returns {Buffer} The content of the file as a Buffer.
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const imageFile = resourcesService.getAssetFile("images/logo.png");
   *     // imageFile will contain the raw image data as a Buffer
   *   }
   * }
   * ```
   */
  getAssetFile(filePath: string): Buffer {
    return fs.readFileSync(path.normalize(`${this.getAssetsDir()}/${filePath}`));
  }

  /**
   * Reads and parses a JSON asset file.
   *
   * This method takes a relative file path within the assets directory, reads the file synchronously using `fs.readFileSync`,
   * and then parses the content as JSON using `JSON.parse`.
   *
   * @param {string} filePath - The relative path to the JSON file within the assets' directory.
   * @returns {{[key: string]: unknown}} The parsed JSON object.
   *
   * @example
   * ```typescript
   * @Injectable()
   * export class SomeService {
   *
   *   constructor(
   *     private readonly resourcesService: ResourcesService
   *   ) {
   *     const configData = resourcesService.getAssetFileJson("config/app.json");
   *     // configData will contain the parsed JSON data from the "config/app.json" file
   *   }
   * }
   * ```
   */
  getAssetFileJson(filePath: string): {[key: string]: unknown} {
    const assetFile = this.getAssetFile(filePath);
    return JSON.parse(assetFile.toString());
  }

  /**
   * Returns the absolute path to the directory where uploaded files are stored.
   *
   * This path is constructed by appending 'uploaded' to the root directory.
   * It is used to store files that are uploaded through the application.
   *
   * @returns {string} The absolute path to the upload directory.
   * @example
   * ```typescript
   * // Assuming the resources root dir is './dist'
   * const uploadDirectory = this.resourcesService.getFileUploadDir();
   * console.log(uploadDirectory); // Output: (Absolute path)/dist/uploaded
   * ```
   */
  getFileUploadDir() {
    return path.normalize(`${this.getRootDir()}/uploaded`);
  }

  /**
   * Returns the relative path of an uploaded file within the public directory.
   *
   * This function takes a full file path and transforms it into a relative path
   * that can be used to access the file publicly, typically via a web server.
   * It normalizes the provided path, removes the upload directory prefix,
   * and ensures that path separators are forward slashes (/).
   *
   * @param {string} filePath - The full, absolute path to the uploaded file.
   * @returns {string} The relative path to the file within the public directory.
   * @example
   * ```typescript
   * // Assuming the upload directory is 'C:\app\dist\uploaded\users'
   * const filePath = '\app\dist\uploaded\users\my-image.png';
   * const relativePath = this.resourcesService.getPublicFileUploadPath(filePath);
   * console.log(relativePath); // Output: '/users/my-image.png'
   * ```
   */
  getPublicFileUploadPath(filePath: string) {
    return path.normalize(filePath).replace(this.getFileUploadDir(), "").replaceAll(path.sep, "/");
  }


  fromPublicFileUploadPath(filePath: string) {
    return path.normalize(`${this.getFileUploadDir()}/${filePath}`);
  }
}