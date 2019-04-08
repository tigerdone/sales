module.exports = {
    checkLogin: function checkLogin(req,res,next) {
        if (!req.session.user){
            // req.flash('error','未登录');
            // return res.sendStatus(404);
            return res.send({isLogined:false});
        }
        else{
            console.log("not instert")
        }
        next();
    },
    checkNotLogin: function checkLogin(req,res,next) {
        if (req.session.user){
            // req.flash('error','已登录');
            // return res.redirect('back');
            return res.send({isLogined:true});
        }
        next();
    },
};