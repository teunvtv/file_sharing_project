var concat = require('concat-stream')
var dragDrop = require('drag-drop/buffer')
var WebTorrent = require('webtorrent')

var client = new WebTorrent()

dragDrop('body', function(files){
    client.seed(files, onTorrent)
})

document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault()
    client.download({
        infoHash: document.querySelector('form input').value,
        announce: ['wss://tracker.webtorrent.io']
    }, onTorrent)
})

function onTorrent (torrent) {
    var log = document.querySelector('.log')
    log.innerHTML += 'Torrent info hash: ' + torrent.infoHash + '<br>'
    log.innerHTML += 'Downloading from ' + torrent.swarm.wires.lenght + 'peers<br>'

    torrent.files.forEach(function (file) {
        file.createReadStream().pipe(concat(function (buf){
            var a = document.createElement('a')
            a.download = file.name
            a.href = URL.createObjectURL(new Blob([ buf ]))
            a.textContent = 'download ' + file.name
            log.innerHTML += a.outerHTML + '<br>'
        }))
    })
}
