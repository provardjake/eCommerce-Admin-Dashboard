import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories(){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");

    useEffect(() =>{
       fetchCategories();
    }, []);

    function fetchCategories(){
        axios.get("api/categories").then(result =>{
            setCategories(result.data);
        })
    }

    async function saveCategory(e){
        e.preventDefault();
        const data = {name, parentCategory};

        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put("/api/categories", data);
            setEditedCategory(null);
        }
        else{
            await axios.post("/api/categories", data);
        }

        setName('');
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    return(
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit Category ${editedCategory.name}` : "New Category"}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                className="mb-0" 
                type="text" 
                placeholder="Category Name" 
                value={name} 
                onChange={e => setName(e.target.value)}/>
                <select 
                    className="mb-0" 
                    value={parentCategory}
                    onChange={e => setParentCategory(e.target.value)}>
                    <option value="0">No Parent Category</option>
                    {categories.length > 0 && categories.map(category => (
                           <option value={category._id} key={category._id}>{category.name}</option>
                        )
                    )}
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button className="btn-primary mr-1" onClick={() => editCategory(category)}>Edit</button>
                                    <button className="btn-primary">Delete</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </Layout>
    )
}