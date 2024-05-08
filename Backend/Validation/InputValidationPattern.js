/**
 This design pattern ensures that the company owner
 didn't make a mistake whilst filling in their data
 */
class InputValidatorPattern {
    static validatePhoneNumber(phoneNumber) {
        const regex = /^\d+$/;
        return regex.test(phoneNumber);
    }

    static validateAddress(address) {
        const regex = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/i;
        return regex.test(address);
    }

    static validateKvkNumber(kvkNumber) {
        const regex = /^\d{8}$/;
        return regex.test(kvkNumber);
    }

    //TODO verwijderen van de () bij deze input, is alleen handig om geen errors te krijgen tijdens het testen
    static validateNames(names) {
        const regex = /^[A-Za-z\s()]+$/;
        return regex.test(names);
    }

    static validateInput(jsonResponse) {
        const { phoneNumber, address, kvkNumber, names } = jsonResponse;

        if (!InputValidatorPattern.validatePhoneNumber(phoneNumber)) {
            throw new Error('Ongeldig telefoonnummer');
        }

        if (!InputValidatorPattern.validateAddress(address)) {
            throw new Error('Ongeldig adres');
        }

        if (!InputValidatorPattern.validateKvkNumber(kvkNumber)) {
            throw new Error('Ongeldig KVK-nummer');
        }

        if (!InputValidatorPattern.validateNames(names)) {
            throw new Error('Ongeldige namen');
        }

        return true;
    }
}

module.exports = InputValidatorPattern;