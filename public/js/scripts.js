function rmLinks() {
	if(screen.width <= 768){
	let pjI = document.querySelectorAll('.projectItem > a');
		for(i = 0; i < pjI.length; i++){
			pjI[i].setAttribute('href','#projects');
		}
	}
}

function loadCV() {
	window.open('files/Resume.pdf');
}