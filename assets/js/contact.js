$("#form-contact").submit(function(event) {
    event.stopPropagation();
    event.preventDefault();

    // Function definitions
    function updateStatus(message, success) {
        // TODO: Implement DOM changes! Let's be user friendly here ;3
        if (!message) {
            // For example after a delay, or when they change the form again after invalid creds
            console.log('Hide it!');
        }
        else if (success) {
            // Green / blue bar?
            console.log('Success! '+message);
        } else { // failed
            // Red bar?
            console.log('Faillure! '+message);
        }
    }

    // Façades ftw
    function enc(string) {
        if (!string) {
            return "";
        }
        return encodeURIComponent(string);
    }

    var valid = true;
    var dataMap = {};
    $("#form-contact").find("input").each(function(index, elem) {
        valid = valid && elem.checkValidity();
        if(valid) {
            dataMap[enc(elem.getAttribute('name'))] = enc(elem.value);
        }
    });
    $("#form-contact").find("textarea").each(function(index, elem) {
        valid = valid && elem.checkValidity();
        if(valid) {
            dataMap[enc(elem.getAttribute('name'))] = enc(elem.value);
        }
    });

    if (!valid) {
        // Show error message
        updateStatus("Please fill in all required fields with valid data", false);
        return false;
    }

    $.ajax({
        method: "POST",
        url: "email",
        data: dataMap,
        success: function(data) {
            updateStatus("Email was sent!", true);
        },
        error: function(xhr, data, error) {
            // TODO: implement more detailed message?
            updateStatus("Failed to send email", false);
        }
    })

    return false;
});