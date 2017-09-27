document.addEventListener('DOMContentLoaded', function(e) {

    let socket = io.connect('http://localhost:8080');

    twig({id: 'facts', href: '/assets/template/facts.twig', async: false});

    document.querySelector("input[name='query']").addEventListener("input", function () {
        socket.emit('getFacts', this.value);
    });

    socket.on('loadFacts', function(facts) {
        document.querySelector(".facts").innerHTML = twig({ref:'facts'}).render({facts : facts});
    });
});