const searchBtn = document.getElementById('search-btn');
const mealList  = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.m-details-contents');
const closeBtn = document.querySelector('.close-btn');
const favouriteMeals = document.getElementById('favourite-meals'); //Favourite Meal button to display

let favArray = []; //To store favourite meal IDs

// check if favArray exists in local Storage or not
if(!localStorage.getItem("favArray")){
    localStorage.setItem("favArray", JSON.stringify(favArray));
}else{
    favArray = JSON.parse(localStorage.getItem("favArray"));
}

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
mealList.addEventListener('click', addFavorite);
closeBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// get meal list that matches with the meal search
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                            <a href = "#" class = "fav-btn">Add Favourite</a>
                        </div>
                    </div>
                `;
                var favoriteButton = document.querySelectorAll('favourite');
                for (let button of favoriteButton) {
                  button.addEventListener('click', toggleFavorites);
                }
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

//When Fav-btn clicked
function addFavorite(e){
    e.preventDefault();
    if(e.target.classList.contains('fav-btn')){
        if(e.target.classList.contains('is-fav')){
            //remove the class
            e.target.classList.remove('is-fav');
        }else{
            //add the class
            e.target.classList.add('is-fav');
        }
    }
}

// create a modal
function mealRecipeModal(meal){
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
    mealDetailsContent.parentElement.classList.add('showRecipe');
}