const { generateKeyPair, encryptText } = require('../Backend/Validation/RSAEncryption');
const DataModel = require('../DataSchematics/UserSchematic');
const HandleData = require('../Backend/Validation/HandelLogin');
const { describe, it, expect } = require('@jest/globals');

jest.mock('../Backend/Validation/RSAEncryption');
jest.mock('../DataSchematics/UserSchematic');

const req = {
    body: {
        email: "testuser@gmail.com",
        password: "password",
        role: "user"
    }
};

const res = {
    sendStatus: jest.fn()
};

test('HandleData function saves new user and sends correct status', async () => {
    const mockKeyPair = {publicKey: "publickey", privateKey: "privatekey"};
    const mockEncryptedPassword = "encryptedPassword";

    generateKeyPair.mockReturnValue(mockKeyPair);
    encryptText.mockReturnValue(mockEncryptedPassword);

    const mockNewData = {
        save: jest.fn().mockResolvedValue(null),
    };

    DataModel.mockReturnValue(mockNewData);

    await HandleData(req, res);

    expect(DataModel).toHaveBeenCalledWith({
        email: req.body.email,
        password: mockEncryptedPassword,
        role: req.body.role,
        publicKey: mockKeyPair.publicKey,
        privateKey: mockKeyPair.privateKey,
    });

    expect(mockNewData.save).toHaveBeenCalled();

    expect(res.sendStatus).toHaveBeenCalledWith(200);
});

test('HandleData function sends 500 status when saving user fails', async () => {
    const mockKeyPair = {publicKey: "publickey", privateKey: "privatekey"};
    const mockEncryptedPassword = "encryptedPassword";

    generateKeyPair.mockReturnValue(mockKeyPair);
    encryptText.mockReturnValue(mockEncryptedPassword);

    const mockNewData = {
        save: jest.fn().mockRejectedValue(new Error("Mocking an error")),
    };

    console.error = jest.fn();

    DataModel.mockReturnValue(mockNewData);

    await HandleData(req, res);

    expect(DataModel).toHaveBeenCalled();
    expect(mockNewData.save).toHaveBeenCalled();
});