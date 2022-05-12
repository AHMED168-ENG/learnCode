$('#img').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $(".custom-file-label").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNewSponser()
        }
    });
    $('#newForm').validate({
        rules: {
            sponser_name: {
                required: true,
            },
            user_name: {
                required: true,
            },
            phone: {
                required: true
            },
            email: {
                required: true,
                email: true,
            },
            img: { required: true, accept: "image/jpg,image/jpeg,image/png" }
        },
        messages: {
            sponser_name: "Please enter a sponser name",
            user_name: "Please enter a user name",
            phone: "Please enter a phone number",
            email: {
                required: "Please enter a email address",
                email: "Please enter a vaild email address"
            },
            img: { required: 'Please add sponser logo!', accept: 'Please select img only' },
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
const addNewSponser = () => {
    $("#submitAddSponser").buttonLoader("start")
    const formData = new FormData();
    formData.append("sponser_name", $("#sponser_name").val());
    formData.append("user_name", $("#user_name").val());
    formData.append("phone", $("#phone").val());
    formData.append("email", $("#email").val());
    formData.append("img", $("#img")[0].files[0]);
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $(".custom-file-label").html("Choose file");
        $('.toast-body').text("New Sponser add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAddSponser").buttonLoader("stop")
    });
}