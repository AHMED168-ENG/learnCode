const login = (e) => {
    $("#login-btn").buttonLoader("start")
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const settings = {
        async: true,
        crossDomain: true,
        url: `${window.location.pathname}`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            email: email,
            password: password,
        }),
    }
    $.ajax(settings).done(function (res) {
        $("#login-btn").buttonLoader("stop")
        if (res.status != 200) {
            $("#modal-body-val").text("Email or password incorrect")
            $("#exampleModal").modal("show")
        } else if (res.status == 200) {
            if (res.webUser) window.location.replace("/")
            else window.location.replace("/dashboard")
        }
    })
}