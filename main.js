function callTwitterAPI() {
    const uri = "http://localhost:8188/UniProxService.svc/courses";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = () => {
        const resp = JSON.parse(xhr.responseText);
        displayCourses(resp.data);
    }
    xhr.send(null);
}

function main() {
    var msg = 'Hello World';
    console.log(msg);

    //function callTwitterAPI();
}

main();