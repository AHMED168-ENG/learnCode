$('#image').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label-img").html(name); });
$('#file').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label").html(name); });
var loadImg = function (event) {
    $("#dest_image_display").attr("src", URL.createObjectURL(event.target.files[0]));
};
var loadFile = function (event) {
    $("#dest_file_display").attr("src", URL.createObjectURL(event.target.files[0]));
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
            image: { accept: "image/png" },
            file: {},
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
            ar_title: "Please enter a arabic title",
            en_title: "Please enter a english title",
            image: { accept: "image/png" },
            file: {},
            location_lat: "Please enter an latitude",
            location_long: "Please enter an longitude",
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
    if ($(".custom-file-input").hasClass("changed")) {
        formData.append("image", $("#image")[0].files[0]);
        formData.append("file", $("#file")[0].files[0]);
    }
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