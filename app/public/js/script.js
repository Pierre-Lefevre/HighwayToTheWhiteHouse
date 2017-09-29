document.addEventListener('DOMContentLoaded', function(e) {

    let socket = io.connect('http://localhost:8080');
    twig({id: 'facts', href: '/assets/template/facts.twig', async: false});

    let inputQuery = document.querySelector("input[name='query']");
    let filterButtons = document.querySelectorAll("button[data-meter-filter]");
    let activeFilters = [];
    let filterDateButton = document.querySelector("button[data-date-filter]");

    inputQuery.addEventListener("input", function () {
        emitQuery();
    });

    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', function() {
            let index = activeFilters.indexOf(this.dataset.meterFilter);
            if (index === -1) {
                activeFilters.push(this.dataset.meterFilter);
            } else {
                activeFilters.splice(index, 1);
            }
            this.classList.toggle('active');
            emitQuery();
        })
    }

    filterDateButton.addEventListener('click', function() {
        this.setAttribute("data-date-filter", this.dataset.dateFilter === "desc" ? "asc" : "desc");
        this.classList.toggle('active');
        emitQuery();
    });

    socket.on('loadFacts', function(facts) {
        document.querySelector(".facts").innerHTML = twig({ref:'facts'}).render({facts : facts});
    });

    function emitQuery() {
        socket.emit('getFacts', {
            inputQuery: inputQuery.value,
            inputMeterFilter: activeFilters,
            inputDateFilter: filterDateButton.dataset.dateFilter
        });
    }
});
