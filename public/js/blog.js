$('#document').ready(() => {

	$('#submitThread').prop('disabled',true);

	$('#titleText').change(() => {
		if($.trim($('#titleText').val()) == ""){
			$('#titleText').css({
				'border' : '1px solid red'
			});
			$('#submitThread').prop('disabled',true);
		}else{
			$('#titleText').css({
				'border' : ""
			});
			$('#submitThread').prop('disabled',false);
		}
	});

	$('#submitThread').click(() => {
		let data = {};
		data.title = $('#titleText').val();
		$.ajax({
			type: 'POST',
			url: '/threads',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function() {
				window.location.href=window.location.href;
			}
		});
		console.log($('#titleText').val());
	});

	$('button').click((event) => {
		let id = event.target.id;
		console.log(id);
		$.ajax({
			type: 'GET',
			url: `/posts?id=${id}`,
			success: function() {
				window.location.href = `/posts?id=${id}`;
			}
		});
	});
});