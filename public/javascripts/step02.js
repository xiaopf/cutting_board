
window.onload=function(){
	$('.submit_btn').click(function(){
		let wap_url = $('#wap_img_path').val();
		let pc_url = $('#pc_img_path').val();


		let wap_last_c = wap_url.slice(-1);
		let pc_last_c = pc_url.slice(-1);

		if(wap_last_c === '/' || pc_last_c === '/'){
		    alert('链接格式不正确，请删除 "/",再提交！');
		}else{
			$('form').submit();
		}
	})
}