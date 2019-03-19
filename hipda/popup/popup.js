window.onload = function () {
    var manifestData = chrome.runtime.getManifest();
    console.log(manifestData.version);

    document.getElementById('vernumber').innerText = 'v' + manifestData.version;

}
