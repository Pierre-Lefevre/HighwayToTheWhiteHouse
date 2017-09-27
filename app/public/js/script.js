document.addEventListener('DOMContentLoaded', function(e) {

    let activeFilters = [];

    let socket = io.connect('http://localhost:8080');

    twig({id: 'facts', href: '/assets/template/facts.twig', async: false});

    let inputQuery = document.querySelector("input[name='query']");

    inputQuery.addEventListener("input", function () {
        socket.emit('getFacts', this.value);
    });

    let filterButtons = document.querySelectorAll("button[data-filter]");

    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', function() {
            let index = activeFilters.indexOf(this.dataset.filter);
            if (index === -1) {
                activeFilters.push(this.dataset.filter);
            } else {
                activeFilters.splice(index,1);
            }
            this.classList.toggle('active');
            socket.emit('getFactsWithFilter', {
                filters: activeFilters,
                query: inputQuery.value
            });
        })
    }

    socket.on('loadFacts', function(facts) {
        document.querySelector(".facts").innerHTML = twig({ref:'facts'}).render({facts : facts});
    });


});