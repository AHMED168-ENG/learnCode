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
            image: { required: false, accept: "image/png" },
            file: { required: true },
            gender: { required: true },
            email: { required: true },
            password: { required: true },
            phone: { required: true },
            city_id: { required: false },
            verifyOption: { required: true },
        },
        messages: {
            name: "Please enter a name",
            file: "Please enter an file",
            gender: "Please enter a gender",
            email: "Please enter an email",
            password: "Please enter a password",
            phone: "Please enter a phone",
            verifyOption: "Please enter a verify option",
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
    formData.append("password", $("#password").val());
    formData.append("email", $("#email").val());
    formData.append("phone", $("#phone").val());
    formData.append("image", $("#image")[0].files[0]);
    formData.append("file", $("#file")[0].files[0]);
    formData.append("verifyOption", $("#verifyOption").val());
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast-body').text("New Tour Guide is registered Successful")
        $('.toast').toast("show")
        const { user_id, phone, email, type, verifyOption } = data.data;
        const emailORphone = verifyOption === 'email' ? email : verifyOption === 'phone' ? phone : null;
        window.location.href = `${window.location.pathname.split('/')[0]}/otp?user_id=${user_id}&emailORphone=${emailORphone}&type=${type}`;
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}