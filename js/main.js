const searchBox = document.querySelector(".search-input");
const inputBox = searchBox.querySelector("input");
const sugBox = searchBox.querySelector(".auto-compbox");
const addElements = document.querySelector(".search-container");

inputBox.addEventListener("keyup", debounce(searchUsers, 500));

sugBox.addEventListener("click", (e) => {
  let target = e.target;
  console.log(addElements)
  if (e.target.classList.contains('searching-elment')) {
    addElements.insertAdjacentHTML(
      "afterbegin",
      `<div class="element-add"><div class="info=element">Name:${target.textContent}<br>Owner:${target.dataset.owner}<br>Stars:${target.dataset.stars}</div>
      
      <img class="btn-close" src="img/Cross.png" alt="close">
      
      </div>`
    );
    clearUsers();
    inputBox.value ="";
  }
});

addElements.addEventListener('click', (e) =>{
    let target = e.target;
    if(!target.classList.contains('btn-close')) return
    target.parentElement.remove()
})

async function searchUsers(e) {
  const searcValue = e.target.value;
  if (searcValue) {
    clearUsers();
    return await fetch(
      `https://api.github.com/search/repositories?q=${searcValue}&per_page=5`
    ).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          res.items.forEach((user) => {
            sugBox.insertAdjacentHTML(
              "afterbegin",
              `<li class="searching-elment"data-owner="${user.owner.login}" data-stars="${user.stargazers_count}">${user.name}</li>`
            );
            searchBox.classList.add("active");
          });
          console.log(res);
        });
      } else {
      }
    });
  } else clearUsers();
}

function clearUsers() {
  sugBox.innerHTML = "";
  searchBox.classList.remove("active");
}

function debounce(func, wait, immed) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immed) func.apply(context, args);
    };
    const callNow = immed && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
