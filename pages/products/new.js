import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function NewProduct(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    async function createProduct(e){
        e.preventDefault();
        const data = {name, description, price};
        await axios.post("/api/products", data);
    }

    return(
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
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
        </Layout>
    )
}