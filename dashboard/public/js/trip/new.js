$('#image').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label-img").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    $('#newForm').validate({
        rules: {
            ar_name: { required: true },
            en_name: { required: true },
            image: { accept: "image/png" },
            destination_id: { required: false },
            length: { required: true },
            from: { required: true },
            to: { required: true },
            ar_description: { required: false },
            en_description: { required: false },
        },
        messages: {
            ar_name: "Please enter arabic name",
            en_name: "Please enter english name",
            image: { accept: "image/png" },
            destination_id: "Please enter a destination",
            length: "Please enter a length",
            from: "Please enter a from date",
            to: "Please enter a to date",
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
    formData.append("ar_name", $("#ar_name").val());
    formData.append("en_name", $("#en_name").val());
    formData.append("length", $("#length").val());
    formData.append("destination_id", $("#destination_id").val());
    formData.append("en_description", $("#en_description").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("from", $("#from").val());
    formData.append("to", $("#to").val());
    formData.append("image", $("#image")[0].files[0]);
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