$('#img').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $(".custom-file-label").html(name); });
var loadFile = function (event) {
    $("#img_display").attr("src", URL.createObjectURL(event.target.files[0]));
};
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit()
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
            img: { accept: "image/jpg,image/jpeg,image/png" }
        },
        messages: {
            sponser_name: "Please enter a sponser name",
            user_name: "Please enter a user name",
            phone: "Please enter a phone number",
            email: {
                required: "Please enter a email address",
                email: "Please enter a vaild email address"
            },
            img: { accept: 'Please select img only' },
        }, errorElement: 'span',
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
    const formData = new FormData();
    $(".changed").each(function () {
        formData.append($(this).attr("name"), $(this).val().trim());
    });
    if ($(".custom-file-input").hasClass("changed")) {
        formData.set("img", $("#img")[0].files[0]);
    }
    //******************************************/
    if ($('.changed').length !== 0) {
        $("#submitForm").buttonLoader("start")
        $.ajax({
            url: `${window.location.pathname}`,
            data: formData,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            type: 'POST'
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