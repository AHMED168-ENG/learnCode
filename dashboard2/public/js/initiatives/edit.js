$('#logo').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#label_logo").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    $('#newForm').validate({
        rules: {
            init_ar_name: {
                required: true,
            },
            init_en_name: {
                required: true,
            },
            slug_ar: {
                required: true
            },
            slug_en: {
                required: true
            },
            init_ar_description: {
                required: true
            },
            init_en_description: {
                required: true
            },
            city_id: {
                required: true
            },
            region_id: {
                required: true
            },
            sponsor_id: {
                required: true
            },
            featured: {
                required: true
            },
            logo: {
                accept: "image/jpg,image/jpeg,image/png"
            },
            fromTo: {
                required: true
            },
        },
        messages: {
            init_ar_name: {
                required: "Please enter a name ar",
            },
            init_en_name: {
                required: "Please enter a name en",
            },
            slug_ar: {
                required: "Please enter a slug ar",
            },
            slug_en: {
                required: "Please enter a slug en",
            },
            init_ar_description: {
                required: "Please enter a description ar",
            },
            init_en_description: {
                required: "Please enter a description en",
            },
            city_id: {
                required: "Please select a city"
            },
            region_id: {
                required: "Please select a region"
            },
            sponsor_id: {
                required: "Please select a sponsor"
            },
            featured: {
                required: "Please select a featured"
            },
            logo: {
                accept: 'Please select img only'
            },
            fromTo: {
                required: "Please choice a date"
            },
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
    formData.append("init_ar_name", $("#init_ar_name").val());
    formData.append("init_en_name", $("#init_en_name").val());
    formData.append("slug_ar", $("#slug_ar").val());
    formData.append("slug_en", $("#slug_en").val());
    formData.append("init_ar_description", $("#init_ar_description").val());
    formData.append("init_en_description", $("#init_en_description").val());
    formData.append("city_id", $("#city_id option:selected").val());
    formData.append("region_id", $("#region_id option:selected").val());
    formData.append("sponsor_id", $("#sponsor_id option:selected").val());
    formData.append("featured", $("#featured option:selected").val());
    formData.append("logo", $("#logo")[0].files[0]);
    formData.append("from_date", from);
    formData.append("to_date", to);
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        window.history.back();
        // $('#newForm').trigger("reset");
        // $('.toast-body').text("New initiative add Successful")
        // $('.toast').toast("show")
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}

// change region by city id
$(document).ready(function () {
    // get first list of region on page init
    regionListBycity($("#city_id option:selected").val())

    // get list of region on country change 
    $("#city_id").on("change", function () {
        $('#region_id').children().remove().end()
        regionListBycity($("#city_id option:selected").val())
    })
});

function regionListBycity(id) {
    $.ajax({
        url: `/dashboard2/region/listRegionByCity/${id}`,
        type: 'GET',
    }).done(function (data) {
        $.each(data, function (i, item) {
            $('#region_id').append($('<option>', {
                value: item.region_id,
                text: `${item.en_name}  -  ${item.ar_name}`,
                // cityId from script in edit.ejs
                selected: regionId == item.region_id ? true : false
            }));
        });
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err}</span>`)
        $("#exampleModal").modal("show")
    })
}

$(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })
});