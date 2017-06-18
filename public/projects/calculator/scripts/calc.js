window.onload = function() {
	var buttons = document.getElementById('buttons');
	var clear = document.getElementById('clear');
	var answer = document.getElementById('answer');

	buttons.addEventListener('click', function(e) {
		//console.log(e.target);
		if(e.target.nodeName === 'LI'){
			var val = e.target.innerHTML;
			if(val==='='){
				try{
					answer.innerHTML = eval(answer.innerHTML);
				}catch(err){
					answer.innerHTML = 'Invalid Expression---Clear Me!';
				}
			}else{
				answer.innerHTML += val;
			}
		}
	});

	clear.addEventListener('click',function(e){
		answer.innerHTML='';
	});
}