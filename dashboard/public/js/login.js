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
            if (res.status == 401) window.location.href = `${window.location.pathname.split('/')[0]}/otp?user_id=${res.user.user_id}&emailORphone=${emailORphone}`;
            $("#modal-body-val").text("Email or password incorrect")
            $("#exampleModal").modal("show")
        } else if (res.status == 200) {
            window.location.replace("/")
        }
    })
}
function goToSignUpPage() { window.location.replace('/user/register'); }