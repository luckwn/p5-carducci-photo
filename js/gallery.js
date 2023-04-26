// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------POPULATE GALLERY WITH IMAGES -------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// General function to display the gallery
async function displayGallery(location) {
  // Display gallery
  location.style.display = "grid";
}

// General function to add the Bootstrap classes to the images
async function addBootstrapClasses(location, columns) {
  // Replace wrapItemInColumn
  // ==> add the classes in each image for bootstrap responsive design

  // Get a variable with all the images (HTML Collection) and convert it to an array
  let imagesInGallery = document.getElementsByClassName("gallery-item");
  let imagesInGalleryArray = [];

  for (let i = 0; i < imagesInGallery.length; i++) {
    imagesInGalleryArray[i] = imagesInGallery[i].outerHTML;
  }

  // IF columns is a number ==> should not happen
  if (typeof columns === "number" && columns !== null) {
    location.appendChild(
      `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
    );
    // ELSE IF => should happen
  } else if (typeof columns === "object" && columns !== null) {
    var columnClasses = ""; // Initiate the variable as an empty string

    for (const key in columns) {
      if (key !== "xs") {
        // Non regular case for xs where {key is not added}
        columnClasses += ` col-${key}-${Math.ceil(12 / columns[key])}`;
      } else if (key == "xs") {
        columnClasses += ` col-${Math.ceil(12 / columns[key])}`;
      }
    }

    // Add the <div> around
    const returnImages =
      imagesInGalleryArray
        .map(
          (imagesInGalleryArray) => `
  
                  <div class='item-column mb-4${columnClasses}'>${imagesInGalleryArray}</div>`
        )
        .join("") + "</div>";

    // Send the content written in the HTML page (errasing what was written previously)
    location.innerHTML = returnImages;
  } else {
    console.error(
      `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
    );
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region --------------------------CREATING THE FILTERING TAGS --------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

// General function to get all the tags from HTML images
async function displayAllTags(location) {
  //
  // GET THE TAGS FROM THE HTML
  //

  // Initiate the variables
  let tagsCollection = [];

  // Get a variable with all the images (HTML Collection)
  let imagesInGallery = document.getElementsByClassName("gallery-item");

  // Iterate on imagesInGallery to get all the tags
  let counter = 0;
  for (let i = 0; i < imagesInGallery.length; i++) {
    if (!tagsCollection.includes(imagesInGallery[i].dataset.tag)) {
      tagsCollection[counter] = imagesInGallery[i].dataset.tag;
      counter++;
    }
  }

  //
  // DISPLAY THE TAGS IN A LIST
  //

  // Turn tagsCollection to an array
  let tagsCollectionArray = [];

  for (let i = 0; i < tagsCollection.length; i++) {
    tagsCollectionArray[i] = tagsCollection[i];
  }

  const returnTagList =
    '<ul class="my-4 tags-bar nav nav-pills"><li class="nav-item active"><span class="nav-link active" data-tag="Tous">Tous</span></li>' +
    tagsCollectionArray
      .map(
        (tagsCollectionArray) => `
    <li class="nav-item">
    <span class="nav-link" data-tag="${tagsCollectionArray}">${tagsCollectionArray}</span></li>`
      )
      .join("") +
    "</ul>";

  if (showTags) {
    // IF the position (defined by user) is BOTTOM, display at the bottom
    if (tagsPosition === "bottom") {
      location.insertAdjacentHTML("beforeend", returnTagList); // on ajoute la liste des tags après la gallerie
    } else if (tagsPosition === "top") {
      // IF the position is TOP
      location.insertAdjacentHTML("afterbegin", returnTagList); // on ajoute la liste des tags avant la gallerie
    } else {
      console.error(`Unknown tags position: ${tagsPosition}`); // sinon on renvoie une erreur
    }
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ ADD TAGS LISTENERS ------------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function addFilteringFunction(filterBtns) {
  //EVENTS LISTENERS FOR CATEGORIES BUTTONS AND LOAD WORKS BY CATEGORIES
  for (let i = 0; i < filterBtns.length; i++) {
    //For each categorie

    filterBtns.item(i).addEventListener("click", function () {
      // Get the tag of the button clicked
      let selectedTag = filterBtns[i].dataset.tag;

      // Filter the tags
      filterImages(selectedTag);
    });
  }
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------- FUNCTION TO FILTER GALLERY ---------------------------- //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function filterImages(selectedTag) {
  // Get a variable with all the images (HTML Collection) and convert it to an array
  let individualsImagesContainers =
    document.getElementsByClassName("item-column");

  // Get the smaller containter of the images iot start the animation again
  let imagesContainer = document.getElementsByClassName("gallery-items-row");
  console.log(imagesContainer);
  imagesContainer[0].classList.remove("gallery-animate");
  console.log(imagesContainer);

  // Get all the tags and remove all previous active classes
  document.querySelector(".nav-link.active").classList.remove("active");

  // Get the present tag and add the active class to it
  document
    .querySelector(`span[data-tag="${selectedTag}"]`)
    .classList.add("active");

  // Loop in the imagesInGallery to hide the ones that does not match the tag
  // For each item in the HTML collection, check if the tag correspond to the
  // selected one => if so, display it ; if not, hide it.
  for (let item of individualsImagesContainers) {
    if (selectedTag !== "Tous") {
      if (item.firstChild.dataset.tag == selectedTag) {
        item.style.display = "flex"; // if the tag matches, then display
      } else if (item.firstChild.dataset.tag !== selectedTag) {
        item.style.display = "none"; // if the tag matches, then display
      }
    } else {
      item.style.display = "flex";
    }
  }

  imagesContainer[0].classList.add("gallery-animate");
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ GET ACTIVE TAG ------------------------------ //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

function getActiveTag() {
  return document.querySelector(".nav-link.active").dataset.tag;
}

// #endregion

// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //
// #region ------------------------------ ADD IMAGE LISTENERS ------------------------------ //
// ----------------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

async function addListenerLightBox(galleryItems) {
  //EVENTS LISTENERS FOR CATEGORIES BUTTONS AND LOAD WORKS BY CATEGORIES
  for (let i = 0; i < galleryItems.length; i++) {
    //For each categorie

    galleryItems.item(i).addEventListener("click", function (element) {
      //Create an event listener for each button (function from lightbox.js)

      openLightBox(
        element.currentTarget,
        lightboxId,
        navigation,
        IMAGE_GALLERY
      );
    });
  }
}

// #endregion
