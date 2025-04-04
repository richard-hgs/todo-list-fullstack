import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


/**
 * AppController handles application-level routes, particularly the catch-all route
 * for handling 404 Not Found errors.
 */
@Controller()
@ApiTags('app')
export class AppController {
}