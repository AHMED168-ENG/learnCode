$('#img_tree').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $(".custom-file-label").html(name); });
var loadFile = function (event) {
    $("#custom-file-label").attr("src", URL.createObjectURL(event.target.files[0]));
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
            ar_title: { required: true },
            en_title: { required: true },
            en_value: { required: true },
            ar_value: { required: true },
            icon: { required: false, accept: "image/png" },
        },
        messages: {
            ar_title: "Please enter a arabic title",
            en_title: "Please enter a english title",
            ar_value: "Please enter a arabic value",
            ar_value: "Please enter a english value",
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
    var data = {};
    $(".changed").each(function () { data[$(this).attr("name")] = $(this).val(); });
    if (Object.keys(data).length !== 0) {
        $("#submitForm").buttonLoader("start")
        $.ajax({
            url: `${window.location.pathname}`,
            data: JSON.stringify(data),
            contentType: "application/json",
            type: 'PUT'
        }).done(function (data) {
            window.history.back();
            location.reload();
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
    $("input,select,textarea").on("change", function () { $(this).addClass("changed"); });
});
$(function () {
    $('.select2').select2();
    $('.select2bs4').select2({ theme: 'bootstrap4' });
});
