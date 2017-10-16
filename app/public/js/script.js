document.addEventListener('DOMContentLoaded', function () {

    let socket = io.connect('http://localhost:8080');
    twig({id: 'facts', href: '/assets/template/facts.twig', async: false});

    let formQuery = document.querySelector(".search-bar");
    let inputQuery = document.querySelector("input[name='query']");
    let inputMinDate = document.querySelector(".datepicker[data-type-date='min']");
    let inputMaxDate = document.querySelector(".datepicker[data-type-date='max']");
    let orderButtons = document.querySelectorAll(".order button");
    let sortButtons = document.querySelectorAll("span.arrow");
    let inputTypeSort;
    let inputOrderSort;
    let meterFilterButtons = document.querySelectorAll("button[data-meter-filter]");
    let inputMeterFilter = [];
    let changePageButtons = document.querySelectorAll("button[data-change-page]");
    let from = 0;
    let removeFilters = document.querySelector("button.remove-filters");

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
            let activeSort = document.querySelector("span.arrow.active");
            if (activeSort !== null && activeSort !== this) {
                activeSort.classList.remove("active");
            }
            this.classList.toggle("active");
            for (let i = 0; i < orderButtons.length; i++) {
                orderButtons[i].classList.remove("active");
            }
            this.parentNode.parentNode.classList.toggle("active");
            if (document.querySelector("span.arrow.active") === null) {
                document.querySelector("span.arrow[data-type-sort='_score'][data-order-sort='desc']").classList.add("active");
            }

            if (this.classList.contains("active")) {
                inputTypeSort = this.dataset.typeSort;
                inputOrderSort = this.dataset.orderSort;
            } else {
                inputTypeSort = "";
                inputOrderSort = "";
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

    for (let i = 0; i < changePageButtons.length; i++) {
        changePageButtons[i].addEventListener('click', function () {
            if (this.dataset.changePage === 'previous') {
                from -= 20;
            } else if (this.dataset.changePage === 'next') {
                from += 20;
            }
            changePageButtons[0].disabled = from === 0;
            emitQuery();
        })
    }

    removeFilters.addEventListener("click", function() {
        inputMinDate.value = "";
        inputMaxDate.value = "";
        inputTypeSort = "";
        inputOrderSort = "";
        for (let i = 0; i < orderButtons.length; i++) {
            orderButtons[i].classList.remove("active");
        }
        document.querySelector("span.arrow.active").classList.remove("active");
        document.querySelector("span.arrow[data-type-sort='_score'][data-order-sort='desc']").classList.add("active");
        document.querySelector("span.arrow[data-type-sort='_score'][data-order-sort='desc']").parentNode.parentNode.classList.add("active");
        inputMeterFilter = [];
        for (let i = 0; i < meterFilterButtons.length; i++) {
            meterFilterButtons[i].classList.remove("active");
        }
        emitQuery();
    });

    socket.on('loadFacts', function (facts) {
        let size = facts.length;
        if (size === 21) {
            facts.splice(20, 1);
        }
        changePageButtons[1].disabled = size !== 21;
        document.querySelector(".facts").innerHTML = twig({ref: 'facts'}).render({facts: facts});
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    function emitQuery() {
        socket.emit('getFacts', {
            inputQuery: inputQuery.value,
            inputDate: {min: inputMinDate.value, max: inputMaxDate.value},
            inputTypeSort: inputTypeSort,
            inputOrderSort: inputOrderSort,
            inputMeterFilter: inputMeterFilter,
            from: from
        });
    }
});
