$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    $('#newForm').validate({
        rules: { transportation_id: { required: true } },
        messages: { transportation_id: "Please enter a transportation" },
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
    formData.append("transportation_id", $("#transportation_id").val());
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast-body').text("New Destination Transportation add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}