async function init() {
    stations = await fetch('./stations/jakarta.json')
    stations = await stations.json()
    var currentstation = 0
    var power = 0
    var backToStation
    var stations
    var tapeMode = false

    function setRadioStation(val) {
        if (stations.data.content[0].items.length - 1 >= currentstation + val) {
            if (currentstation + val >= 0) {
                if (!tapeMode) {
                    currentstation += val
                    document.getElementsByClassName('lcd')[0].innerText = `${currentstation + 1}: LOADING...`

                    var stationid = stations.data.content[0].items[currentstation].page.url.substr(stations.data.content[0].items[currentstation].page.url.length - 8);
                    document.getElementById("audio").src = `https://radio.garden/api/ara/content/listen/${stationid}/channel.mp3`
                    document.getElementById("audio").addEventListener('canplaythrough', function () {
                        if (!tapeMode) {
                            document.getElementsByClassName('lcd')[0].innerText = `${currentstation + 1}: ${stations.data.content[0].items[currentstation].page.title}`
                        } else {
                            document.getElementsByClassName('lcd')[0].innerText = `1: TAPE >>>`
                        }
                    }, false);
                } else {
                    document.getElementsByClassName('lcd')[0].innerText = `1: TAPE >>>`
                }
            }
        }
    }

    function togglePower() {
        if (power == 1) {
            power = 0
            if (tapeMode) { document.getElementById("audio").pause() };
            document.getElementById("audio").muted = true
            document.getElementsByClassName('lcd')[0].style.color = '#00000000'
        } else {
            power = 1
            document.getElementById("audio").muted = false
            document.getElementById("audio").play()
            document.getElementsByClassName('lcd')[0].style.color = '#000000'
        }
    }

    function setVolume(val) {
        document.getElementById("audio").volume += val
        document.getElementsByClassName('lcd')[0].innerText = `Volume: ${Math.floor(document.getElementById("audio").volume * 100)}%`

        clearTimeout(backToStation)
        backToStation = setTimeout(function () {
            if (tapeMode) {
                document.getElementsByClassName('lcd')[0].innerText = `1: TAPE >>>`
            } else {
                document.getElementsByClassName('lcd')[0].innerText = `${currentstation + 1}: ${stations.data.content[0].items[currentstation].page.title}`
            }
        }, 1000)
    }

    function mutePlayer() {
        if (document.getElementById("audio").volume == 0) {
            document.getElementById("audio").volume = 1
        } else {
            document.getElementById("audio").volume = 0
        }
        document.getElementsByClassName('lcd')[0].innerText = `Volume: ${Math.floor(document.getElementById("audio").volume * 100)}%`

        clearTimeout(backToStation)
        backToStation = setTimeout(function () {
            if (tapeMode) {
                document.getElementsByClassName('lcd')[0].innerText = `1: TAPE >>>`
            } else {
                document.getElementsByClassName('lcd')[0].innerText = `${currentstation + 1}: ${stations.data.content[0].items[currentstation].page.title}`
            }
        }, 1000)
    }

    document.getElementById("location").addEventListener('change', async function () {
        clearTimeout(backToStation)
        stations = await fetch(document.getElementById("location").value)
        stations = await stations.json()
        currentstation = 0
        setRadioStation(0)
    })

    setRadioStation(0)
    document.getElementById('mutePlayer').onclick = function () { if (power == 1) { mutePlayer() } }
    document.getElementById('volup').onclick = function () { if (power == 1) { setVolume(0.01) } }
    document.getElementById('voldown').onclick = function () { if (power == 1) { setVolume(-0.01) } }
    document.getElementsByClassName('power')[0].onclick = function () { togglePower() }

    document.getElementById('stationup').onclick = function () {
        if (power == 1) {
            if (tapeMode) {
                document.getElementById("audio").currentTime += 5
            } else {
                setRadioStation(1)
            }
        }
    }

    document.getElementById('stationdown').onclick = function () {
        if (power == 1) {
            if (tapeMode) {
                document.getElementById("audio").currentTime -= 5
            } else {
                setRadioStation(-1)
            }
        }
    }

    document.getElementById('eject').onclick = function () {
        if (power == 1) {
            tapeMode = false
            setRadioStation(0)
        }
    }

    document.getElementById('play').onclick = function () {
        if (power == 1 && tapeMode) {
            document.getElementById("audio").play()
        }
    }

    document.getElementById('pause').onclick = function () {
        if (power == 1 && tapeMode) {
            document.getElementById("audio").pause()
        }
    }

    var buttons = document.getElementsByTagName('button')
    Array.prototype.slice.call(buttons).forEach(element => {
        element.addEventListener('click', function () {
            new Audio('516264__sem__key5.wav').play()
        })
    });

    document.getElementById('file').onchange = function (event) {
        var reader = new FileReader();
        reader.onload = function () {
            tapeMode = true
            var audio = document.getElementById("audio");
            audio.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }
}
init()