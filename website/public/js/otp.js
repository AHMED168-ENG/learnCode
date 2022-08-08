$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
        }
    });
    $('#newForm').validate({
        rules: {
            digit1: { required: true },
            digit2: { required: true },
            digit3: { required: true },
            digit4: { required: true },
            digit5: { required: true },
            digit6: { required: true },
            verifyOption: { required: true },
        },
        messages: {
            digit1: "Please enter digit1",
            digit2: "Please enter digit2",
            digit3: "Please enter digit3",
            digit4: "Please enter digit4",
            digit5: "Please enter digit5",
            digit6: "Please enter digit6",
            verifyOption: "Please enter verify option",
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
function verifyOtp(user_id, type, emailORphone) {
    $("#submit-btn").buttonLoader("start")
    const otpArray = [];
    for (let i = 1; i <= 6; i++) otpArray.push($(`#digit${i}`).val());
    const otp = otpArray.toString().replace(',', '');
    const formData = new FormData();
    formData.append(`otp`, otp);
    formData.append(`user_id`, user_id);
    formData.append(`type`, type);
    formData.append(`emailORphone`, emailORphone);
    $.ajax({
        url: `${window.location.pathname}/verifyOtp`,
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        type: 'POST'
    }).done(function (data) {
        $('#newForm').trigger("reset");
        $('.toast').toast("show")
        window.location.href = `${window.location.pathname.split('/')[0]}`;
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err ? error.err: ""}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submit-btn").buttonLoader("stop")
    });
}