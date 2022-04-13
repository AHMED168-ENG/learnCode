$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit()
        }
    });
    $('#newForm').validate({
        rules: {
            fullName: {
                required: true,
            },
            role_id: {
                required: true,
            },
            email: {
                required: true,
            },
            phone: {
                required: true,
            },
            password: {
                required: true,
            },
        },
        messages: {
            fullName: "Please enter a name",
            role_id: "Please enter a role",
            email: "Please enter a email",
            phone: "Please enter a phone",
            password: "Please enter a password",
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
    //Collecting data from changed class
    var data = {};
    $(".changed").each(function () {
        data[$(this).attr("name")] = $(this).val();
    });
    //******************************************/
    console.log(data)
    if (Object.keys(data).length !== 0) {
        $("#submitForm").buttonLoader("start")
        const formData = new FormData();
        formData.append("fullName", $("#fullName").val());
        formData.append("email", $("#email").val());
        formData.append("password", $("#password").val());
        formData.append("phone", $("#phone").val());
        formData.append("role_id", $("#role_id option:selected").val());
        $.ajax({
            url: `${window.location.pathname}`,
            data: formData,
            contentType: "application/json",
            type: 'PUT'
        }).done(function (data) {
            window.history.back();
        }).fail(function (xhr) {
            const error = JSON.parse(xhr.responseText)
            $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err}</span>`)
            $("#exampleModal").modal("show")
        }).always(function () {
            $("#submitForm").buttonLoader("stop")
        });
    }

}

$(document).ready(function () {
    $("input,select,textarea").on("change", function () {
        $(this).addClass("changed");
    })
});