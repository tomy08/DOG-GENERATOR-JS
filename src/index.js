// This code defines several functions that are used to interact with an API that provides dog images.

// This constant holds the URL of the API endpoint for saving favorite images.
const API_URL_FAVORITES = `https://api.thedogapi.com/v1/favourites?api_key=live_c6lMhShvb9iIc1o1FDZZf51xDv6p0rfqrk5i0fkKIjKBOoRqFc81miJBsnVqMGBp`;

// This constant holds a reference to an error message element on the page.
const spanError = document.getElementById("error");

// This function fetches a specified number of random dog images from the API and displays them on the page.
async function randomImgs() {
  // Get a reference to the container element that will hold the images.
  const imgContainer = document.querySelector("#container-random");

  // Get the number of images to fetch from the user's input.
  const limit = document.getElementById("input");

  // Construct the URL for the API endpoint for fetching random images.
  const API_URL_RANDOM = `https://api.thedogapi.com/v1/images/search?limit=${limit.value}`;

  // Clear the container element.
  imgContainer.replaceChildren(
    document.createRange().createContextualFragment(``)
  );

  // Send a request to the API to fetch the random images.
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();

  // If the request was not successful, display an error message.
  if (res.status !== 200) {
    spanError.innerText = `Something was wrong. ${res.status} error`;
  } else {
    // Loop through the array of fetched images and add each image to the page.
    for (let i = 0; i < limit.value; i++) {
      // Create a new `article` element to hold the current image.
      const article = document.createRange().createContextualFragment(`
        <article class="image-container">
        <img src=${data[i].url} />
        <button class="like-button" onclick=" " >🤍</button>
        </article>
       `);

      // Append the image to the page.
      imgContainer.append(article);

      // Get a reference to the "like" button for the current image.
      const btn = document.getElementsByClassName("like-button");

      // Attach an event listener to the button that calls the `saveFavourites` function when the button is clicked.
      btn[i].onclick = () => {
        saveFavourites(data[i].id);

        // Toggle the button text between a white heart and a red heart.
        btn[i].innerText === "🤍"
          ? (btn[i].innerText = "❤️")
          : (btn[i].innerText = "🤍");

        // Remove the event listener so that the user can't save the same image multiple times.
        btn[i].onclick = "";
      };
    }
  }
}

// This function sends a POST request to the API to save the specified image as a favorite.
async function saveFavourites(id) {
  // Send the POST request to the API, including the ID of the selected image.
  const res = await fetch(API_URL_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  const data = await res.json();

  // If the request was not successful, display an error message.
  if (res.status !== 200) {
    console.error(`Something was wrong. ${res.status} error`);
    spanError.innerText = `Something was wrong. ${res.status} error`;
  } else {
    // If the request was successful, call the loadFavourites function to update the display of the user's saved favorite images.
    loadFavourites();
  }
}

// This function fetches the user's saved favorite images from the API and displays them on the page.
async function loadFavourites() {
  // Send a request to the API to fetch the user's saved favorite images.
  const res = await fetch(API_URL_FAVORITES);
  const data = await res.json();

  // If the request was not successful, display an error message.
  if (res.status !== 200) {
    spanError.innerText = `Something was wrong. ${res.status} error`;
    console.error(`Something was wrong. ${res.status} error`);
  } else {
    // Get a reference to the container element for the saved favorite images.
    const section = document.getElementById("container-favourites");

    // Clear the container element.
    section.innerHTML = "";

    // Loop through the array of saved favorite images.
    data.forEach((element) => {
      // Create a new `article` element to hold the current image.
      const articleFavourite = document.createElement("article");
      articleFavourite.classList.add("image-container");

      // Create an `img` element to hold the image and set the `src` attribute of the `img` element to the URL of the current image.
      const img = document.createElement("img");
      img.src = element.image.url;

      // Create a "like" button for the image.
      const btn = document.createElement("button");
      btn.classList.add("like-button");

      // Attach an event listener to the button that calls the `deleteFavourites` function when the button is clicked.
      btn.onclick = () => deleteFavourites(element.id);

      // Add the red heart icon to the button.
      const btnTxt = document.createTextNode("❤️");
      btn.appendChild(btnTxt);

      // Add the image and button to the `article` element.
      articleFavourite.appendChild(img);
      articleFavourite.appendChild(btn);

      // Add the `article` element to the page
      section.appendChild(articleFavourite);
    });
  }
}

// This function is used to delete a favourite image using an API call.
async function deleteFavourites(id) {
  // Make a DELETE request to the API endpoint, passing the id of the image to be deleted.
  const res = await fetch(
    `https://api.thedogapi.com/v1/favourites/${id}?api_key=live_c6lMhShvb9iIc1o1FDZZf51xDv6p0rfqrk5i0fkKIjKBOoRqFc81miJBsnVqMGBp`,
    {
      method: "DELETE",
    }
  );

  // If the request was not successful, display an error message.
  if (res.status !== 200) {
    spanError.innerText = `Something was wrong. ${res.status} error`;
    console.error(`Something was wrong. ${res.status} error`);
  } else {
    // Reload the list of favourites.
    loadFavourites();
  }
}

// Call the function to load the list of favourites.
loadFavourites();
