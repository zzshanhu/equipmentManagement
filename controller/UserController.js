var UserDao = require('../dao/UserDao');
exports.login = function (req,res) {
        res.render('login', {})
}
exports.equipmentInfo = function (req,res) {
    if(req.session.username) {
        res.render('equipmentInfo',{});
    }else{
        res.redirect('/');
    }
}
exports.manager = function (req,res) {
    if(req.session.username){
        res.render('manager',{});
    }else {
        res.redirect('/');
    }
}
exports.equipClass = function (req,res) {
    if(req.session.username){
        res.render('equipClass',{})
    }else {
        res.redirect('/');
    }
}
exports.index = function (req,res) {
    if(req.session.username){
        res.render('index',{})
    }else {
        res.redirect('/');
    }
}
exports.getmsg = function (req,res) {
    var dao = new UserDao();
    dao.init();
    var returnObj = null;
    var router = req.params.id;
    switch (router){
        case 'getBorrowInfo': dao.queryByTerm(['userID'],[req.session.username],'userdetails',function (err,userdetails) {
            returnObj = userdetails;
            dao.finish();
            return res.json({returnObj:returnObj});
        });
            break;
        case 'getEqupmentall':dao.query('equipmentall',function (err,userdetails) {
            returnObj = userdetails;
            dao.finish();
            return res.json({returnObj:returnObj});
        });
            break;
        case 'getEqupmentone':dao.queryByTerm(['equipNo','canborrow'],[req.query.equipNo,1],'equipmentone',function (err,equipmentone) {
            returnObj = equipmentone;
            dao.finish();
            return res.json({returnObj:returnObj});
        });
            break;
        default: console.log('fail');
            break;
    }
}
exports.equipClassGetInfo = function (req,res) {
    var dao = new UserDao();
    dao.init();
    var returnObj = null;
    var router = req.query.id;
    //termArr,termValueArr,users,call
    dao.queryByTerm(['equipAllNo'],[router],'equipmentAll',function (err,data) {
        dao.queryByTerm(['equipNo'],[router],'equipmentone',function (err,result) {
            returnObj={equipClassName:data,equipInfoArr:result};
            dao.finish();
            console.log(returnObj)
            return res.render('equipClass',{equipClassInfo:returnObj});
        })
    })

}
exports.equipDetail = function (req,res) {
    var dao = new UserDao();
    dao.init();
    var returnObj = null;
    var router = req.query.id;
    var router1=router.replace(/[^a-z]/ig,"");
    console.log(router);
    console.log(req.url);
    //termArr,termValueArr,users,call
    dao.queryByTerm(['equipAllNo'],[router1],'equipmentAll',function (err,data) {
        dao.queryByTerm(['equipID'],[router],'equipmentone',function (err,result) {
            returnObj={equipClassName:data,equipInfoArr:result};
            dao.finish();
            console.log(returnObj)
            return res.render('equipmentInfo',{equipClassInfo:returnObj});
        })
    })

}
