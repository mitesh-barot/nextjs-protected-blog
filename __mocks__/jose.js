module.exports = { SignJWT: jest.fn(() => ({ sign: jest.fn().mockResolvedValue('mock') })) };
