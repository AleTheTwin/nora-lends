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
            <div class="alert alert-warning visually-hidden" id="alerta" role="alert">
                Debes iniciar sesión primero.
            </div>
            <div class="container-fluid  event-box" id="eventos"></div>
            <div class="speaking">
                <p id="speaking"></p>
                <img src="src/img/logo.png" width="50px" alt="">
            </div>
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
    <?php
    if (isset($_SESSION["token"])) {
    ?>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/IDMNYU/p5.js-speech@0.0.3/lib/p5.speech.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/addons/p5.sound.js" integrity="sha512-U2sgwrFhl+Tgx9iGH9h5Ba2WyIjyCes+D0prtIFw3a0V+/fkaeL5Cd/VjyPHno9kUPE1rnNhBGTyvtZsfJp0xg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="src/js/sketch.js"></script>

    <?php
    }
    ?>

    <?php include "footer.php" ?>
</body>

</html>