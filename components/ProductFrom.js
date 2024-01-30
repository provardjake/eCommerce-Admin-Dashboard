import { data } from "autoprefixer";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm(
    {
        _id,
        name:existingName, 
        description:existingDescription, 
        price:existingPrice
    }) {
    const [name, setName] = useState(existingName || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(e){
        e.preventDefault();
        const data = {name, description, price};
        if(_id){
            await axios.put("/api/products", {...data, _id});

        }
        else{
            await axios.post("/api/products", data);
        }
        setGoToProducts(true);
    }
    if(goToProducts === true){
        router.push("/products");
    }
    return(
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input 
                type="text" 
                placeholder="Product Name" 
                value={name} 
                onChange={e => setName(e.target.value)}/>
            <label>Description</label>
            <textarea 
                placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <label>Price (in USD)</label>
            <input 
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}/>
            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}