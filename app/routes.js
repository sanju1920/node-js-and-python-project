const { recomendation } = require('./../views/recomendation');

module.exports= function(app,passport){

    app.get('/', function(req, res) {
        var flag = req.session.flag;
        
        res.render('home.ejs',{flag:flag}); // load the Home Page
    });

    app.get('/login1', function(req, res) {
        res.render('login1.ejs'); // simple login
    });

    app.get('/logout', function(req, res) {
        var flag =null;
        req.session.destroy(function(err) {
            
            res.render('home.ejs',{flag:flag});
        
         })
    });
/////////////// search //////////////

app.post('/search',function(req,res){
            var dname = req.body.doctorname;
            var loc = req.body.location;
            var flag = req.session.flag;
    var sql ="";

  		  		if(dname!="" && loc !="" )
 			 			sql = "SELECT * FROM doctorlogin WHERE specification= '"+dname +"' && city= '"+loc+"'";
 		 		else if(dname!="")
 		 				sql = "SELECT * FROM doctorlogin WHERE specification= '"+dname +"'";
 			 	else if (loc!="")
 		 				sql ="SELECT * FROM doctorlogin WHERE city='"+loc+"'";
 		 		else
                          sql = "SELECT * FROM doctorlogin";
                          
               // console.log(sql);
 
 				con.query(sql, function (err, row,col)
 				 {
                    if (err) throw err;
                    
    				res.render('search.ejs',{row:row,flag:flag});
		 			

  				});
});

/////////////// User Login /////////////////

    app.get('/login', function(req, res) {
        res.render('login.ejs'); // load login user page
    });

    app.post('/login', function(req, res) {
        var email =req.body.email;
        var pass = req.body.password;
        var sql = "SELECT * FROM USERLOGIN WHERE email='"+email+"' && password = '"+pass+"'";
  			
  		con.query(sql,function (err, result) 
  		{
    		if(result.length){
                req.session.user = result[0];
                req.session.userID =result[0].email;
                req.session.flag="user";
                
                res.redirect('/userprofile');
            }
            else{
                res.render('home.ejs',{flag:null});
            }
 		 }); 
        
    });

 /////////////// Doctor Login //////////////


    app.get('/logind', function(req, res) {
        res.render('logind.ejs'); // load login doctor page
    });

    app.post('/logind', function(req, res) {
        var email =req.body.email;
        var pass = req.body.password;
        var sql = "SELECT * FROM DOCTORLOGIN WHERE email='"+email+"' && password = '"+pass+"'";
  		con.query(sql,function (err, result) 
  		{
    		if(result.length){
                req.session.user = result[0];
                req.session.userID = result[0].email;
            
                req.session.flag="doctor";
                res.redirect('/doctorprofile');
            }
            else{
                res.render('home.ejs',{flag:null});
            }
 		 }); 
        
    });
    //////////////////////   User Register    ///////////////////////

    app.get('/register', function(req, res) {
        res.render('register.ejs'); // 
    });

    app.post('/register', function(req, res) {
        var q = req.body;
        var sql = "INSERT INTO userlogin set ?";
  		
  		con.query(sql,q, function (err, result) 
  		{
    		if (err) res.render('register.ejs');
			else
				{    					
                    res.render('login.ejs');
    			}
 		 }); 
        
    });

///////////////////////////////// Doctor Register /////////

    app.get('/registerd', function(req, res) {
        res.render('registerd.ejs'); // 
    });

    app.post('/registerd', function(req, res) {
        var q = req.body;
        var sql = "INSERT INTO doctorlogin set ?";

  		con.query(sql,q, function (err, result) 
  		{
    		if (err) res.render('registerd.ejs');
			else
				{    					
                    res.render('logind.ejs');
    			}
 		 }); 
        
    });
/////////////////////////////////////////////
    app.get('/userprofile',function(req,res,next){

            var user =req.session.user;
            var userID =req.session.userID;
            var flag =req.session.flag;
    
            if(userID == null || flag=="doctor"){
                res.redirect('/');
                return;
            }
         py    = spawn('python', ['recommendation.py']),
            data = userID,
            dataString = '';
            
        
        py.stdout.on('data', function(data){
            
          dataString += data.toString();
        });
        py.stdout.on('end', async function(){
           // console.log(dataString);
            
            
          //  var val =dataString.split(" ");
           var recom = await recomendation(dataString);
            
           setTimeout(()=>{
          //  console.log(recom);
            
        },1000);
         /*   
            for(var i =0 ;i<val.length-1;i++)
            {
                var sql1 = "SELECT * FROM DOCTORLOGIN WHERE EMAIL='"+val[i]+"'";
               con.query(sql1,function(err,r,col){
             if(err) throw err;
               
                recom[i]=r[0];
               // console.log(recom[i]);
                 
               });

                
             }
             */
           var sql= "SELECT re.comment,ur.name from review as re inner join doctorlogin as ur on re.doctorid=ur.email where re.userid='"+userID+"'";
           con.query(sql,function(err,row,col){
              if(err) throw err;
              var sql2 = "SELECT name FROM userlogin WHERE EMAIL='"+userID+"'";
               con.query(sql2,function(err,rr,col){
            if(err) throw err;
               
            res.render('userprofile.ejs',{row:row,rr:rr,recom:recom}); 
                 
               });
             
          });


          });
        
          py.stdin.write(JSON.stringify(data));
         py.stdin.end();
            
           
         
    });

    app.get('/doctorprofile',function(req,res,next){

        var user =req.session.user;
        var userID =req.session.userID;
        var flag = req.session.flag;
        
        if(userID == null || flag =="user"){
            res.redirect('/');
            return;
        }
        var sql = "SELECT * FROM DOCTORLOGIN WHERE EMAIL ='"+userID+"'";
        var sql1= "SELECT re.comment,ur.name,AVG(re.rating) as rate,AVG(f1) as f1,AVG(f2) as f2,AVG(f3) as f3,AVG(f4) as f4,count(comment) as reviewno from review as re inner join userlogin as ur on re.userid=ur.email where re.doctorid='"+userID+"'";
     // console.log(sql1);
        con.query(sql,function(err,row,col){
            if(err) throw  err;
            con.query(sql1,function(err,r,col){
                if(err) throw  err;
             //   console.log(r);
                res.render('doctorprofile.ejs',{row:row,r:r});
            });
           
        });
    
});

app.get('/profiled',function(req,res,next){

    var user =req.session.user;
    var userID =req.session.userID;
    var flag = req.session.flag;
    
    if(userID == null || flag =="user"){
        res.redirect('/');
        return;
    }
    var sql = "SELECT * FROM DOCTORLOGIN WHERE EMAIL ='"+userID+"'";
        
        con.query(sql,function(err,row,col){
            if(err) throw  err;
            
            res.render('profiled.ejs',{row:row});
        });

});

app.post('/profiled',function(req,res,next){

    var user =req.session.user;
    var userID =req.session.userID;
    var flag = req.session.flag;
  //  console.log(userID);
  //  console.log(flag);
 //   console.log("ok");
    if(userID == null || flag =="user"){
        res.redirect('/');
        return;
    }
        /////// edit data //////////
        var q = req.body;
        var mod = "UPDATE doctorlogin SET ? where email = '"+userID+"'";
      //  console.log(mod);
    
        con.query(mod,q, function (err, result) 
  		{
            if (err)  throw err;
        //    console.log("successful");
			
 		 }); 

    ////////////////////


    var sql = "SELECT * FROM DOCTORLOGIN WHERE EMAIL ='"+userID+"'";
        
        con.query(sql,function(err,row,col){
            if(err) throw  err;
        //    console.log(row);
        
            res.render('profiled.ejs',{row:row});
        });

});


app.post('/userpref', function(req, res) {
    
    var user =req.session.user;
    var userID =req.session.userID;
    var flag = req.session.flag;
    var t=userID;
    var viewid = req.body.view;
    if(t==null)
    {
        t="Anonymous";
    }
    if(flag=="doctor")
    {
        res.redirect('/');
        return;
    }
  
 

    var sql = "SELECT * FROM DOCTORLOGIN WHERE EMAIL ='"+viewid+"'";
    var sql1 ="select count(comment) as reviewno ,AVG(rating) as rate , AVG(f1) as f1, AVG(f2) as f2 ,AVG(f3) as f3, AVG(f4)as f4   from review where doctorid ='"+viewid+"'";
    con.query(sql,function(err,row,col){
        if(err) throw  err;
        con.query(sql1,function(err,r,col){
            if(err) throw  err;

         //   console.log(r);
            res.render('userpref.ejs',{t:t,row:row,flag:flag,r:r});
        });

       
    }); 
});


app.post('/data', function(req, res) {
    
    var user =req.session.user;
    var userID =req.session.userID;
    var flag = req.session.flag;
    var t=userID;
    if(t==null)
    {
        t="Anonymous";
    }
     /////----------------- Run python shell   --------------------/////////////////////////
     
     py    = spawn('python', ['idoctor.py']),
     data = req.body.message,
     dataString = '';
     
 
 py.stdout.on('data', function(data){
     
   dataString += data.toString();
 });
 py.stdout.on('end', function(){
  // console.log(dataString);
  var val =dataString.split(" ")
  var rt =0.7*req.body.Star +0.3*val[0];
   // console.log(rt);
    var sql = "INSERT INTO review (userid,doctorid,rating,comment,f1,f2,f3,f4,payment,trust,visit,behaviour,own_rating) values('"+req.body.username+"','"+req.body.doctorname+"','"+req.body.Star+"','"+req.body.message+"','"+req.body.Star1+"','"+req.body.Star2
    +"','"+req.body.Star3+"','"+req.body.Star4+"','"+val[1]+"','"+val[2]+"','"+val[3]+"','"+val[4]+"','"+rt+"')";
    //console.log(sql);
   
    con.query(sql, function (err, result) 
    {
      if (err) throw err; 
      
    });
    var q = "SELECT * FROM DOCTORLOGIN WHERE EMAIL ='"+req.body.doctorname+"'";
    
    var sql1 ="select count(comment) as reviewno ,AVG(rating) as rate , AVG(f1) as f1, AVG(f2) as f2 ,AVG(f3) as f3, AVG(f4)as f4   from review where doctorid ='"+req.body.doctorname+"'";
    con.query(q,function(err,row,col){
        if(err) throw  err;
        con.query(sql1,function(err,r,col){
            if(err) throw  err;

            
            res.render('userpref.ejs',{t:t,row:row,flag:flag,r:r});
        });

       
    }); 
    
   
 });
 py.stdin.write(JSON.stringify(data));
 py.stdin.end();
 
 
     /////////////////////// end -------------------------------------//////////
 

});

};