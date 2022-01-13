const Course = require('../models/Course');
const User = require('../models/User');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const CartController= {
    index: async (req,res)=>{
       try {
           if (req.user){
               const user= await User.findOne({_id:req.user}).populate('cart');                           
               res.render('cart',{user});
           }
           else { 
                const user={};               
                let cart=req.cookies.cart;
                let courses=[];
                if (cart){
                    cart=JSON.parse(cart);
                    for (let index=0;index<cart.length;index++)
                        courses.push(await Course.findOne({_id : cart[index]}));
                }
                user.cart=courses;
                res.render('cart',{user});                
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
            if (req.user){             
                await User.updateOne(
                    {_id : req.user},
                    {$pull : {cart:{$in:[courseId]}}}
                  );                 
                return res.redirect('back')
            }
            else {
                res.redirect('back');
            }
            
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
                res.redirect('back');
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