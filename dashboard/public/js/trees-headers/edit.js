$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit()
        }
    });
    $('#newForm').validate({
        rules: {
            ar_name: { required: true },
            en_name: { required: true },
        },
        messages: {
            ar_name: "Please enter a arabic name",
            en_name: "Please enter a english name",
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
    $("input,select,textarea").on("change", function () { $(this).addClass("changed"); })
});
$(function () {
    $('.select2').select2()
    $('.select2bs4').select2({ theme: 'bootstrap4' })
});
