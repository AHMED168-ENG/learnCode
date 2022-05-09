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
            init_id_pk: {
                required: true
            },
            city_id: {
                required: true
            },
            tree_id: {
                required: true
            },
            region_id: {
                required: true
            },
            location_id: {
                required: true
            },
            price: {
                required: true
            },
            price_points: {
                required: true
            },
            carbon_points: {
                required: true
            },
            target_num: {
                required: true
            },
        },
        messages: {
            location_id: "Please enter a location",
            init_id_pk: "Please enter a init",
            city_id: "Please enter a city",
            tree_id: "Please enter a tree",
            region_id: "Please enter a region",
            price: "Please enter a price",
            price_points: "Please enter a price points",
            carbon_points: "Please enter a carbon points",
            target_num: "Please enter a target",
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
    formData.append("init_id_pk", $("#init_id option:selected").val());
    formData.append("city_id", $("#city_id option:selected").val());
    formData.append("tree_id", $("#tree_id option:selected").val());
    formData.append("region_id", $("#region_id option:selected").val());
    formData.append("location_id", $("#location_id option:selected").val());
    formData.append("price", $("#price").val());
    formData.append("price_points", $("#price_points").val());
    formData.append("carbon_points", $("#carbon_points").val());
    formData.append("target_num", $("#target_num").val());
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

    // get lislocation on city change 
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