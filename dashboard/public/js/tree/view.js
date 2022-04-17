$('#img_tree').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $(".custom-file-label").html(name); });
var loadFile = function (event) {
    $("#tree_img_display").attr("src", URL.createObjectURL(event.target.files[0]));
};
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
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
            img_tree: { accept: "image/png" }
        },
        messages: {
            en_name: "field is required",
            ar_name: "field is required",
            slug_en: "field is required",
            slug_ar: "field is required",
            en_description: "field is required",
            ar_description: "field is required",
            img_tree: { accept: 'Please select `PNG` only' },
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
$(document).ready(function () {
    $("input,select,textarea").on("change", function () {
        $(this).addClass("changed");
    })
});