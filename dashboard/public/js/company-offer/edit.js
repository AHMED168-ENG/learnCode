var from = null, to = null;
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
            rental_company_id: { required: true },
            price: { required: true },
            from: { required: true },
            to: { required: true },
            ar_description: { required: false },
            en_description: { required: false },
        },
        messages: {
            ar_name: "Please enter a arabic name",
            en_name: "Please enter a english name",
            rental_company_id: "Please enter an rental company",
            price: "Please enter an price",
            from: "Please enter a from date time",
            to: "Please enter a to date time",
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
    const formData = new FormData();
    $(".changed").each(function () {
        formData.append($(this).attr("name"), $(this).val().trim());
    });
    if ($('.changed').length !== 0) {
        $("#submitForm").buttonLoader("start")
        $.ajax({
            url: `${window.location.pathname}`,
            data: formData,
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            type: 'PUT'
        }).done(function (data) {
            window.history.back();
        }).fail(function (xhr) {
            const error = JSON.parse(xhr.responseText)
            $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
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