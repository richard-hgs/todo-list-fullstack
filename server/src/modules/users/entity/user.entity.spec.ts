import { UserEntity } from './user.entity';
import { mockUsers } from "../../../utils/tests/utils";

describe('UserEntity', () => {
  it('should create an instance with the provided data', () => {
    const mockUser = mockUsers()[0];

    const userEntity = new UserEntity(mockUser);

    expect(userEntity.id).toEqual(mockUser.id);
    expect(userEntity.status).toEqual(mockUser.status);
    expect(userEntity.role).toEqual(mockUser.role);
    expect(userEntity.name).toEqual(mockUser.name);
    expect(userEntity.email).toEqual(mockUser.email);
    expect(userEntity.password).toEqual(mockUser.password);
    expect(userEntity.createdAt).toEqual(mockUser.createdAt);
    expect(userEntity.updatedAt).toEqual(mockUser.updatedAt);
    expect(userEntity.isEmailActivated).toEqual(mockUser.isEmailActivated);
  });
});