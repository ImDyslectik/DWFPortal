const InputValidatorPattern = require('../Backend/InputValidationPattern');
const { describe, it, expect } = require('@jest/globals');

describe('InputValidatorPattern', () => {
    describe('validatePhoneNumber', () => {
        it('should return true for a valid phone number', () => {
            const phoneNumber = '1234567890';
            const isValid = InputValidatorPattern.validatePhoneNumber(phoneNumber);
            expect(isValid).toBe(true);
        });

        it('should return false for an invalid phone number', () => {
            const phoneNumber = 'abc123';
            const isValid = InputValidatorPattern.validatePhoneNumber(phoneNumber);
            expect(isValid).toBe(false);
        });

        it('should return false for an invalid phone number', () => {
            const phoneNumber = 'abc!';
            const isValid = InputValidatorPattern.validatePhoneNumber(phoneNumber);
            expect(isValid).toBe(false);
        });
    });

    describe('validateAddress', () => {
        it('should return true for a valid address', () => {
            const address = '1234 AB';
            const isValid = InputValidatorPattern.validateAddress(address);
            expect(isValid).toBe(true);
        });

        it('should return true for a valid address', () => {
            const address = '1234AB';
            const isValid = InputValidatorPattern.validateAddress(address);
            expect(isValid).toBe(true);
        });

        it('should return false for an invalid address', () => {
            const address = 'AB1234';
            const isValid = InputValidatorPattern.validateAddress(address);
            expect(isValid).toBe(false);
        });
    });

    describe('validateKvkNumber', () => {
        it('should return true for a valid KVK number', () => {
            const kvkNumber = '12345678';
            const isValid = InputValidatorPattern.validateKvkNumber(kvkNumber);
            expect(isValid).toBe(true);
        });

        it('should return true for a valid KVK number', () => {
            const kvkNumber = 'hallo12345678';
            const isValid = InputValidatorPattern.validateKvkNumber(kvkNumber);
            expect(isValid).toBe(false);
        });

        it('should return false for an invalid KVK number', () => {
            const kvkNumber = '1234';
            const isValid = InputValidatorPattern.validateKvkNumber(kvkNumber);
            expect(isValid).toBe(false);
        });
    });

    describe('validateNames', () => {
        it('should return true for valid names', () => {
            const names = 'John Doe';
            const isValid = InputValidatorPattern.validateNames(names);
            expect(isValid).toBe(true);
        });

        it('should return invalid for invalid names', () => {
            const names = 'Henk!';
            const isValid = InputValidatorPattern.validateNames(names);
            expect(isValid).toBe(false);
        });

        it('should return false for invalid names', () => {
            const names = 'John123';
            const isValid = InputValidatorPattern.validateNames(names);
            expect(isValid).toBe(false);
        });
    });

    describe('validateInput', () => {
        it('should throw an error for invalid input', () => {
            const jsonResponse = {
                phoneNumber: 'abc123',
                address: 'AB1234',
                kvkNumber: '1234',
                names: 'John123'
            };

            expect(() => InputValidatorPattern.validateInput(jsonResponse)).toThrow();
        });

        it('should not throw an error for valid input', () => {
            const jsonResponse = {
                phoneNumber: '1234567890',
                address: '1234 AB',
                kvkNumber: '12345678',
                names: 'John Doe'
            };

            expect(() => InputValidatorPattern.validateInput(jsonResponse)).not.toThrow();
        });
    });
});