const Course = require('../models/Course');
const User = require('../models/User');

const CartController= {
    index: async (req,res)=>{
       try {
           if (req.user){
               const user= await User.findOne({_id:req.user}).populate('cart');                           
               res.render('cart',{user});
           }
           else {
               
           }
        } catch (err) {           
            return res.render('error', {
                err,
                message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
            });           
       }
    },
    delete: async (req,res)=>{
        try {
            const courseId=req.params.id;
            console.log(courseId);
            if (req.user){             
                await User.updateOne(
                    {_id : req.user},
                    {$pull : {cart:{$in:[courseId]}}}
                  );                 
                return res.redirect('back')
            }
            else {}
            
        } catch (err) {
            return res.render('error', {
                err,
                message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
            });
        }
    },
    addCourse:async (req,res)=>{
        try {
            const courseId=req.params.id;
            if (req.user){
                await User.updateOne(
                    {_id : req.user},
                    {$addToSet : {cart:[courseId]} }
                    );
                res.redirect('back');
            } else {

            }
            
        } catch (err) {
            return res.render('error', {
                err,
                message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
            });
            
        }
    }
}

module.exports=CartController