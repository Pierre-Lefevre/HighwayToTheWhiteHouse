document.addEventListener('DOMContentLoaded', function () {

    let socket = io.connect('http://localhost:8080');
    twig({id: 'facts', href: '/assets/template/facts.twig', async: false});

    let formQuery = document.querySelector(".search-bar");
    let inputQuery = document.querySelector("input[name='query']");
    let inputMinDate = document.querySelector(".datepicker[data-type-date='min']");
    let inputMaxDate = document.querySelector(".datepicker[data-type-date='max']");
    let sortButtons = document.querySelectorAll("button.arrow");
    let inputSort = {};
    let meterFilterButtons = document.querySelectorAll("button[data-meter-filter]");
    let inputMeterFilter = [];

    emitQuery();

    formQuery.addEventListener("submit", function (e) {
        e.preventDefault();
        emitQuery();
        return false;
    });

    inputQuery.addEventListener("input", function () {
        emitQuery();
    });

    $(".datepicker").datepicker({dateFormat: 'yy-mm-dd'}).change(function () {
        emitQuery();
    });

    for (let i = 0; i < sortButtons.length; i++) {
        sortButtons[i].addEventListener('click', function () {
            this.classList.toggle("active");
            document.querySelector(".arrow[data-type-sort='" + this.dataset.typeSort + "'][data-order-sort='" + (this.dataset.orderSort === "desc" ? "asc" : "desc") + "']").classList.remove("active");
            if (this.classList.contains("active")) {
                inputSort[this.dataset.typeSort] = this.dataset.orderSort;
            } else {
                delete inputSort[this.dataset.typeSort];
            }
            emitQuery();
        });
    }

    for (let i = 0; i < meterFilterButtons.length; i++) {
        meterFilterButtons[i].addEventListener('click', function () {
            let index = inputMeterFilter.indexOf(this.dataset.meterFilter);
            if (index === -1) {
                inputMeterFilter.push(this.dataset.meterFilter);
            } else {
                inputMeterFilter.splice(index, 1);
            }
            this.classList.toggle('active');
            emitQuery();
        })
    }

    socket.on('loadFacts', function (facts) {
        document.querySelector(".facts").innerHTML = twig({ref: 'facts'}).render({facts: facts});
    });

    function emitQuery() {
        socket.emit('getFacts', {
            inputQuery: inputQuery.value,
            inputDate: {min: inputMinDate.value, max: inputMaxDate.value},
            inputSort: inputSort,
            inputMeterFilter: inputMeterFilter
        });
    }
});
