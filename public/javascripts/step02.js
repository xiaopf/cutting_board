
window.onload=function(){
	$('.submit_btn').click(function(){
		let wap_url = $('#wap_replace_path').val();
		let pc_url = $('#pc_replace_path').val();


		let wap_last_c = wap_url ? wap_url.slice(-1) : '';
		let pc_last_c = pc_url ? pc_url.slice(-1) : '';

		if(!(wap_url || pc_url)){
		    alert('请填写替换链接！');
		}else if(wap_last_c === '/' || pc_last_c === '/'){
		    alert('链接格式不正确，请删除 "/",再提交！');
		}else{
			$('form').submit();
		}
	})
}