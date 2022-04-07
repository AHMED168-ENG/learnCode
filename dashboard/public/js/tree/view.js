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
    // const settings = {
    //     async: true,
    //     crossDomain: true,
    //     url: `${window.location.pathname}`,
    //     method: "Get",
    // }
    // $.ajax(settings).done(function (res, textStatus) {
    //     spinnerNotfound(2)
    //     pagination(res.pages)
    //     $("#tr-th-row").empty()
    //     res.data.forEach((elem) => {
    //         $("#tr-th-row").append(`<tr>
    //         <th scope="row">${elem.tree_id}</th>
    //         <td>${elem.en_name}</td>
    //         <td>${elem.ar_name}</td>
    //         <td><img class="rounded-circle p-0" width=45 height=45 src="/p/img/${elem.img_tree}" alt="Image"></td>
    //         <td>${elem.deleted == "no" ? `<span class="badge badge-success">${elem.deleted}</span>` : `<span class="badge badge-danger">${elem.deleted}</span>`}</td>
    //         <td><a class="pr-2" href="/dashboard/tree/details/${elem.tree_id}"><i class="fas fa-eye text-success"></i></a><a class="pr-2" href="/dashboard/tree/edit/${elem.tree_id}"><i class="fas fa-edit text-primary"></i></a></td>
    //         </tr>`)
    //     })
    // }).fail(() => spinnerNotfound(3))
});
$(document).ready(function () {
    $("input,select,textarea").on("change", function () {
        $(this).addClass("changed");
    })
});