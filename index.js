const list = document.getElementsByClassName("list-container")[0];
const listItems = document.getElementsByClassName("list")[0];
const search = document.getElementById("searchbox");
const numberOfPagesSpan = document.getElementById("number-of-pages");
const pageNumber = document.getElementById("pageNumber");
const item = document.getElementsByClassName("item");
numberOfPagesSpan.innerHTML = "0";
pageNumber.innerHTML = "0";
cities = [];

// fetch("http://192.168.1.5:8081/cities")
//   .then((res) => res.json())
//   .then((r) => {
//     cities = [...r];
//     console.log(cities[0]);
//   });
url = 'http://192.168.1.8:8081/cities?q=';
// url = 'http://192.168.52.182:8081/cities?q=';
async function getData(searchValue) {
  const response = await fetch(url + searchValue)
  const res = await response.json();
  return res;
}

search.oninput = () => {
  const value = search.value.toLowerCase();
  if (value.length < 3) {
    return;
  }
  // console.log(cities.length);
  // const foundCities = cities.filter((el) =>
  //   el.name.toLowerCase().includes(value)
  // );
  getData(value)
    .then(data => {
      listFactory(data, value);
      list.classList.add("show");
    })
};

search.onblur = (event) => {
  if (!document.querySelector(".item:hover")) {
    list.classList.remove("show");
  }
};

search.onkeydown = (e) => {
  if (e.code == "Enter") {
    handleSearch();
    list.classList.remove("show");
  }
};

function handleClick(event) {
  search.value = event.currentTarget.innerText;
  list.classList.remove("show");
  handleSearch();
}

function listFactory(foundCities, value) {
  listItems.innerHTML = null;
  foundCities.every((el) => {
    let name = el.name;
    value = name.match(new RegExp(value, "ig"));
    name = name.replace(value, "<b>" + value + "</b>");
    listItems.innerHTML += `<li class="item" data-id="${el.id}"
        onclick="handleClick(event)">${name},
        ${el.state ? " " + el.state + "," : ""} 
        ${el.country}</li>`;
    if (foundCities.indexOf(el) > 4) {
      return false;
    }
    return true;
  });
}
foundCities = [];
function handleSearch() {
  this.number = 0;
  let value = search.value;
  value = value.split(",")[0].toLowerCase();
  console.log(value);
  if (value.length < 3) {
    return;
  }
  // this.foundCities = cities.filter((el) =>
  //   el.name.toLowerCase().includes(value)
  // );
  getData(value)
    .then(data => {
      this.foundCities = [...data];
      this.foundCities.sort((a, b) => (a.country < b.country ? -1 : 1));
      this.numberOfPages = Math.ceil(this.foundCities.length / 12);
      numberOfPagesSpan.innerHTML = this.numberOfPages;
      pageNumber.innerHTML = 1;
      showCards(this.foundCities);
    });
}

number = 0;
currentPage = 1;
numberOfPages = 1;
function showCards(foundCities) {
  let results = document.getElementsByClassName("results")[0];
  results.innerHTML = null;
  for (let i = this.number; i < 12 + this.number; i++) {
    const el = foundCities[i];
    if (!el) {
      return;
    }
    var url = "https://maps.google.com/?q=" + el.name + "," + el.country;
    let card = `<div class="card" onclick="cardClicked(event)" data-url="${url}">
                <p data-url="${url}">${el.name}</p>
                ${el.state ? `<p data-url="${url}">State - ${el.state}</p>` : ""
      }
                <p data-url="${url}">Country - ${el.country}</p>
            </div>`;
    results.innerHTML += card;
  }
}

function nextPage(e) {
  // console.log(this.number);
  // console.log('len--'+this.foundCities.length);
  if (
    this.foundCities.length < 12 ||
    this.number + 12 >= this.foundCities.length
  ) {
    return;
  }
  pageNumber.innerHTML = parseInt(pageNumber.innerHTML) + 1;
  this.number += 12;
  showCards(this.foundCities);
}
function prevPage(e) {
  if (this.number < 12) {
    return;
  }
  pageNumber.innerHTML = parseInt(pageNumber.innerHTML) - 1;
  this.number -= 12;
  showCards(this.foundCities);
}
function lastPage(e) {
  pageNumber.innerHTML = numberOfPages;
  this.number = (numberOfPages - 1) * 12;
  showCards(this.foundCities);
}
function firstPage(e) {
  pageNumber.innerHTML = 1;
  this.number = 0;
  showCards(this.foundCities);
}

function cardClicked(e) {
  window.open(e.target.dataset.url);
}
