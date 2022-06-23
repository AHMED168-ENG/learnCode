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
const addNew = () => {
    $("#submitAdd").buttonLoader("start")
    const formData = new FormData();
    formData.append("name", $("#name").val());
    formData.append("type", $("#transtype").val());
    formData.append("driver_id", $("#driver_id").val());
    formData.append("rental_company_id", $("#rental_company_id").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("en_description", $("#en_description").val());
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast-body').text("New Transportation add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}