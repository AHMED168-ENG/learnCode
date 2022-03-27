$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit()
        }
    });
    $('#newForm').validate({
        rules: {
            ar_name: {
                required: true,
            },
            en_name: {
                required: true,
            },
            latitude: {
                required: true
            },
            longitude: {
                required: true
            },
            city_id: {
                required: true
            },
        },
        messages: {
            ar_name: "Please enter a arabic name",
            en_name: "Please enter a english name",
            latitude: "Please enter a latitude",
            longitude: "Please enter a longitude",
            city_id: "Please select a city",
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
    //Collecting data from changed class
    var data = {};
    $(".changed").each(function () {
        data[$(this).attr("name")] = $(this).val();
    });
    //******************************************/
    console.log(data)
    if (Object.keys(data).length !== 0) {
        $("#submitForm").buttonLoader("start")
        $.ajax({
            url: `${window.location.pathname}`,
            data: JSON.stringify(data),
            contentType: "application/json",
            type: 'POST'
        }).done(function (data) {
            window.history.back();
            // location.reload();
        }).fail(function (xhr) {
            const error = JSON.parse(xhr.responseText)
            $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err}</span>`)
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

// change cities by country id
$(document).ready(function () {
    // get first list of cities on page init
    cityListBycountry($("#country_id option:selected").val())

    // get list of cities on country change 
    $("#country_id").on("change", function () {
        $('#city_id').children().remove().end()
        cityListBycountry($("#country_id option:selected").val())
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
                text: `${item.en_name}  -  ${item.ar_name}`,
                // cityId from script in edit.ejs
                selected: cityId == item.city_id ? true : false
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