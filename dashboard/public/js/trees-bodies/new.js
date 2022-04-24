$('#img').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $(".custom-file-label").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew();
        }
    });
    $('#newForm').validate({
        rules: {
            ar_title: { required: true },
            en_title: { required: true },
            en_value: { required: false },
            ar_value: { required: false },
            icon: { required: false },
        },
        messages: {
            ar_title: "Please enter a arabic title",
            en_title: "Please enter a english title",
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
    formData.append("ar_value", $("#ar_value").val());
    formData.append("en_value", $("#en_value").val());
    formData.append("icon", $("#icon")[0].files[0]);
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast-body').text("New tree body added Successfull")
        $('.toast').toast("show")
        const prevLink = window.location.pathname.split('/');
        window.location = `/dashboard/tree/details/${prevLink[prevLink.length - 2]}`;
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}
$(function () {
    $('.select2').select2();
    $('.select2bs4').select2({ theme: 'bootstrap4' });
});
