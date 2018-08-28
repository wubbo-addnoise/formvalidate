function invalidateField(field, message) {
    field.classList.remove('valid');
    field.classList.add('invalid');
    if (!field.messageElement) {
        field.messageElement = document.createElement('div');
        field.messageElement.className = 'formval-message';
        field.parentElement.insertBefore(field.messageElement, field.nextSibling);
    }

    if (message) {
        field.messageElement.innerHTML = message;
        field.messageElement.classList.add('visible');
    }
}

function validateField(field) {
    var value;

    if (field.type == 'radio') {

        if (field.hasAttribute('required')) {
            var radios = document.querySelectorAll('input[type="radio"][name="' + field.name + '"]');
            var i, isChecked = false;

            for (i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    isChecked = true;
                    break;
                }
            }

            if (!isChecked) {
                invalidateField(field, 'Dit veld is verplicht');
                return false;
            }
        }

    } else {

        if (field.tagName.toLowerCase() == 'select') {
            value = field.selectedIndex > -1 ? field.options[field.selectedIndex].value : '';
        } else if (field.type == 'checkbox') {
            value = field.checked;
        } else {
            value = field.value;
        }

        if (field.hasAttribute('required') && !value) {
            invalidateField(field, 'Dit veld is verplicht');
            return false;
        }

        if (value && field.hasAttribute('pattern')) {
            var pattern = new RegExp(field.getAttribute('pattern'));
            if (!pattern.test(value)) {
                invalidateField(field, field.getAttribute('data-message'));
                return false;
            }
        }

    }

    field.classList.remove('invalid');
    field.classList.add('valid');
    if (field.messageElement) {
        field.messageElement.classList.remove('visible');
    }

    return true;
}

function onBlur() {
    validateField(this);
}

function liveValidate(form) {
    var i, fields = form.querySelectorAll('input,select,textarea');

    for (i = 0; i < fields.length; i++) {
        if (fields[i].type == 'email' && !fields[i].hasAttribute('pattern')) {
            fields[i].setAttribute('pattern', '^[^@]+@([^\.]+\.)+[a-zA-Z]{2,10}$');
            if (!fields[i].hasAttribute('data-message')) {
                fields[i].setAttribute('data-message', 'Vul a.u.b. een geldig e-mailadres in');
            }
        }

        fields[i].addEventListener('blur', onBlur);
    }
}

function isValid(form) {
    var i, fields = form.querySelectorAll('input,select,textarea'), valid = true;

    for (i = 0; i < fields.length; i++) {
        if (!validateField(fields[i])) {
            valid = false;
        }
    }

    return valid;
}

if ('jQuery' in window) {
    jQuery.fn.liveValidate = function() {
        this.each(function(){
            liveValidate(this);
        });
    };

    jQuery.fn.isValid = function() {
        result = true;

        this.each(function(){
            result = isValid(this);
        });

        return result;
    };
}
