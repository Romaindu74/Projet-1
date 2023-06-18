class ErrorMessage {
    a (code, data = {}) {
        return { error: code, data: data };
    }

    t (code) {
        const types = {
            1: "string"
        }
    }

    element_not_found (name) {
        return this.a(1, { name: name });
    }
    file_not_found (name) {
        return this.a(2, { name: name });
    }
    file_error () {
        return this.a(3);
    }
    malformed_element (name, type) {
        return this.a(4, { name: name, type: this.t(type) });
    }
    encrypt_error () {
        return this.a(5);
    }
    decrypt_error () {
        return this.a(6);
    }
}

exports.ErrorMessage = ErrorMessage;