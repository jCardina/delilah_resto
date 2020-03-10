
let goSignUpBtn = document.getElementById("goToSignUp").addEventListener("click", function() {
	 
	 document.getElementById("login").style.display = "none";
	 document.getElementById("signup").style.display = "block";


});

let goLoginBtn = document.getElementById("goToLoginBtn").addEventListener("click", function() {
	 
	 document.getElementById("signup").style.display = "none";
	 document.getElementById("login").style.display = "block";


});