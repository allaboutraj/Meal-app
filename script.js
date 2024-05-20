const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".m-details-contents");
const closeBtn = document.querySelector(".close-btn");
const favouriteMeals = document.getElementById("fav-like-button"); //Favourite Meal button to display
const toggleButton = document.getElementById("toggle-sidebar");
const favClose = document.getElementById("checkbtn2");
const sideBar = document.getElementById("sidebar");
/*Initialize the local storage items for favorite list */
const objectEle = "favMealList";
if (localStorage.getItem(objectEle) == null) {
  localStorage.setItem(objectEle, JSON.stringify([]));
}
//Toggle Sidebar
toggleButton.addEventListener("click", function () {
  showFabMealList();
  sideBar.classList.toggle("show");
});

//Close sidebar
favClose.addEventListener("click", function () {
  sideBar.classList.toggle("show");
});

// event listeners
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
// favouriteMeals.addEventListener("click", addFavorite);

closeBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

/* It will return truncated string greater then 50*/

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

/* Fetch mealss from API, url - The base URL for the API, value - The value to append to the URL for filtering the results */

const fetchMeal = async (url, value) => {
  const response = await fetch(`${url + value}`);
  const meal = await response.json();
  return meal;
};

// get meal list that matches with the meal search
function getMealList() {
  const list = JSON.parse(localStorage.getItem(objectEle));
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img loading="lazy" src = "${
                              meal.strMealThumb
                            }" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                            <a href = "#" class = "fav-btn" id="fav-like-button " 
                            ${favList(list, meal.idMeal) ? "active" : " "}
                            onclick="addRemoveToFavList('${
                              meal.idMeal
                            }')">Add Favourite</a>
                        </div>
                    </div>
                `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html;
    });
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

//When Fav-btn clicked
function addFavorite(e) {
  e.preventDefault();
  if (e.target.classList.contains("fav-btn")) {
    if (e.target.classList.contains("is-fav")) {
      //remove the class
      e.target.classList.remove("is-fav");
    } else {
      //add the class
      e.target.classList.add("is-fav");
    }
  }
}

// create a modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <button class="watch-btn">
                <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
            </button>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}

/*Check if an ID is in a list of favorites
 list- The list of favorites
 id- The ID to check*/

function favList(list, id) {
  let flag = false;
  for (let i = 0; i < list.length; i++) {
    if (id == list[i]) {
      flag = true;
    }
  }
  return flag;
}
/* It will return truncated string greater then 50*/

/*addRemoveToFavList - function to add or remove a movie from the favorite list
  The id of the movie to be added or removed
  This function first retrieves the data from local storage and then it checks if the provided movie id already exist in the favorite list.
  If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage*/

function addRemoveToFavList(id) {
  const PageLikeBtn = document.getElementById("fav-like-button");
  let db = JSON.parse(localStorage.getItem(objectEle));
  console.log("before: ", db);
  let ifExist = false;
  for (let i = 0; i < db.length; i++) {
    if (id == db[i]) {
      ifExist = true;
    }
  }
  if (ifExist) {
    db.splice(db.indexOf(id), 1);
  } else {
    db.push(id);
  }

  localStorage.setItem(objectEle, JSON.stringify(db));
  if (PageLikeBtn != null) {
    PageLikeBtn.innerHTML = isFav(db, id)
      ? "Remove From Favourite"
      : "Add To Favourite";
  }
  console.log("After:", db);
  getMealList();
  // showFabMealList();
}

/*
This function is used to show all the movies which are added to the favourite list.
html - This returns html which is used to show the favourite movies.
 If there is no favourite movie then it will show "Nothing To Show....."
showFavMealList()
*/

async function showFabMealList() {
  let FavList = JSON.parse(localStorage.getItem(objectEle));

  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";

  if (FavList.length == 0) {
    html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show</h1> </div>`;
  } else {
    for (let i = 0; i < FavList.length; i++) {
      const data = await fetchMeal(url, FavList[i]);
      const favmealList = data.meals[0];
      if (favmealList) {
        console.log(favmealList);
        let element = favmealList;
        html += `
          <div class="fav-item">
                <div class="fav-item-photo">
                <img src="${
                  element.strMealThumb == "N/A"
                    ? "image.png"
                    : element.strMealThumb
                }" alt="Image">
                </div>
                <div class="fav-item-details">
                         <div class="fav-item-name">
                                 
                        <span class="fav-item-text">
                        ${truncate(element.strMeal, 20)}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList('${
                      element.idMeal
                    }')">
                        Remove
                    </div>
            </div>
          </div> `;
      }
    }
  }
  document.getElementById("fav").innerHTML = html;
}
