$('#document').ready(() => {

	$('#submitThread').prop('disabled',true);
	$('#submitPost').prop('disabled',true);

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

	$('#authorText,#postText').change(() => {
		if($.trim($('#authorText').val()) == ""){
			$('#authorText').css({
				'border' : '1px solid red'
			});
			$('#submitPost').prop('disabled',true);
		}else if($.trim($('#postText').val()) == ""){
			$('#postText').css({
				'border' : '1px solid red'
			});
			$('#submitPost').prop('disabled',true);
		}else{
			$('#authorText,#postText').css({
				'border' : ""
			});
			$('#submitPost').prop('disabled',false);
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
	});

	$('#submitPost').click(() => {
		let data = {};
		data.author = $('#authorText').val();
		data.post = $('#postText').val();
		data.parentID = parseInt($('#threadID').text());
		$.ajax({
			type: 'POST',
			url: '/posts',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function() {
				window.location.href=window.location.href;
			}
		});
	});

	$('.btn-success').click((event) => {
		let id = event.target.id;
		$.ajax({
			type: 'GET',
			url: `/posts?id=${id}`,
			success: function() {
				window.location.href = `/posts?id=${id}`;
			}
		});
	});

	$('.btn-danger.posts').click((event) => {
		let id = event.target.id;
		let pid = parseInt($('#threadID').text());
		$.ajax({
			type: 'DELETE',
			url: `/posts?id=${id}&&pid=${pid}`,
			success: function() {
				window.location.href = `/posts?id=${pid}`;
			}
		});
	});

	$('.btn-danger.threads').click((event) => {
		let id = event.target.id;
		$.ajax({
			type: 'DELETE',
			url: `/threads?id=${id}`,
			success: function() {
				window.location.href = '/threads';
			}
		});
	});
});