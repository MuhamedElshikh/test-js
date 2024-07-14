/// <reference types="../@types/jquery" />

$(document).ready(function () {
  $(".btn-menu").on("click", function () {
    $(".navbar-menu").toggle(1000);
    $(".open").toggle();
    $(".close").toggle();
  });
  let id = "#all";
  async function firstdata() {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s`
      );
      let data = await res.json();
      displayMeals(data.meals, "#all");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  firstdata();

  function displayMeals(meals, target) {
    let cartona = "";
    meals.forEach((mealData) => {
      cartona += `
        <div class="meal-container relative overflow-hidden m-2 cursor-pointer" data-id="${mealData.idMeal}">
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" class="w-full h-full object-cover">
          <div class="overlay absolute text-black">
            <h2>${mealData.strMeal}</h2>
          </div>
        </div>`;
    });
    $(".loder").hide();
    $(target).html(cartona);

    $(".meal-container").on("click", function () {
      $(".loder").show();
      const idMeal = $(this).data("id");
      getMealDetails(idMeal);
    });
  }

  async function getMealDetails(idMeal) {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      let data = await res.json();
      displayMealDetails(data.meals);
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  }

  function displayMealDetails(meals) {
    let cartona = "";
    let ingredients = "";

    meals.forEach((mealData) => {
      for (let i = 1; i <= 20; i++) {
        if (mealData[`strIngredient${i}`]) {
          ingredients += `<li class="text-white rounded-lg text-center text-[15px] px-3 bg-gray-600">${
            mealData[`strMeasure${i}`]
          } ${mealData[`strIngredient${i}`]}</li>`;
        }
      }

      cartona = `
        <i id="close" class="fa-regular fa-circle-xmark absolute end-5 top-5 cursor-pointer text-[25px] hover:text-black hover:bg-white hover:rounded-full transition-all duration-700"></i>
        <div class="col-span-5">
          <img class="mt-6 rounded-lg overflow-hidden" src="${
            mealData.strMealThumb
          }" alt="">
          <h2 class="text-[15px]">${mealData.strMeal}</h2>
        </div>
        <div class="col-span-7">
          <h2 class="text-[32px] mt-6">Instructions</h2>
          <p>${mealData.strInstructions}</p>
          <h2 class="text-[32px]">Area: <span>${mealData.strArea}</span></h2>
          <h2 class="text-[32px]">Category: <span>${
            mealData.strCategory
          }</span></h2>
          <h2 class="text-[32px]">Recipes: <ul class="flex gap-2 flex-wrap">${ingredients}</ul></h2>
          <h2 class="mb-2 text-[32px]">Tags: </h2>
          <p class="w-fit mb-8 text-white rounded-lg text-center text-[15px] px-3 bg-gray-600">${
            mealData.strTags ? mealData.strTags : "No tags available"
          }</p>
          <a href="${
            mealData.strSource
          }" class="py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-800 focus:bg-green-800 border border-5 border-green-900">source</a>
          <a href="${
            mealData.strYoutube
          }" class="py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-700 focus:bg-red-700 border border-5 border-red-900">youtube</a>
        </div>`;
    });
    $(".loder").hide();
    $("#diss").html(cartona);
    $("#all").hide();
    $("#searchResults").hide();
    $("#Categories").hide();
    $("#Area").hide();
    $("#Ingredients").hide();
    $("#contact").hide();
    $("#diss").show();

    $("#close").on("click", function () {
      $("#diss").hide();
      $("#searchResults").show();
      $(id).show();
    });
  }

  $("#btn-search").on("click", function () {
    $(".navbar-menu").toggle(1000);
    $("#all").hide();
    $("#search").show();
    $("#Categories").hide();
    $("#Area").hide();
    $("#diss").hide();
    $("#Ingredients").hide();
    $("#contact").hide();
    $(".open").toggle();
    $(".close").toggle();
  });

  $("#searchByName").on("blur", function () {
    let x = $("#searchByName").val();
    searchdata(x);
    $(".loder").show();
  });

  async function searchdata(inputSearch) {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputSearch}`
      );
      let data = await res.json();
      if (data.meals) {
        displayMeals(data.meals, "#searchResults");
        id = $("#searchResults");
      } else {
        $("#searchResults").html(`<p class="text-white">No results found</p>`);
      }
      $(".loder").hide();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  $("#searchByFirst").on("keyup", function () {
    let x = $("#searchByFirst").val();
    if (x == "") {
      $("#searchResults").html(`<p class="text-white">No results found</p>`);
    } else {
      searchByFirst(x);
      $(".loder").show();
    }
  });

  async function searchByFirst(inputSearch) {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${inputSearch}`
      );
      let data = await res.json();
      if (data.meals) {
        displayMeals(data.meals, "#searchResults");
        id = $("#searchResults");
      } else {
        $("#searchResults").html(`<p class="text-white">No results found</p>`);
      }
      $(".loder").hide();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  $("#btn-Categories").on("click", function () {
    $(".navbar-menu").toggle(1000);
    $("#all").hide();
    $("#search").hide();
    $("#Categories").show();
    $("#Area").hide();
    $("#diss").hide();
    $("#contact").hide();
    $("#Ingredients").hide();
    $(".open").toggle();
    $(".close").toggle();
    categories();
  });

  async function categories() {
    $(".loder").show();
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/categories.php`
      );
      let data = await res.json();
      displayCategories(data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayCategories(categories) {
    let cartona = "";
    categories.forEach((category) => {
      cartona += `
        <div class="category-container relative overflow-hidden m-2 cursor-pointer" data-category="${category.strCategory}">
          <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full h-full object-cover">
          <div class="overlay overflow-hidden absolute text-black">
            <h2>${category.strCategory}</h2>
            <p class="line-clamp-3">${category.strCategoryDescription}</p>
          </div>
        </div>`;
    });
    $(".loder").hide();
    $("#Categories").html(cartona);
    $(".category-container").on("click", function () {
      const CategoryMeal = $(this).data("category");
      getCategoryDetails(CategoryMeal);
      id = $("#Categories");
    });
  }

  async function getCategoryDetails(CategoryMeal) {
    $(".loder").show();
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${CategoryMeal}`
      );
      let data = await res.json();
      displayMeals(data.meals, "#Categories");
      $(".loder").hide();
      id = $("#Categories");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function Area() {
    $(".loder").show();
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
      );
      let data = await res.json();
      displayArea(data.meals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayArea(area) {
    let cartona = "";
    area.forEach((Area) => {
      cartona += `
        <div class="area-container flex flex-col justify-center items-center relative overflow-hidden m-2 cursor-pointer" data-area="${Area.strArea}">
          <i class="fa-solid fa-house-laptop fa-4x text-white"></i>
          <h2 class="text-white">${Area.strArea}</h2>
        </div>`;
    });
    $(".loder").hide();
    $("#Area").html(cartona);
    $(".area-container").on("click", function () {
      const areaMeal = $(this).data("area");
      getAreaMeals(areaMeal);
      id = $("#Area");
    });
  }

  $("#btn-Area").on("click", function () {
    $(".navbar-menu").toggle(1000);
    $("#all").hide();
    $("#search").hide();
    $("#Categories").hide();
    $("#Area").show();
    $("#contact").hide();
    $("#diss").hide();
    $("#Ingredients").hide();
    $(".open").toggle();
    $(".close").toggle();
    Area();
  });

  async function getAreaMeals(areaName) {
    $(".loder").show();
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
      );
      let data = await res.json();
      displayMeals(data.meals, "#Area");
      $(".loder").hide();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  $("#btn-Ingredients").on("click", function () {
    $(".navbar-menu").toggle(1000);
    $("#all").hide();
    $("#search").hide();
    $("#Categories").hide();
    $("#contact").hide();
    $("#Area").hide();
    $("#Ingredients").show();
    $("#diss").hide();
    $(".open").toggle();
    $(".close").toggle();
    Ingredients();
  });

  async function Ingredients() {
    $(".loder").show();
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
      );
      let data = await res.json();
      displayIngredients(data.meals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayIngredients(Ingredients) {
    let cartona = "";
    Ingredients.forEach((Ingredient) => {
      cartona += `
        <div class="Ingredients-container flex flex-col justify-center items-center relative overflow-hidden m-2 cursor-pointer" data-ingredient="${Ingredient.strIngredient}">
          <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
          <h2 class="text-white">${Ingredient.strIngredient}</h2>
          <p class="text-white line-clamp-3">${Ingredient.strDescription}</p>
        </div>`;
    });
    $(".loder").hide();
    $("#Ingredients").html(cartona);
    $(".Ingredients-container").on("click", function () {
      const ingredient = $(this).data("ingredient");
      getIngredientsMeals(ingredient);
      id = $("#Ingredients");
    });
  }

  async function getIngredientsMeals(ingredient) {
    $(".loder").show();
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      let data = await res.json();
      displayMeals(data.meals, "#Ingredients");
      $(".loder").hide();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});

$("#btn-contact").on("click", function () {
  console.log("sasd");
  $(".navbar-menu").toggle(1000);
  $(".open").toggle();
  $(".close").toggle();
  $("#all").hide();
  $("#search").hide();
  $("#Area").hide();
  $("#details").hide();
  $("#Ingredients").hide();
  $("#Categories").hide();
  $("#contact").show();
  validateForm();
});

function validateForm() {
  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex =
    /^[\+]?[0-9]{0,3}(\W?\(?)?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  const ageRegex = /\b([1-9]|[1-9][0-9]|[1-7][0-9]|80)\b/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  $("#name").on("keyup", function () {
    const name = $("#name").val();
    if (nameRegex.test(name)) {
      $("#name").removeClass("border-red-500 focus:border-red-700");
      $("#name").addClass("border-green-500 focus:border-green-700");
      $("#name-text").addClass("hidden");
      $("#name-text").removeClass("block");
    } else {
      $("#name").removeClass("border-green-500 focus:border-green-700");
      $("#name").addClass("border-red-500 focus:border-red-700");
      $("#name-text").addClass("block");
      $("#name-text").removeClass("hidden");
    }
  });

  $("#email").on("keyup", function () {
    const email = $("#email").val();
    if (emailRegex.test(email)) {
      $("#email").removeClass("border-red-500 focus:border-red-700");
      $("#email").addClass("border-green-500 focus:border-green-700");
      $("#email-text").addClass("hidden");
      $("#email-text").removeClass("block");
    } else {
      $("#email").removeClass("border-green-500 focus:border-green-700");
      $("#email").addClass("border-red-500 focus:border-red-700");
      $("#email-text").addClass("block");
      $("#email-text").removeClass("hidden");
    }
  });

  $("#phone").on("keyup", function () {
    const phone = $("#phone").val();
    if (phoneRegex.test(phone)) {
      $("#phone").removeClass("border-red-500 focus:border-red-700");
      $("#phone").addClass("border-green-500 focus:border-green-700");
      $("#phone-text").addClass("hidden");
      $("#phone-text").removeClass("block");
    } else {
      $("#phone").removeClass("border-green-500 focus:border-green-700");
      $("#phone").addClass("border-red-500 focus:border-red-700");
      $("#phone-text").addClass("block");
      $("#phone-text").removeClass("hidden");
    }
  });

  $("#age").on("keyup", function () {
    const age = $("#age").val();
    if (ageRegex.test(age)) {
      $("#age").removeClass("border-red-500 focus:border-red-700");
      $("#age").addClass("border-green-500 focus:border-green-700");
      $("#age-text").addClass("hidden");
      $("#age-text").removeClass("block");
    } else {
      $("#age").removeClass("border-green-500 focus:border-green-700");
      $("#age").addClass("border-red-500 focus:border-red-700");
      $("#age-text").addClass("block");
      $("#age-text").removeClass("hidden");
    }
  });

  $("#password").on("keyup", function () {
    const password = $("#password").val();
    if (passwordRegex.test(password)) {
      $("#password").removeClass("border-red-500 focus:border-red-700");
      $("#password").addClass("border-green-500 focus:border-green-700");
      $("#password-text").addClass("hidden");
      $("#password-text").removeClass("block");
    } else {
      $("#password").removeClass("border-green-500 focus:border-green-700");
      $("#password").addClass("border-red-500 focus:border-red-700");
      $("#password-text").addClass("block");
      $("#password-text").removeClass("hidden");
    }

    validatePassword();
  });

  $("#re-password").on("keyup", function () {
    validatePassword();
  });

  const validatePassword = () => {
    const confirmPassword = $("#re-password").val();
    const password = $("#password").val();

    if (confirmPassword === password && confirmPassword !== "") {
      $("#re-password").removeClass("border-red-500 focus:border-red-700");
      $("#re-password").addClass("border-green-500 focus:border-green-700");
      $("#re-password-text").addClass("hidden");
      $("#re-password-text").removeClass("block");
    } else {
      $("#re-password").removeClass("border-green-500 focus:border-green-700");
      $("#re-password").addClass("border-red-500 focus:border-red-700");
      $("#re-password-text").addClass("block");
      $("#re-password-text").removeClass("hidden");
    }
  };

  $(window).on("keyup", function () {
    const nameInput = $("#name");
    const emailInput = $("#email");
    const phoneInput = $("#phone");
    const ageInput = $("#age");
    const passwordInput = $("#password");
    const cPasswordInput = $("#re-password");
    if (
      nameInput.hasClass("border-green-500") &&
      emailInput.hasClass("border-green-500") &&
      phoneInput.hasClass("border-green-500") &&
      ageInput.hasClass("border-green-500") &&
      passwordInput.hasClass("border-green-500") &&
      cPasswordInput.hasClass("border-green-500")
    ) {
      $("#btn-submit").prop("disabled", false);
    } else {
      $("#btn-submit").prop("disabled", true);
    }
  });

  $("#btn-submit").on("click", function (e) {
    e.preventDefault();
    $("#name").val("");
    $("#email").val("");
    $("#phone").val("");
    $("#age").val("");
    $("#password").val("");
    $("#re-password").val("");

    $("#name").removeClass("border-green-500 focus:border-green-700");
    $("#email").removeClass("border-green-500 focus:border-green-700");
    $("#phone").removeClass("border-green-500 focus:border-green-700");
    $("#age").removeClass("border-green-500 focus:border-green-700");
    $("#password").removeClass("border-green-500 focus:border-green-700");
    $("#re-password").removeClass("border-green-500 focus:border-green-700");
    $("#btn-submit").prop("disabled", true);
  });
}
