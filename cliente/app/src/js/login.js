$("#login-form").submit(async (event) => {
    event.preventDefault();
    ocultarAlerta();
    let url = `${host}/autenticacion/login`;
    console.log(url);
    let usernameInput = $("#username-input").val();
    let passwordInput = $("#password-input").val();
    try {
        let { data: usuario } = await axios.post(url, {
            username: usernameInput,
            password: passwordInput,
        });
        
        location.href = `/functions/save_session.php?email=${usuario.email}&id=${usuario.id}&nombre=${usuario.nombre}&token=${usuario.token}&username=${usuario.username}`;
    } catch (error) {
        console.log(error);
        if (!error.response) {
            // alert("algo salió mal, reintente de nuevo más tarde")
            mostrarAlerta("algo salió mal, reintente de nuevo más tarde");
            return;
        }
        if (!error.response.data) {
            mostrarAlerta(error.message);
        }
        if (error.response.data.code != 0) {
            mostrarAlerta(error.response.data.error);
        }
    }
});
