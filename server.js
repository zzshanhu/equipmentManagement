var express = require('express');
var session = require('express-session');
//获得body-parser模块
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var UserDao = require('./dao/UserDao');
var userController = require('./controller/UserController');
var dao = new UserDao();
dao.init();
var app = express();
//配置session
app.use(session({
    secret: 'a secret',   // 可以随便写。 一个 String 类型的字符串，作为服务器端生成 session 的签名
    name:'session_id',//保存在本地cookie的一个名字 默认connect.sid  可以不设置
    resave: false,   //强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false
    saveUninitialized: true,   //强制将未初始化的 session 存储。 默认值是true  建议设置成true
    // cookie: {
    //     maxAge:50000 //过期时间
    //
    // },	//设置过期时间比如是30分钟，只要浏览页面，30分钟没有操作的话在过期
    rolling:true //在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认：false)
}));
var viewPath = __dirname+"/views/";
app.use(express.static('public'));

app.set('views engine','ejs');
app.set('views',__dirname + '/views');

app.get('/index',function (req,res) {
    if(req.session.username) {
        dao.query('board', function (err, data) {
            dao.queryByTerm(['stuID'], [req.session.username], 'suggest', function (err, suggest) {
                dao.query('rate', function (err, rates) {
                    dao.query('treaty', function (err, treaty) {
                        dao.query('equipmentall', function (err, equipsAll) {
                            dao.queryByTerm(['stuID'], [req.session.username], 'users', function (err, users) {
                                res.render('index', {
                                    datas: data,
                                    suggests: suggest,
                                    treatys: treaty,
                                    user: users,
                                    rates: rates,
                                    equipsAll: equipsAll
                                });
                                console.log(users)
                            })
                        })
                    })
                })
            })
        })
    }else {
        res.redirect('/');
    }
})
app.get('/equipmentInfo',userController.equipmentInfo);
app.get('/lazyLoad',function (req,res) {
    var lazyData=[];
    dao.query('equipmentall',function (err,data) {
        dao.query('equipmentone',function (err,result) {
                let nowObj={};
                let nowArr=[];
                 for(let i=0;i<data.length;i++){
                     nowArr=[];
                     nowObj={};
                     for(let j=0;j<result.length;j++){
                         if(data[i].equipAllNo==result[j].equipNo){
                             nowArr.push(result[j]);
                         }
                     }
                     nowObj={equipName:data[i].equipName,equipArr:nowArr,equipImage:data[i].equipImage};
                     lazyData.push(nowObj);
                 }
                console.log(data);
                return res.json({lazyData:lazyData});
        })
    })
})
app.get('/',userController.login);
app.post('/login',urlencodedParser,function (req,res) {
    var username= req.body.username;
    var passwd  = req.body.passwd;
    var remember = req.body.remember;
    console.log(req.body);
    req.session.username=username;
    req.session.passwd=passwd;
    dao.queryByTerm(['stuID'],[username],'users',function (err,data) {
        console.log(data[0].power);
        if(data.length!=0){
            if(data[0].stuPassWord!=passwd){
                return   res.end('3');//密码错误
            }
        }else{
            return  res.end('2');//账号错误
        }
        if(remember){
            res.cookie('username', req.session.username, { expires: new Date(Date.now() + 30*24*60*60*1000), httpOnly: false });
            res.cookie('password', req.session.passwd, { expires: new Date(Date.now() + 30*24*60*60*1000), httpOnly: false });
        }
        req.session.stuRealName=data[0].stuName;
        console.log(req.session);
        if(data[0].power=='1'){
            res.end('1');//权限为管理员
        }else if(data[0].power=='0') {
            res.end('0');//权限为普通用户
        }else{
            res.end('-1');//没有权限
        }
    });

});
//保存建议信息
app.post('/sendSuggestInfo',urlencodedParser,function (req,res) {
    //初始化数据查询对象
    var dao = new UserDao();
    //2，数据初始化，连接数据库
    dao.init();
    console.log("我是sendSuggestInfo");
    console.log(req.body);
    //1,从body里面获得提交的数据
    var  suggestInfo= req.body.suggestInfo;
    var  stuID= req.session.username;
    var  addMan= req.session.stuRealName;
    var  addDate= new Date().toLocaleDateString();
    //执行插入
    var cluarr=['stuID','stuName','content','addDate','readStatus'];
    var Paramsarr=[stuID,addMan,suggestInfo,addDate,'1'];
    dao.insert(cluarr,Paramsarr,'suggest',function () {
        dao.finish();
        return  res.end('1');
    }) ;
});

app.get('/manager',userController.manager);
app.get('/equipClass',userController.equipClass);
app.get('/equipClassInfo',userController.equipClassGetInfo);
app.get('/equipDetail',userController.equipDetail);
//动态路由
app.get('/getmsg/:id',userController.getmsg);

