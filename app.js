let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();




var gm = require('gm').subClass({imageMagick: true});

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');






app.use(express.static('public'));
app.use("/upload",express.static("upload"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.get('/', function(req, res, next) {

    res.render('index',{
      title:'cut_pic'
    })

});

let target;

let wap_init_h, wap_img_h, wap_nums, wap_last_h, wap_last_rem, wap_style, wap_body;

let pc_init_h, pc_img_h, pc_nums, pc_last_h, pc_style, pc_body;

let store_id = 0;
let sale_id = 0;
let book_target;

let wap_insert_imgs = '', pc_insert_imgs = '';



app.get('/changePath', function(req, res, next) {

    res.render('step02',{
      title:'cut_pic'
    })

});

app.get('/step03', function(req, res, next) {



    res.render('step03',{
      wap:{
        h:wap_body,
        s:wap_style
      },
      pc:{
        h:pc_body,
        s:pc_style
      }
    })

});



app.post('/step02', function(req, res, next) {

  let wap_img_path = req.body.wap_img_path;
  let pc_img_path = req.body.pc_img_path;

  let wap_last_c = wap_img_path.slice(-1);
  let pc_last_c = pc_img_path.slice(-1);

  if(wap_last_c === '/' || pc_last_c === '/'){
    res.send('链接格式不正确，请后退，删除 "/",再提交！')
  }else{
    wap_body = wap_body.replace(/images/g, wap_img_path);
    pc_body = pc_body.replace(/images/g, pc_img_path);
    pc_style = pc_style.replace(/images/g, pc_img_path);




    var wapFiles = fs.readdirSync("./upload/wap/images/");
    wapFiles.forEach(function(file){
      fs.unlinkSync("./upload/wap/images/"+ file,function(err){
          console.log(err);
      })
    })
    var pcFiles = fs.readdirSync("./upload/pc/images/");
    pcFiles.forEach(function(file){
      fs.unlinkSync("./upload/pc/images/"+ file,function(err){
          console.log(err);
      })
    })


    res.redirect('/step03');
  }





})



app.post('/step01', multipartMiddleware, function(req, res, next) {

      target = req.body.book_target;

      store_id = req.body.store_id.trim();
      sale_id = req.body.sale_id.trim();

      book_target = req.body.book_target;
      wap_init_h = req.body.wap_init_h;
      pc_init_h = req.body.pc_init_h;

      let wap_img_path = req.files.wap_upload.path;
      let wap_new_path = path.join(__dirname,'/upload/wap/wap.jpg')

      let pc_img_path = req.files.pc_upload.path;
      let pc_new_path = path.join(__dirname,'/upload/pc/pc.jpg')


      fs.readFile(wap_img_path,function(err,data){
          if(err){
            console.log(err);
          }

          fs.writeFile(wap_new_path,data,function(err,data){
            if(err){console.log(err);};
              gm("./upload/wap/wap.jpg").size(function (err, size) {
                if (err){
                  console.log(err);
                }else{

                  wap_img_h = size.height;

                  wap_nums = Math.floor(wap_img_h/wap_init_h);

                  wap_last_h = wap_img_h - wap_init_h * wap_nums;
                  wap_last_rem = wap_last_h/40;

                  wap_insert_imgs = '';
                  for( let i = 0; i < wap_nums + 1; i ++){

                    if(i < wap_nums){

                      wap_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="">\n';


                      gm("./upload/wap/wap.jpg").crop(640, wap_init_h, 0, i * wap_init_h).write("./upload/wap/images/bg_" + i +".jpg" ,function(err){
                          if(err){console.log(err);};
                      });

                    }else{

                      wap_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="" style="height:' + wap_last_rem + 'rem">\n';

                      gm("./upload/wap/wap.jpg").crop(640, wap_last_h, 0, i * wap_init_h).write("./upload/wap/images/bg_" + i +".jpg" ,function(err){
                        if(err){console.log(err);};



                        wap_style = ` *{ margin:0; padding:0}
                                           img{ display:block; border:0;}
                                           .w1024{ width:16rem; margin:0 auto; }
                                           .w1024 img{width:16rem; height:${wap_init_h/40}rem}`;

                        wap_body = target === 'book_shop'?

                                   `  <div class="w1024">
                                    <a href="/m/order/appoint/${store_id}/0/${ sale_id !== 0 ? '?cash_id=' + sale_id + '&from=cash' : ''}">
                                       ${wap_insert_imgs}
                                    </a>            
                                    <div style="width:16rem;height:2rem;margin:0 auto;color:white;font-size: 0.6rem;text-align: center;line-height: 2rem;background:#606370;">注：此活动与苹果公司无关</div>
                                    </div>
                                    <script>hapj(function(H){H.get('bootstrap').initAppointHbh()})</script>` : 

                                    `  <div class="w1024">
                                    <a href="/m/order/expo/appointexpo?store_id=${store_id}">
                                       ${wap_insert_imgs}
                                    </a>            
                                    <div style="width:16rem;height:2rem;margin:0 auto;color:white;font-size: 0.6rem;text-align: center;line-height: 2rem;background:#606370;">注：此活动与苹果公司无关</div>
                                    </div>
                                    <script>hapj(function(H){H.get('bootstrap').initAppointHbh()})</script>`







// pcpc!!!!!!!!!!!!!
                        fs.readFile(pc_img_path,function(err,data){
                            if(err){
                              console.log(err);
                            }

                            fs.writeFile(pc_new_path,data,function(err,data){
                              if(err){console.log(err);};
                              gm("./upload/pc/pc.jpg").size(function (err, size) {
                                if (err){
                                  console.log(err);
                                }else{

                                  pc_img_h = size.height;
                                  pc_nums = Math.floor(pc_img_h/pc_init_h);
                                  pc_last_h = pc_img_h - pc_init_h * pc_nums;

                                  pc_insert_imgs='';
                                  for( let i = 0; i < pc_nums + 1; i ++){


                                    if(i < pc_nums){

                                      pc_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="">\n';


                                      gm("./upload/pc/pc.jpg").crop(1220, pc_init_h, 0, i * pc_init_h).write("./upload/pc/images/bg_" + i +".jpg" ,function(err){
                                          if(err){console.log(err);};
                                      });

                                    }else{

                                      pc_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="">\n';

                                      gm("./upload/pc/pc.jpg").crop(1220, pc_last_h, 0, i * pc_init_h).write("./upload/pc/images/bg_" + i +".jpg" ,function(err){
                                        if(err){console.log(err);};


                                        gm("./upload/pc/pc.jpg").crop(360, pc_img_h, 0, 0).write("./upload/pc/bgbg_01.jpg" ,function(err){
                                            if(err){console.log(err);};
                                            gm("./upload/pc/pc.jpg").crop(360, pc_img_h, 1560, 0).write("./upload/pc/bgbg_03.jpg" ,function(err){
                                                if(err){console.log(err);};
                                                gm(1200, pc_img_h, "#fff").write("./upload/pc/bgbg_02.jpg", function (err) {
                                                    if(err){console.log(err);};
                                                    gm("./upload/pc/bgbg_01.jpg")
                                                    .append("./upload/pc/bgbg_02.jpg", "./upload/pc/bgbg_03.jpg", true)
                                                    .write("./upload/pc/images/bgbg.jpg" ,function(err){
                                                      if(err){console.log(err);};

                                                      pc_style = ` *{ margin:0; padding:0}
                                                                    img{ display:block; font-size:0; border:0;}
                                                                    .big{ width:100%; margin: 0 auto; background: #FFFFFF url(images/bgbg.jpg) no-repeat top center}
                                                                    .w1024{ width:1220px; margin:0 auto; overflow:hidden;position:relative;}
                                                                    a {outline: none;}
                                                                    a:active {star:expression(this.onFocus=this.blur());}
                                                                    :focus { outline:0; }
                                                                    img::selection {
                                                                        background-color: transparent;
                                                                     }
                                                                    .w10241 {width:1220px; margin:0 auto; overflow:hidden;position:relative;}`



                                                      pc_body = target === 'book_shop'?

                                                                `  <div class="big">
                                                                    <div class="w1024">
                                                                      <a href="/order/appoint/${store_id}/0/${ sale_id !== 0 ? '?from=cash&cash_id=' + sale_id + '&iframe=iframe' : ''}">
                                                                      ${pc_insert_imgs}
                                                                     </a>
                                                                    </div>
                                                                    </div>
                                                                    <script>hapj(function(H){H.get('bootstrap').initAppointHbh()})</script>`  :

                                                                `  <div class="big">
                                                                    <div class="w1024">
                                                                     <a class="appoint_product_add_button" storeid="${store_id}" onclick="return false;" href="http://tj.expo.jiehun.com.cn/" name="it's_mianfeiyuyue_e">
                                                                      ${pc_insert_imgs}
                                                                     </a>
                                                                    </div>
                                                                    </div>
                                                                    <script>hapj(function(H){H.get('bootstrap').initAppointHbh()})</script>`;


                                                      if(fs.exists(wap_new_path)){
                                                          fs.unlink(wap_new_path,function(err){
                                                            if(err){console.log(err)}
                                                          })
                                                      }
                                                      if(fs.exists(pc_new_path)){
                                                        fs.unlink(pc_new_path,function(err){
                                                          if(err){console.log(err)}
                                                        })
                                                      }
                                                      if(fs.exists('./upload/pc/bgbg_01.jpg')){
                                                        fs.unlink('./upload/pc/bgbg_01.jpg',function(err){
                                                          if(err){console.log(err)}
                                                        })
                                                      }
                                                      if(fs.exists('./upload/pc/bgbg_02.jpg')){
                                                        fs.unlink('./upload/pc/bgbg_02.jpg',function(err){
                                                          if(err){console.log(err)}
                                                        })
                                                      }
                                                      if(fs.exists('./upload/pc/bgbg_03.jpg')){
                                                        fs.unlink('./upload/pc/bgbg_03.jpg',function(err){
                                                          if(err){console.log(err)}
                                                        })
                                                      }




                                                      res.redirect('/changePath')




                                                    });
                                                });
                                            });

                                        });


                                      });

                                    }

                                  } 
                                }
                              })


                            })
                        })

                      });

                    }

                  } 
                }
              })
      })




    
});





	    
	});

















  let server = app.listen(4000, function () {
      console.log("running localhost:4000...");
  })





