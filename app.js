let cellid;
function uploadImage() {
  var input = document.getElementById("imageInput");
  var file = input.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    var img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      var container = document.getElementById("imageContainer");
      var idElement = document.getElementById("imageId");
      var elementId = Math.floor(Math.random() * 9000000000) + 1000000000;
      img.id = elementId;
      cellid = elementId;
      container.style.display = "block";
      container.innerHTML = "";
      container.appendChild(img);
      idElement.innerHTML = "Cell ID: " + elementId;
      let text = cellid;
      JsBarcode("#barcode", text);
      // Display content div after image upload
      document.getElementById("contentDiv").style.display = "block";
    };
  };

  reader.readAsDataURL(file);
}

// Smooth scrolling down to page sections when clicking on navigation links
document.querySelectorAll("header li a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    targetElement.scrollIntoView({ behavior: "smooth" });
  });
});

document
  .getElementById("submit-button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Hi");
    var file = document.getElementById("csv-file").files[0];
    var formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/upload_csv", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        var img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        document.getElementById("bodePlot").appendChild(img);
      })
      .catch((error) => console.error("Error:", error));
  });

// show circuit image on uploading csv file

const button = document.getElementById("submit-button");
const image = document.getElementById("my-image");
const graph = document.getElementById("bodePlot");
button.addEventListener("click", function () {
  image.style.display = "block";
  graph.style.display = "block";
});

// ___________________________
//battery percengae
function calculateSoH() {
  var rbMax = document.getElementById("rbMax").value;
  var rbCurrent = document.getElementById("rbCurrent").value;

  if (rbMax <= 0 || rbCurrent < 0) {
    document.getElementById("result").innerHTML =
      "Please enter valid values for Rb(Max) and Rb(current).";
    return;
  }

  var soh = (rbCurrent / rbMax) * 100;
  document.getElementById("result").innerHTML =
    "The state of health (SoH) is: " + soh + "%";

  var span = document.querySelector(".meter span");
  span.style.width = soh + "%";
}