// app.post('/reserveBorrow',urlencodedParser,function (req,res) {
//     console.log(req.body);
// })
//保存借用信息
app.post('/reserveBorrow',urlencodedParser,function (req,res) {
    //初始化数据查询对象
    var dao = new UserDao();
    //2，数据初始化，连接数据库
    dao.init();
    console.log("我是reserveBorrow");
    console.log(req.body);
    //1,从body里面获得提交的数据
    var  equipName= req.body.nowEquipName;
    var  inputNum=req.body.inputNum;
    var  equipNo= req.body.selectNo;
    var  userTel= req.body.userTel;
    var  userID=req.session.username;
    var  userName= req.session.stuRealName;
    var  expectedReturnDate=req.body.inputDate;
    var  addDate= new Date().toLocaleDateString();
    //返回实验设备编码数组
    var returnArr=[];
    //在数据库查找剩余设备
    dao.queryByTerm(['canBorrow','equipName','equipNo'],['1',equipName,equipNo],'equipmentone',function (err,result) {
        for(var i=0;i<inputNum;i++){
            returnArr.push(result[i])
            if(i==inputNum-1){
                for(let j=0;j<returnArr.length;j++){
                    //执行插入
                    var cluarr=['userID','userName','userTel','equipID','equipName','expectedReturnDate','addDate','readSatus'];
                    var Paramsarr=[userID,userName,userTel,returnArr[j].equipID,equipName,expectedReturnDate,addDate,'1'];
                    dao.insert(cluarr,Paramsarr,'userdetails',function () {
                       console.log("添加一条记录")
                    }) ;
                    if(j==returnArr.length-1){
                        for(let k=0;k<returnArr.length;k++){
                            dao.updateRate(['canBorrow'],['0'],['equipID'],returnArr[k].equipID,'equipmentone',function () {
                                console.log("更改一次canborrow状态");
                            });
                            if(k==returnArr.length-1){
                                dao.finish();
                                return  res.end('1');
                            }
                        }
                    }
                }
            }
        }
    })
});
//保存从详情页提交的借用申请
app.post('/referBorrowMsg',urlencodedParser,function (req,res) {
    //初始化数据查询对象
    var dao = new UserDao();
    //2，数据初始化，连接数据库
    dao.init();
    console.log("我是reserveBorrow");
    console.log(req.body);
    //1,从body里面获得提交的数据
    var  equipName= req.body.equipName;
    var  equipNo= req.body.equipClass;
    var  equipID= req.body.equipID;
    var  userTel= req.body.userTel;
    var  expectedReturnDate=req.body.returnTime;
    var  userID=req.session.username;
    var  userName= req.session.stuRealName;
    var  addDate= new Date().toLocaleDateString();
    //执行插入
    var cluarr=['userID','userName','userTel','equipID','equipName','expectedReturnDate','addDate','readSatus'];
    var Paramsarr=[userID,userName,userTel,equipID,equipName,expectedReturnDate,addDate,'1'];
    dao.insert(cluarr,Paramsarr,'userdetails',function () {
        console.log("添加一条记录")
    }) ;
    dao.updateRate(['canBorrow'],['0'],['equipID'],equipID,'equipmentone',function () {
        console.log("更改一次canborrow状态");
    });
        dao.finish();
        return  res.end('1');
});
//保存归还信息
app.post('/reserveReturn',urlencodedParser,function (req,res) {
    //初始化数据查询对象
    var dao = new UserDao();
    //2，数据初始化，连接数据库
    dao.init();
    console.log("我是reserveReturn");
    console.log(req.body);
    //1,从body里面获得提交的数据
    var  returnStr=req.body.returnInfor;
    var  returnInfoArr=returnStr.split('&');
    var  returnEquipArr=[];
    var  returnApplyDate= decodeURI(returnInfoArr[returnInfoArr.length-1].split('=')[1]);
    console.log('returnApplyDate'+returnApplyDate);
    //返回实验设备编码数组
     var returnArr=[];
     for(let i=0;i<returnInfoArr.length-1;i++){
         returnEquipArr.push(returnInfoArr[i].split('=')[1]);
         if(i==returnInfoArr.length-2){
             for(let j=0;j<returnEquipArr.length;j++){
                 dao.updateRate(['returnExamineStatus','returnApplyDate'],['1',returnApplyDate],['uDid'],[returnEquipArr[j]],'userdetails',function (err, result) {
                     if(err){
                         dao.finish();
                         return  res.end('-1');
                     }
                     console.log('更改一条归还状态')
                 })
                 if(j==returnEquipArr.length-1){
                     dao.finish();
                     return  res.end('1');
                 }
             }
         }
     }

});
app.listen(8081);