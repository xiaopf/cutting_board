
window.onload=function(){
	$('.submit_btn').click(function(){
		let storeId = $("#store_id").val();
		let wapUpload = $("#wap_upload").val();
		let pcUpload = $("#pc_upload").val();

		if(!storeId){
            alert("请填写商家ID!")
		}else if(!(wapUpload || pcUpload)){
            alert("请至少上传一张图片！")
		}else{
			$('form').submit();
		}

	})
}