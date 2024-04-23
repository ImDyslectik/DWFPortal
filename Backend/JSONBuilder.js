/**
 The JSONBuilder class combines data from gathered JSON information into a combined response.
 Input data should be in JSON format, and the class returns a combined object.
 */
class JSONBuilder {
    constructor() {
        this.response = {};
    }

    setApiResponse(firstName, lastName, companyName, email, phoneNumber, address) {
        Object.assign(this.response, {
            firstName: this.response.firstName || firstName,
            lastName: this.response.lastName || lastName,
            companyName: this.response.companyName || companyName,
            email: this.response.email || email,
            phoneNumber: this.response.phoneNumber || phoneNumber,
            address: this.response.phoneNumber || address
        });
        return this;
    }

    setNulMeting(email, companyName, satisfactionBefore, assignment) {
        Object.assign(this.response, {
            email: this.response.email || email,
            companyName: this.response.companyName || companyName,
            satisfactionBefore: this.response.satisfactionBefore || satisfactionBefore,
            assignment: this.response.assignment || assignment
        });
        return this;
    }

    setEenMeting(email, companyName, satisfactionAfter, assignment, feedback, tips) {
        Object.assign(this.response, {
            email: this.response.email || email,
            companyName: this.response.companyName || companyName,
            satisfactionAfter: this.response.satisfactionAfter || satisfactionAfter,
            assignment: this.response.assignment || assignment,
            feedback: this.response.feedback || feedback,
            tips: this.response.tips || tips
        });
        return this;
    }

    build() {
        return this.response;
    }
}
module.exports = JSONBuilder;