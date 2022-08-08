var userType = "individual";
const register = (e) => {
    $("#login-btn").buttonLoader("start");
    e.preventDefault();
    const emailORphone = document.getElementById("emailOrPhone").value;
    const user_pass = document.getElementById("password").value;
    const settings = {
        async: true,
        crossDomain: true,
        url: window.location.pathname,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ user_type: userType, emailORphone, user_pass }),
    };
    $.ajax(settings).done(function (res) {
        $("#login-btn").buttonLoader("stop");
        if (!res.user) {
            $("#modal-body-val").text("Email or password incorrect");
            $("#exampleModal").modal("show");
        } else window.location.href = `${window.location.pathname.split('/')[0]}/otp?user_id=${res.user.user_id}&emailORphone=${emailORphone}`;
    });
}
$('#isIndividual').click(function () { if (userType != "individual") userType = "individual"; });
$('#isEntity').click(function () { if (userType != "entity") userType = "entity"; });