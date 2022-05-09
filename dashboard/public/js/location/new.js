$('#img').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label").html(name); });
$('#imgvr').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label-vr").html(name); });
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            addNew()
        }
    });
    // `location_id`, ``, ``, ``, ``, `region_id`, `location_status`, `deleted`, 
    // `createdAt`, `updatedAt`, `img`, `caverArea`,`, `aboutEn`, `aboutAr` -->
    $('#newForm').validate({
        rules: {
            location_nameAr: {
                required: true,
            },
            location_nameEn: {
                required: true,
            },
            location_address: {
                required: true
            },
            location_long: {
                required: true
            },
            location_lat: {
                required: true
            },
            init_id: {
                required: true
            },
            city_id: {
                required: true
            },
            region_id: {
                required: true
            },
            caverArea: {
                required: true
            },
            img: {
                required: false, accept: "image/png"
            },
            imgvr: {
                required: false
            },
            aboutEn: {
                required: true
            },
            aboutAr: {
                required: true
            },
        },
        messages: {
            location_nameAr: "Please enter a arabic name",
            location_nameEn: "Please enter a english name",
            location_address: "Please enter a address",
            location_long: "Please enter along",
            location_lat: "Please enter a lat",
            init_id: "Please enter a init",
            city_id: "Please enter a city",
            region_id: "Please enter a region",
            caverArea: "Please enter a caverArea",
            img: { accept: 'Please select `PNG` only' },
            imgvr: {},
            aboutEn: "Please enter a about en",
            aboutAr: "Please enter a about ar",
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            console.log(error)
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
    formData.append("location_nameAr", $("#location_nameAr").val());
    formData.append("location_nameEn", $("#location_nameEn").val());
    formData.append("location_address", $("#location_address").val());
    formData.append("location_long", $("#location_long").val());
    formData.append("location_lat", $("#location_lat").val());
    formData.append("caverArea", $("#caverArea").val());
    formData.append("aboutEn", $("#aboutEn").val());
    formData.append("aboutAr", $("#aboutAr").val());
    formData.append("init_id", $("#init_id option:selected").val());
    formData.append("city_id", $("#city_id option:selected").val());
    formData.append("region_id", $("#region_id option:selected").val());
    formData.append("img", $("#img")[0].files[0]);
    formData.append("imgvr", $("#imgvr")[0].files[0]);
    console.log(formData)
    $.ajax({
        url: `${window.location.pathname}`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        // $('#newForm').trigger("reset");
        // $('.toast-body').text("New City add Successful")
        // $('.toast').toast("show")
        window.history.back();
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitAdd").buttonLoader("stop")
    });
}


// change cities by country id
$(document).ready(function () {
    // get first list of cities on page init
    cityListBycountry($("#country_id option:selected").val())

    // get list of cities on country change 
    $("#country_id").on("change", function () {
        $('#city_id').children().remove().end()
        cityListBycountry($("#country_id option:selected").val())
    })

    // get list of region on city change 
    $("#city_id").on("change", function () {
        $('#region_id').children().remove().end()
        listRegionByCity($("#city_id option:selected").val())
    })
});

function cityListBycountry(id) {
    $.ajax({
        url: `/dashboard/city/listBycountry/${id}`,
        type: 'GET',
    }).done(function (data) {
        $.each(data, function (i, item) {
            $('#city_id').append($('<option>', {
                value: item.city_id,
                text: `${item.en_name}  -  ${item.ar_name}`
            }));
        });

        // get first list of region on page init
        $('#region_id').children().remove().end()
        listRegionByCity($("#city_id option:selected").val())
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    })
}
function listRegionByCity(id) {
    $.ajax({
        url: `/dashboard/region/listRegionByCity/${id}`,
        type: 'GET',
    }).done(function (data) {
        $.each(data, function (i, item) {
            $('#region_id').append($('<option>', {
                value: item.region_id,
                text: `${item.en_name}  -  ${item.ar_name}`
            }));
        });
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
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