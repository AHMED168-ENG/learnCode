function save() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    var code = $('#compose-textarea').summernote('code');
    console.log(code)
    $("#submitForm").buttonLoader("start")
    $.ajax({
        url: `${window.location.pathname}?lang=${lang}`,
        data: JSON.stringify({ code: code }),
        contentType: "application/json",
        type: 'POST'
    }).done(function (data) {
        window.history.back();
    }).fail(function (xhr) {
        const error = JSON.parse(xhr.responseText)
        $("#modal-body-val").html(`<span style="font-size: large">${error.msg}<br/>&emsp;&nbsp;${error.err}</span>`)
        $("#exampleModal").modal("show")
    }).always(function () {
        $("#submitForm").buttonLoader("stop")
    });

}