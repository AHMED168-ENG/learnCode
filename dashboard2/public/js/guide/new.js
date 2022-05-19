$('#image').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label-img").html(name); });
$('#file').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    $('#newForm').validate({
        rules: {
            name: { required: true },
            username: { required: false },
            image: { required: true, accept: "image/png" },
            file: { required: false },
            gender: { required: true },
            email: { required: true },
            password: { required: true },
            phone: { required: true },
            city_id: { required: false },
            ar_description: { required: false },
            en_description: { required: false },
        },
        messages: {
            name: "Please enter a name",
            image: "Please enter an image",
            gender: "Please enter a gender",
            email: "Please enter an email",
            password: "Please enter a password",
            phone: "Please enter a phone",
            // city_id: "Please enter a city",
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
const addNew = () => {
    $("#submitAdd").buttonLoader("start")
    const formData = new FormData();
    formData.append("name", $("#name").val());
    formData.append("username", $("#username").val());
    formData.append("gender", $("#gender").val());
    formData.append("city_id", $("#city_id").val());
    formData.append("en_description", $("#en_description").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("password", $("#password").val());
    formData.append("email", $("#email").val());
    formData.append("phone", $("#phone").val());
    formData.append("image", $("#image")[0].files[0]);
    formData.append("file", $("#file")[0].files[0]);
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast-body').text("New Tour Guide add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}