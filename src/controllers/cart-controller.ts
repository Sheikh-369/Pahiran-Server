import { Request, Response } from "express"
import Cart from "../database/models/cart-model"
import Product from "../database/models/product-model"


interface AuthUser extends Request{
    user?:{
        id:string
    }
}
//user id for temporary testing  || "10ffae5c-776b-4809-b9ca-357f7ee91d9c"//only for testing
const addToCart=async(req:AuthUser,res:Response)=>{
    const userId=req.user?.id
    const{productId,quantity}=req.body

    if(!productId || !quantity){
        res.status(400).json({
            message:"Please provide product id and quantity."
        })
        return
    }

    const itemAlreadyExist=await Cart.findOne({
        where:{
            userId,productId
        }
    })

    if(itemAlreadyExist){
        itemAlreadyExist.quantity+=quantity
        await itemAlreadyExist.save()
    }else{
        await Cart.create({
        userId,
        productId,
        quantity})
    }
    res.status(200).json({
        message:"Item added to cart successfully."
    })
}

const showCartItems=async(req:AuthUser,res:Response)=>{
    const userId=req.user?.id

    const cartItems=await Cart.findAll({
        where:{
            userId
        },
        include: {
            model: Product,
            attributes: ["productName", "productPrice", "productDescription", "productImage"]
        }

    })

    if(cartItems.length===0){
        res.status(200).json({
            message:"No items in your cart.",
            data:[]
        })
    }else{
        res.status(200).json({
            message:"Cart items fetched successfully.",
            data:cartItems
        })
    }
}

const deleteCartItem = async (req: AuthUser, res: Response) => {
    const userId = req.user?.id
    const cartItemId = req.params.cartItemId;

    const cartItem = await Cart.findOne({
        where: { id: cartItemId, userId },
    });

    if (!cartItem) {
        return res.status(400).json({ message: "Cart item not found." });
    }

    await Cart.destroy({ where: { id: cartItemId, userId } });
    res.status(200).json({ message: "Item deleted successfully." });
};

const updateCartItemQuantity = async (req: AuthUser, res: Response) => {
    const userId = req.user?.id
    const cartItemId = req.params.cartItemId
    const { quantity } = req.body;

    if (quantity === undefined) {
        return res.status(400).json({
            message: "Please provide quantity"
        });
    }

    const cartItem = await Cart.findOne({
        where: {
            userId,
            id:cartItemId
        }
    });

    if (!cartItem) {
        return res.status(404).json({
            message: "The item does not exist."
        });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({
        message: "Cart updated!!"
    });
};

export{addToCart,showCartItems,deleteCartItem,updateCartItemQuantity}