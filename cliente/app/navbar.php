<nav id="nav" class="navbar bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">
            <img src="src/img/logo.png" width="35" alt=""> Nora Lends
        </a>
        <script>
            var token
        </script>
        <?php
        $actual = basename($_SERVER['REQUEST_URI']);
        if (isset($_SESSION["token"])) {

        ?>
            <script>
                const email = "<?php echo $_SESSION["email"]; ?>"
                const id = "<?php echo $_SESSION["id"]; ?>"
                const nombre = "<?php echo $_SESSION["nombre"]; ?>"

                token = "<?php echo $_SESSION["token"]; ?>"
                const username = "<?php echo $_SESSION["username"]; ?>"
            </script>
            <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
                <button style="margin-left: 10px;" class="btn btn-danger " onclick="location.href = 'functions/cerrar_sesión.php'" type="button">Salir</button>
            </form>

            <?php
        } else {
            if (!$actual == "login.php") {
            ?>

                <button class="btn btn-outline-success me-2" onclick="location.href = 'login.php'" type="button">Iniciar sesión</button>

        <?php
            }
        }
        ?>
    </div>
</nav>