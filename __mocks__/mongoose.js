const PostMock = {
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue([]),
  countDocuments: jest.fn().mockResolvedValue(0),
  findByIdAndDelete: jest.fn(),
};

const UserMock = { findOne: jest.fn() };

const mongooseMock = {
  Schema: class {},
  model: jest.fn((name) => (name === 'Post' ? PostMock : UserMock)),
  models: { Post: PostMock, User: UserMock },
  connect: jest.fn(),
};

module.exports = mongooseMock;
module.exports.default = mongooseMock;
module.exports.Post = PostMock;
module.exports.User = UserMock;
