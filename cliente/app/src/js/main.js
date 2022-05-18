async function main() {
    var body =
        '<?xml version="1.0" encoding="utf-8"?>\
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
        <Body>\
            <get_response xmlns="spyne.examples.hello.soap">\
                <mensaje>traeme mis eventos</mensaje>\
            </get_response>\
        </Body>\
    </Envelope>';

    try {
        var url = "http://192.168.1.107:8000";
        soap(url)
    //     axios.post(url, body, {
    //         headers: {
    //             "SOAPAction": "get_response",
    //             "Content-Type": 'text/xml; charset="utf-8"',
    //         },
    //     })
    //     .then((response) => {
    //         console.log(response.data)
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    //     // console.log(cliente)
    //     // alert("hola")
    } catch (err) {
        console.log(err);
    }
}

function soap(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*")
    xmlhttp.setRequestHeader("Content-Type", 'text/xml; charset="utf-8"')
    xmlhttp.setRequestHeader("Accept", "*/*")
    xmlhttp.setRequestHeader("Accept-Language", "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3")
    xmlhttp.setRequestHeader("Accept-Encoding", "gzip, deflate, br")
    xmlhttp.setRequestHeader("Sec-Fetch-Site", "same-origin")
    xmlhttp.setRequestHeader("Sec-Fetch-Mode", "cors")
    xmlhttp.setRequestHeader("Sec-Fetch-Dest", "empty")
    xmlhttp.setRequestHeader("SOAPAction", "get_response")




    // build SOAP 
    var body =
        '<?xml version="1.0" encoding="utf-8"?>\
        <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\
        <Body>\
            <get_response xmlns="spyne.examples.hello.soap">\
                <mensaje>traeme mis eventos</mensaje>\
            </get_response>\
        </Body>\
    </Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                alert(xmlhttp.responseText);
                // alert('done. use firebug/console to see network response');
            }
        }
    };
    // Send the POST request
    console.log(xmlhttp)
    xmlhttp.send(body);
    // send request
    // ...
}

main();
