module.exports.recomendation = async (dataString)=>{

    var val =dataString.split(" ");
    // console.log(val)
    var recom=new Array();

    for(let i=0 ;i<val.length-1;i++)
    {
        var sql1 = "SELECT * FROM DOCTORLOGIN WHERE EMAIL='"+val[i]+"'";
         con.query(sql1,function(err,r,col){
             if(err) throw err;
             recom.push(r[0]);
            });
     }
   return recom;  
   
 }  
