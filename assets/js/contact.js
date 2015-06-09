$('#form-contact').submit(function(event) {
    event.stopPropagation();
    event.preventDefault();

    // Function definitions
    function updateStatus(message, success) {
        var contactMessage = $('#form-contact-status');
        if (!message) {
            contactMessage.fadeOut();
        }
        // TODO: Make alert dismissable with Bootstrap
        else if (success) {
            contactMessage.fadeOut();
            contactMessage.removeClass();
            contactMessage.addClass("alert alert-success");
            contactMessage.text('Email sent successfully!');
            contactMessage.fadeIn();
            $("#form-contact").trigger('reset');
        } else { // failed
            contactMessage.fadeOut();
            contactMessage.removeClass();
            contactMessage.addClass("alert alert-danger");
            contactMessage.text('Sorry, there was an error sending the email.');
            contactMessage.fadeIn();
        }
    }

    // Façades ftw
    function enc(string) {
        if (!string) {
            return '';
        }
        return encodeURIComponent(string);
    }

    var valid = true;
    var dataMap = {};
    $('#form-contact').find('input').each(function(index, elem) {
        valid = valid && elem.checkValidity();
        if(valid) {
            dataMap[enc(elem.getAttribute('name'))] = enc(elem.value);
        }
    });
    $('#form-contact').find('textarea').each(function(index, elem) {
        valid = valid && elem.checkValidity();
        if(valid) {
            dataMap[enc(elem.getAttribute('name'))] = enc(elem.value);
        }
    });

    if (!valid) {
        // Show error message
        updateStatus('Please fill in all required fields with valid data', false);
        return false;
    }

    $.ajax({
        method: 'POST',
        url: 'email',
        data: dataMap,
        dataType: 'text',
        success: function(data) {
            if (data === 'ok') {
                updateStatus('Email was sent!', true);
            } else {
                updateStatus('Failed to send email', false);
            }
        },
        error: function(xhr, data, error) {
            // TODO: implement more detailed message?
            updateStatus('Failed to send email', false);
        }
    })

    return false;
});
