
document.getElementById("toggle").onclick = function() { //borrar
	
	let detailsContainer = document.getElementById("orderDetailsBackdrop");
	let details = document.getElementById("details");
	
	
	if(detailsContainer.classList.contains("open")) {


		details.classList.toggle("open");

		setTimeout(function() {detailsContainer.classList.toggle("open")}, 1000);


	} else {

		detailsContainer.classList.toggle("open");

		setTimeout(function() {details.classList.toggle("open")}, 50);

	}


}