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
            image: { required: true, accept: "image/png" },
            destination_id: { required: true },
            event_category_id: { required: true },
            city_id: { required: true },
            from: { required: true },
            to: { required: true },
            audience: { required: true },
            type: { required: false },
            ar_description: { required: false },
            en_description: { required: false },
        },
        messages: {
            ar_name: "Please enter a arabic name",
            en_name: "Please enter a english name",
            image: "Please enter an image",
            destination_id: "Please enter a destination",
            event_category_id: "Please enter a event category",
            audience: "Please enter an audience",
            city_id: "Please enter a city",
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
const addNew = () => {
    $("#submitAdd").buttonLoader("start")
    const formData = new FormData();
    formData.append("ar_name", $("#ar_name").val());
    formData.append("en_name", $("#en_name").val());
    formData.append("destination_id", $("#destination_id").val());
    formData.append("event_category_id", $("#event_category_id").val());
    formData.append("audience", $("#audience").val());
    formData.append("city_id", $("#city_id").val());
    formData.append("from", $("#from").val());
    formData.append("to", $("#to").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("en_description", $("#en_description").val());
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
        $('.toast-body').text("New Event add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}