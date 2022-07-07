$('#image').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label-img").html(name); });
$('#file').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    $('#newForm').validate({
        rules: {
            ar_title: { required: true },
            en_title: { required: true },
            city_id: { required: true },
            image: { required: true, accept: "image/png" },
            file: { required: false },
            location_lat: { required: true },
            location_long: { required: true },
            ar_description: { required: false },
            en_description: { required: false },
            ar_when_visit: { required: false },
            en_when_visit: { required: false },
            ar_what_wear: { required: false },
            en_what_wear: { required: false },
            ar_trans_desc: { required: false },
            en_trans_desc: { required: false },
            ar_travel_regulation: { required: false },
            en_travel_regulation: { required: false },
        },
        messages: {
            ar_name: "Please enter a arabic name",
            en_name: "Please enter a english name",
            city_id: "Please enter a city",
            image: "Please enter an image",
            location_lat: "Please enter a latitude",
            location_long: "Please enter a longitude",
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
    formData.append("ar_title", $("#ar_title").val());
    formData.append("en_title", $("#en_title").val());
    formData.append("city_id", $("#city_id").val());
    formData.append("location_lat", $("#location_lat").val());
    formData.append("location_long", $("#location_long").val());
    formData.append("en_description", $("#en_description").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("en_when_visit", $("#en_when_visit").val());
    formData.append("ar_when_visit", $("#ar_when_visit").val());
    formData.append("en_what_wear", $("#en_what_wear").val());
    formData.append("ar_what_wear", $("#ar_what_wear").val());
    formData.append("en_trans_desc", $("#en_trans_desc").val());
    formData.append("ar_trans_desc", $("#ar_trans_desc").val());
    formData.append("en_travel_regulation", $("#en_travel_regulation").val());
    formData.append("ar_travel_regulation", $("#ar_travel_regulation").val());
    formData.append("image", $("#image")[0].files[0]);
    formData.append("file", $("#file")[0].files[0]);
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast-body').text("New Destination add Successful")
        $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}