<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "header.php" ?>
</head>

<body>
    <?php include "navbar.php" ?>
    <main id="main" class="container-fluid event-box">

        <?php
        if (isset($_SESSION["token"])) {
        ?>

            

        <?php
        } else {
        ?>
            <div class="alert alert-warning" role="alert">
                Debes iniciar sesión primero.
            </div>


        <?php
        }
        ?>

    </main>
    <?php include "footer.php" ?>
</body>

</html>