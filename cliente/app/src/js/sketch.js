//create a new P5.SpeechRec object, a listener
let myRec = new p5.SpeechRec();
//disable continuous recognition so the myRec.onEnd callback function work
myRec.continuous = true;
// allow partial recognition (faster, less accurate)
myRec.interimResults = true;
//create a new P5.Speech object so the computer can talk to you
// let myVoice = new p5.Speech();

let myVoice = new p5.Speech();
function setup() {
    //create a canvas the size of your window
    noCanvas();

    //start recognition
    myRec.start();
    //set up recognition callback, what happens when there is a word recognized
    myRec.onResult = parseResult2;
    //set up a callback function to keep recognition going
    myRec.onEnd = restartRec;

    //say hello
    // myVoice.speak("what's your favorite color?");
}

function draw() {}

function parseResult() {
    let resultado = myRec.resultString.toLowerCase();
    console.log(resultado);
    let array = resultado.split(" ");
    if (array.includes("nora")) {
        // alert(resultado);

        let newArray = array.filter((word) => {
            return word != "nora";
        });

        resultado = newArray.join(" ");
        // alert(resultado);
        $("#chat").val(resultado);
        // $("#chat-form").submit();
    }
}

function parseResult2() {
    let resultado = myRec.resultString.toLowerCase();
    let array = resultado.split(" ")
    if(!array.includes("nora")) {
        return;
    }
    let index = array.indexOf("nora")
    array = array.slice(index)
    resultado = array.join(" ")
    $("#speaking").html(resultado);
    $(".speaking").addClass("speaking-active")
    sleep(2000).then(() => {
        let content = $("#speaking").html()
        console.log(`"${content}":"${resultado}"`);
        if (content == resultado) {
            $("#speaking").html("");
            $(".speaking").removeClass("speaking-active")
            if(resultado.includes("cierra sesión")) {
                location.href = "/functions/cerrar_sesión.php"
                return
            }
            $("#chat").val(resultado)
            $("#chat-form").submit()
        }
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//to make sure recognition restarts when it ends
function restartRec() {
    print("end");
    myRec.start();
}
