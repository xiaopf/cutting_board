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






let target;

let wap_init_h, wap_img_h, wap_nums, wap_last_h, wap_last_rem, wap_style, wap_body, wap_img_path = '', wap_new_path,wap_replace_path;

let pc_init_h, pc_img_h, pc_nums, pc_last_h, pc_style, pc_body, pc_img_path = '', pc_new_path,pc_replace_path;

let store_id = 0;
let sale_id = 0;
let book_city = 'tj';

let category_id = 0;
let subject_pc_id = 0;
let subject_wap_id = 0;




let good_id = '';




let wap_insert_imgs = '', pc_insert_imgs = '';





app.get('/', function(req, res, next) {
    wap_img_path = '';
    pc_img_path = '';
    wap_insert_imgs = ''; 
    pc_insert_imgs = '';
    wap_style= '';
    wap_body= '';
    pc_style= '';
    pc_body= '';

    res.render('index',{
      title:'cut_pic'
    })

});


app.get('/changePath', function(req, res, next) {

    res.render('step02',{
      wap_url: wap_img_path.indexOf('.') > 0 ? true: false ,
      pc_url: pc_img_path.indexOf('.') > 0 ? true : false
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

  wap_replace_path = String(req.body.wap_replace_path).trim();
  pc_replace_path = String(req.body.pc_replace_path).trim();

  let wap_last_c = wap_replace_path.slice(-1);
  let pc_last_c = pc_replace_path.slice(-1);

  if(wap_last_c === '/' || pc_last_c === '/'){
    res.send('链接格式不正确，请后退，删除 "/",再提交！')
  }else{

    wap_body = wap_body ? wap_body.replace(/images/g, wap_replace_path):'';
    pc_body = pc_body ? pc_body.replace(/images/g, pc_replace_path):'';
    pc_style = pc_style ? pc_style.replace(/images/g, pc_replace_path):'';




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



      store_id = req.body.store_id.trim();

      category_id = req.body.category_id.trim();

      subject_pc_id = req.body.subject_pc_id.trim();
      subject_wap_id = req.body.subject_wap_id.trim();



      good_id = req.body.good_id.trim();

      book_city = req.body.book_city;
      wap_init_h = req.body.wap_init_h;
      pc_init_h = req.body.pc_init_h;

      wap_img_path = req.files.wap_upload.path;
      wap_new_path = path.join(__dirname,'/upload/wap/wap.jpg')

      pc_img_path = req.files.pc_upload.path;
      pc_new_path = path.join(__dirname,'/upload/pc/pc.jpg')



      async function wapCutting(){
        if(wap_img_path.indexOf('.') > 0){
          console.log("进入wap切板");
          await readSaveFile(wap_img_path,wap_new_path);
          let size = await sizeImg("./upload/wap/wap.jpg");

          wap_img_h = size.height;
          wap_img_w = size.width;

          wap_nums = Math.floor(wap_img_h/wap_init_h);

          wap_last_h = wap_img_h - wap_init_h * wap_nums;
          wap_last_rem = wap_last_h/40;

          wap_insert_imgs = '';

          for( let i = 0; i < wap_nums + 1; i ++){

            if(i < wap_nums){

              wap_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="">\n';
              await cropWriteImg("./upload/wap/wap.jpg",wap_img_w, wap_init_h, 0, i * wap_init_h,"./upload/wap/images/bg_" + i +".jpg");

            }else {

              if(wap_last_h !== 0){
                  wap_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="" style="height:' + wap_last_rem + 'rem">\n';
                  await cropWriteImg("./upload/wap/wap.jpg",wap_img_w, wap_last_h, 0, i * wap_init_h,"./upload/wap/images/bg_" + i +".jpg");
              }
              wap_style = ` *{ margin:0; padding:0}
                            img{ display:block; border:0;}
                            .w1024{ width:16rem; margin:0 auto; }
                            .w1024 img{width:16rem; height:${wap_init_h/40}rem}`;

              wap_body = `<div class="w1024">
                            <a href="https://${book_city}.jiehun.com.cn/mobi/demand/?cate_id=${category_id}&position_name=zt_wap_${subject_wap_id}&store_id=${store_id}&product_id=${good_id}&tpl_id=1">
                               ${wap_insert_imgs}
                            </a>            
                            <div style="width:16rem;height:2rem;margin:0 auto;color:white;font-size: 0.6rem;text-align: center;line-height: 2rem;background:#606370;">注：此活动与苹果公司无关</div>
                            </div>
                            <script>hapj(function(H){H.get('bootstrap').initAppointHbh()})</script>`


            }

          }
        }


        if(pc_img_path.indexOf('.') > 0){
          console.log("进入pc切板");

          await readSaveFile(pc_img_path,pc_new_path);
          let size = await sizeImg("./upload/pc/pc.jpg");

          pc_img_h = size.height;
          pc_img_w = size.width;

          pc_nums = Math.floor(pc_img_h/pc_init_h);
          pc_last_h = pc_img_h - pc_init_h * pc_nums;


          console.log(pc_last_h);



          pc_insert_imgs='';

          if(pc_img_w !== 1920){

            let add_side = (1920 - pc_img_w) / 2;

            await addImg(add_side, pc_img_h, "./upload/pc/bgbg_side.jpg");
            await appendImg("./upload/pc/bgbg_side.jpg","./upload/pc/pc.jpg", "./upload/pc/bgbg_side.jpg","./upload/pc/pc.jpg" ,true);
            await cropWriteImg("./upload/pc/pc.jpg",360, pc_img_h, 0, 0,"./upload/pc/bgbg_01.jpg");
            await cropWriteImg("./upload/pc/pc.jpg",360, pc_img_h, 1560, 0,"./upload/pc/bgbg_03.jpg");
            await addImg(1200, pc_img_h, "./upload/pc/bgbg_02.jpg");
            await appendImg("./upload/pc/bgbg_01.jpg","./upload/pc/bgbg_02.jpg", "./upload/pc/bgbg_03.jpg","./upload/pc/images/bgbg.jpg" ,true);

          }else{

            await cropWriteImg("./upload/pc/pc.jpg",360, pc_img_h, 0, 0,"./upload/pc/bgbg_01.jpg");
            await cropWriteImg("./upload/pc/pc.jpg",360, pc_img_h, 1560, 0,"./upload/pc/bgbg_03.jpg");
            await addImg(1200, pc_img_h, "./upload/pc/bgbg_02.jpg");
            await appendImg("./upload/pc/bgbg_01.jpg","./upload/pc/bgbg_02.jpg", "./upload/pc/bgbg_03.jpg","./upload/pc/images/bgbg.jpg" ,true);

          }

          for( let i = 0; i < pc_nums + 1; i ++){


            if(i < pc_nums){

              pc_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="">\n';
              await cropWriteImg("./upload/pc/pc.jpg",1220, pc_init_h, 350, i * pc_init_h,"./upload/pc/images/bg_" + i +".jpg");
            }else{

              if(pc_last_h !== 0){
                pc_insert_imgs += '<img src="images/bg_'+ i +'.jpg" alt="">\n';
                await cropWriteImg("./upload/pc/pc.jpg",1220, pc_last_h, 350, i * pc_init_h,"./upload/pc/images/bg_" + i +".jpg");
              }


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

              pc_body =  `  <div class="big">
                            <div class="w1024">
                              <a href="/mall/demand/?cate_id=${category_id}&position_name=zt_pc_${subject_pc_id}&store_id=${store_id}&product_id=${good_id}&tpl_id=1">
                              ${pc_insert_imgs}
                             </a>
                            </div>
                            </div>
                            <script>hapj(function(H){H.get('bootstrap').initAppointHbh()})</script>`
            }
          }

        }



        fs.exists(wap_new_path,function(exist){
          if(exist){
            fs.unlink(wap_new_path,function(err){
              if(err){console.log(err)}
            });
          }
        });

        
        fs.exists(pc_new_path,function(exist){
          if(exist){
            fs.unlink(pc_new_path,function(err){
              if(err){console.log(err)}
            })
          }
        });

        
        fs.exists('./upload/pc/bgbg_01.jpg',function(exist){
          if(exist){
            fs.unlink('./upload/pc/bgbg_01.jpg',function(err){
              if(err){console.log(err)}
            })
          }
        });

        
        fs.exists('./upload/pc/bgbg_02.jpg',function(exist){
          if(exist){
            fs.unlink('./upload/pc/bgbg_02.jpg',function(err){
              if(err){console.log(err)}
            })
          }
        });

        
        fs.exists('./upload/pc/bgbg_03.jpg',function(exist){
          if(exist){
            fs.unlink('./upload/pc/bgbg_03.jpg',function(err){
              if(err){console.log(err)}
            })
          }
        });
        fs.exists('./upload/pc/bgbg_side.jpg',function(exist){
          if(exist){
            fs.unlink('./upload/pc/bgbg_side.jpg',function(err){
              if(err){console.log(err)}
            })
          }
        });

        res.redirect('/changePath')



      }

      wapCutting();

	    
	});





  let server = app.listen(4000, function () {
      console.log("running localhost:4000...");
  })





function readSaveFile(oldPath,newPath){
  return new Promise(function(resolve,reject){
    fs.readFile(oldPath,function(err,data){
      if(err){console.log(err);}
      fs.writeFile(newPath,data,function(err){
        if(err){console.log(err);}
        resolve();
      })
    })
  })
};


function sizeImg(path){
  return new Promise(function(resolve,reject){
    gm(path).size(function (err, size) {
      if (err){console.log(err);}
      resolve(size);
    })
  })
}


function cropWriteImg(path,width,height,x,y,newPath){
  return new Promise(function(resolve,reject){

    gm(path).crop(width,height,x,y).write(newPath ,function(err){
      if(err){console.log(err);};
      resolve();
    })

  })
}

function addImg(width, height, newPath){
  return new Promise(function(resolve,reject){

    gm(width, height, "#fff").write(newPath, function (err) {
      if(err){console.log(err);};
      resolve();
    })

  })
}

function appendImg(path,path_01,path_02,newPath,dir){
  return new Promise(function(resolve,reject){

    gm(path).append(path_01, path_02, dir).write(newPath ,function(err){
      if(err){console.log(err);};
      resolve();
    })

  })
}








