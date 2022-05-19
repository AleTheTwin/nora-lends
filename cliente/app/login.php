<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "header.php" ?>
</head>

<body>
    <?php include "navbar.php" ?>
    <main id="main" class="container-fluid login-box">
        <div class="alert alert-danger alert-dismissible fade show visually-hidden" id="alerta" role="alert">
            mensaje
        </div>
        <form id="login-form" class="text-center">
            <div class="mb-3">
                <label for="username-input" class="form-label">Nombre de usuario</label>
                <input type="text" class="form-control" name="username" id="username-input" aria-describedby="usernameHelp">
            </div>
            <div class="mb-3">
                <label for="password-input" class="form-label">Contraseña</label>
                <input type="password" class="form-control" name="password" id="password-input">
            </div>
            <input type="submit" class="btn btn-primary">
        </form>

    </main>
    <?php include "footer.php" ?>
    <script src="src/js/login.js"></script>
</body>

</html>