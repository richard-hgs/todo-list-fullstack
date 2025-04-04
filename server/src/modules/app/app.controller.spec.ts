import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppLoggerMiddleware } from "../logger/app-logger.midleware";
describe('AppController tests', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppLoggerMiddleware],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  // describe('404 Not Found', () => {
  //   it('should return 404 error only', () => {
  //     const mockRequest = {
  //       headers: {
  //         'accept': 'text/html'
  //       },
  //       originalUrl: "/"
  //     } as unknown as Request;
  //
  //     const resp = mockResponse();
  //     const nextReq = jest.fn();
  //
  //     // Call the controller method
  //     controller.notFound(mockRequest, resp, nextReq);
  //
  //     expect(resp.status).toBeCalledWith(HttpStatus.NOT_FOUND);
  //     expect(resp.send).toBeCalled();
  //   });
  //
  //   it('should return json error', () => {
  //     const mockRequest = {
  //       headers: {
  //         'accept': 'application/json'
  //       },
  //       originalUrl: "/test"
  //     } as unknown as Request;
  //
  //     const resp = mockResponse();
  //     const nextReq = jest.fn();
  //
  //     // Call the controller method
  //     controller.notFound(mockRequest, resp, nextReq);
  //
  //     expect(resp.status).toBeCalledWith(HttpStatus.NOT_FOUND);
  //     expect(resp.json).toBeCalledWith(
  //       {
  //         "message": `Cannot GET /test`,
  //         "error": "Not Found",
  //         "statusCode": 404
  //       }
  //     );
  //     expect(resp.send).toBeCalled();
  //     expect(nextReq).not.toHaveBeenCalled()
  //   });
  // });
});