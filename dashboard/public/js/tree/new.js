$('#img_tree').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $(".custom-file-label").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    $('#newForm').validate({
        rules: {
            en_name: {
                required: true,
            },
            ar_name: {
                required: true,
            },
            slug_en: {
                required: true,
            },
            slug_ar: {
                required: true,
            },
            en_description: {
                required: true,
            },
            ar_description: {
                required: true,
            },
            img_tree: { required: true, accept: "image/png" }
        },
        messages: {
            en_name: "field is required",
            ar_name: "field is required",
            slug_en: "field is required",
            slug_ar: "field is required",
            en_description: "field is required",
            ar_description: "field is required",
            img_tree: { required: 'Please add Image!', accept: 'Please select `PNG` only' },
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
    formData.append("en_name", $("#en_name").val());
    formData.append("ar_name", $("#ar_name").val());
    formData.append("slug_en", $("#slug_en").val());
    formData.append("slug_ar", $("#slug_ar").val());
    formData.append("en_description", $("#en_description").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("img_tree", $("#img_tree")[0].files[0]);
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $(".custom-file-label").html("Choose file");
        $('.toast-body').text("New Sponser add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}