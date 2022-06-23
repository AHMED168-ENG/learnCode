$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit()
        }
    });
    $('#newForm').validate({
        rules: {
            name: { required: true },
            type: { required: true },
            driver_id: { required: true },
            rental_company_id: { required: true },
            ar_description: { required: false },
            en_description: { required: false },
        },
        messages: {
            name: "Please enter a transportation name",
            type: "Please enter a transportation type",
            driver_id: "Please enter a driver",
            rental_company_id: "Please enter a rental company",
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