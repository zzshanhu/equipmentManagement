function UserDao() {
    var connection;
    this.init=function () {
        var mysql  = require('mysql');
        connection = mysql.createConnection({
            host     : 'localhost',       //主机 ip
            user     : 'root',            //MySQL认证用户名
            password : 'root',                //MySQL认证用户密码
            port: '3306',                 //端口号
            database:'equip',      //数据库里面的数据
            charset:'UTF8_GENERAL_CI'
        });
        //3,连接
        connection.connect();
    };
//在表中查询所有数据
    this.query=function (user,call) {
        var  userGetSql = 'SELECT * FROM '+user;
        connection.query(userGetSql,function (err, result) {
            if(!err){
                call(err,result);
            }else{
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
    };
    /*通过条件获得用户*/
    this.queryByTerm=function (termArr,termValueArr,users,call) {
        var sql = "select * from "+users+" where ";
        for(let i=0;i<termArr.length;i++){
            if(i==termArr.length-1){
                if(isNaN(termValueArr[i])){
                    sql+=termArr[i]+" = '"+termValueArr[i]+"'";
                }else {
                    sql+=termArr[i]+" = "+termValueArr[i];
                }
            }else{
                if(isNaN(termValueArr[i])){
                    sql+=termArr[i]+" = '"+termValueArr[i]+"' AND ";
                }else{
                    sql+=termArr[i]+" = "+termValueArr[i]+" AND ";
                }
            }
        }
        console.log(sql);
        connection.query(sql,function (err, result) {
            if(!err){
                // connection.end();
                call(err,result);
            }else{
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
        });
        //5,连接结束
        // connection.end();
    };
//插入操作
    this.insert= function (cluarr,Paramsarr,users,call) {
        var  userAddSql = 'INSERT INTO '+users+'(';
        //3,编写sql语句
        for(let i=0;i<cluarr.length;i++){
            if(i==cluarr.length-1){
                userAddSql +=cluarr[i]+') VALUES(';
                for(let j=0;j<Paramsarr.length;j++){
                    if(j==Paramsarr.length-1){
                        userAddSql +='?)';
                    }else{
                        userAddSql +='?,';
                    }
                }
            }else {
                userAddSql +=cluarr[i]+',';
            }
        }
        console.log(userAddSql);
        connection.query(userAddSql,Paramsarr,function (err, result) {
            if(!err){
                console.log(result);
                call();
            }else{
                console.log(err);
            }
        });
    };
    //更新操作
    //UPDATE websites SET name = ?,url = ? WHERE Id = ?
    this.updateRate= function (cluarr,Paramsarr,whereArr,flag,users,call) {
        var  userAddSql = 'UPDATE '+users+' SET ';
        console.log("cluarr的"+cluarr.length)
        console.log("Paramsarr的"+Paramsarr.length);
        console.log("whereArr的"+whereArr.length);
        console.log("flag的"+flag);
        //3,编写sql语句
        for(let i=0;i<cluarr.length;i++){
            if(i==cluarr.length-1){
                userAddSql +=cluarr[i]+"= ? WHERE ";
                for(let j=0;j<whereArr.length;j++){
                    userAddSql +=whereArr[j]+"= '"+flag+"'";
                }
            }else{
                userAddSql +=cluarr[i]+"= ?,";
            }
        }
        console.log(userAddSql);
        connection.query(userAddSql,Paramsarr,function (err, result) {
            if(!err){
                console.log(result);
                call(err, result);
            }else{
                console.log(err);
            }
        });
    };
    this.finish=function () {
        //5,连接结束
        connection.end();
    };
}
module.exports = UserDao;