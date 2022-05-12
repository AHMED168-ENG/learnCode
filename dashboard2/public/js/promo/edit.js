// var is all || specific
var userType = userId ? "specific" : "all"
$(function () {
    userType == "all" ? $("#UserField").hide():""
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit()
        }
    });
    $('#newForm').validate({
        rules: {
            promo_name: {
                required: true,
            },
            num_of_uses: {
                required: true,
                min: 1,
                number: true
            },
            percent: {
                required: true,
                min: 1,
                max: 99,
                number: true
            },
            fromTo: {
                required: true
            },

        },
        messages: {
            promo_name: "Please enter a text",
            num_of_uses: {
                required: "Please enter num of uses",
                number: "Please enter number only",
            },
            percent: { required: "Please enter a percent" },
            fromTo: "Please enter a data",
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
});
const edit = () => {
    $("#submitAdd").buttonLoader("start")
    const formData = new FormData();
    formData.append("promo_name", $("#promo_name").val());
    formData.append("num_of_uses", $("#num_of_uses").val());
    formData.append("percent", $("#percent").val());
    formData.append("from_date", from);
    formData.append("to_date", to);
    formData.append("promo_type", userType == "specific" ? "specific_users" : "all_users");
    userType == "specific" ? formData.append("user_id", $("#user_id").val()) : "";
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        // $('#newForm').trigger("reset");
        // $('.toast-body').text("Successful")
        // $('.toast').toast("show")
        window.history.back();
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}


$(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })
});
