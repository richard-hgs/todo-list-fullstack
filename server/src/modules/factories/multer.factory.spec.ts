import { fileNameBuilder } from './multer.factory';
import * as fs from 'fs';
import { Request } from 'express';

jest.mock('fs'); // Mock the 'fs' module

describe('fileNameBuilder', () => {
  let req: Request;
  let file: Express.Multer.File;
  let callback: jest.Mock;

  beforeEach(() => {
    req = ({ path: '/todolist/icon', user: { id: 1 } } as unknown) as Request;
    file = ({ originalname: 'test.png' } as unknown) as Express.Multer.File;
    callback = jest.fn();


    (fs.existsSync as jest.Mock).mockReturnValue(false); // Set up fs.existsSync to return false initially
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {
      // Mock implementation for mkdirSync (optional)
    });
  });

  it('should create directories and build the filename with user id', () => {
    const destinationDir = '/uploads';
    fileNameBuilder(destinationDir, req, file, callback);
    expect(fs.existsSync).toHaveBeenCalledWith('/uploads');
    expect(fs.existsSync).toHaveBeenCalledWith(`/uploads/todolist/users/1/`);
    expect(fs.mkdirSync).toHaveBeenCalledWith('/uploads/todolist/users/1/', { recursive: true });
    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\/todolist\/users\/1\/.+test\.png$/));
  });

  it('should create directories and build the filename without user id', () => {
    const destinationDir = '/uploads';
    req.user = undefined; //simulates that there is no user on request
    fileNameBuilder(destinationDir, req, file, callback);

    expect(fs.existsSync).toHaveBeenCalledWith('/uploads');
    expect(fs.existsSync).toHaveBeenCalledWith('/uploads/todolist/users/unknown/');
    expect(fs.mkdirSync).toHaveBeenCalledWith('/uploads/todolist/users/unknown/', { recursive: true });

    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\/todolist\/users\/unknown\/.+test\.png$/));
  });

  it('should handle existing directory', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true); // Make existsSync return true
    const destinationDir = '/uploads';
    fileNameBuilder(destinationDir, req, file, callback);

    // mkdirSync should not be called if directory exists
    expect(fs.mkdirSync).not.toHaveBeenCalled();

    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\/todolist\/users\/1\/.+test\.png$/));
  });

  it('should use default users/unknown when user id is not available', () => {
    const destinationDir = '/uploads';
    req.user = undefined;
    fileNameBuilder(destinationDir, req, file, callback);
    expect(fs.mkdirSync).toHaveBeenCalledWith('/uploads/todolist/users/unknown/',{recursive: true})
    expect(callback).toHaveBeenCalledWith(null, expect.stringMatching(/^\/todolist\/users\/unknown\/.+test\.png$/));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

});