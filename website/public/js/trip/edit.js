var activitiesArr = [];
var removedActivities = [];
function addRemove(day, activity_id, isExistAct) {
    const isExist = activitiesArr.find((activity) => activity.day === day && activity.activity_id === activity_id);
    if (!isExist && isExistAct == 'undefined') {
        addActivities(day, activity_id);
        $('#addRemoveBtn-' + activity_id + '-' + day).html('<i class="fas fa-minus"></i>');
    } else {
        removeActivities(day, activity_id, isExistAct);
        $('#addRemoveBtn-' + activity_id + '-' + day).html('<i class="fas fa-plus"></i>');
    }
    console.log({activitiesArr, removedActivities})
}
function addActivities(day, activity_id) {
    activitiesArr.push({ day, activity_id });
}
function removeActivities(day, activity_id, isExist) {
    const isIncluded = activitiesArr.find((ac) => ac.day === day && ac.activity_id === activity_id);
    const foundRemovedActivity = removedActivities.find((ra) => ra === isExist.id);
    if (isExist != 'undefined' && !foundRemovedActivity) removedActivities.push(isExist.id);
    if (isIncluded) {
        if (isExist == 'undefined' && foundRemovedActivity) removedActivities = removedActivities.filter((activity) => activity !== isExist.id);
        else activitiesArr = activitiesArr.filter((activity) => (activity.day === day && activity.activity_id !== activity_id) || activity.day !== day);
    }
    if (!isIncluded && isExist != 'undefined' && foundRemovedActivity) removedActivities = removedActivities.filter((activity) => activity !== isExist.id);
}
$('#image').on('change', function () { files = $(this)[0].files; name = ''; for (var i = 0; i < files.length; i++) { name += '\"' + files[i].name + '\"' + (i != files.length - 1 ? ", " : ""); } $("#custom-file-label-img").html(name); });
var loadImg = function (event) {
    $("#dest_image_display").attr("src", URL.createObjectURL(event.target.files[0]));
};
$(function () {
    $.validator.setDefaults({
        submitHandler: function (form, event) {
            event.preventDefault();
            edit();
        }
    });
    $('#newForm').validate({
        rules: {
            ar_name: { required: true },
            en_name: { required: true },
            image: { accept: "image/png" },
            destination_id: { required: false },
            length: { required: true },
            from: { required: true },
            to: { required: true },
            ar_description: { required: false },
            en_description: { required: false },
        },
        messages: {
            ar_name: "Please enter arabic name",
            en_name: "Please enter english name",
            image: { accept: "image/png" },
            destination_id: "Please enter a destination",
            length: "Please enter a length",
            from: "Please enter a from date",
            to: "Please enter a to date",
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
    const addedActivities = [];
    const days = activitiesArr.map((a) => { return a.day; });
    for (const day of [...new Set(days)]) {
        const activitiesPerDay = activitiesArr.filter((act) => act.day === day);
        const activities = activitiesPerDay.map((ac) => { return ac.activity_id; });
        addedActivities.push({ day, activities });
    }
    $("#submitAdd").buttonLoader("start");
    let activitiesDays = [];
    if (addedActivities.length || removedActivities.length) {
        activitiesDays = JSON.stringify({ addedActivities, removedActivities });
    }
    const formData = new FormData();
    formData.append("ar_name", $("#ar_name").val());
    formData.append("en_name", $("#en_name").val());
    formData.append("length", $("#length").val());
    formData.append("destination_id", $("#destination_id").val());
    formData.append("en_description", $("#en_description").val());
    formData.append("ar_description", $("#ar_description").val());
    formData.append("from", $("#from").val());
    formData.append("to", $("#to").val());
    formData.append("activitiesDays", JSON.stringify(activitiesDays));
    if (!!$("#image")[0].files[0]) formData.append("image", $("#image")[0].files[0]);
    // $(".changed").each(function () {
    // });
    // if ($('.changed').length !== 0 || activitiesDays.length) {
    // }
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