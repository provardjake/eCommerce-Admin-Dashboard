import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res){
    const {method} = req;
    await mongooseConnect();
    if(method === "POST"){
        const {name, description, price} = req.body;
        const productDoc = await Product.create({
            name, description, price
        })
        res.json(productDoc);
    }
}