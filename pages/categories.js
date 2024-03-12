import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [properties, setProperties] = useState([]);

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

    function deleteCategory(category){
        swal.fire({
            title: 'Are you Sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, Delete!",
            confirmButtonColor: "#d55",
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category;
                await axios.delete(`/api/categories?_id=${_id}`);
                fetchCategories();
            }
        });
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:"", values: ""}];
        });
    }

    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
          });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
          const properties = [...prev];
          properties[index].values = newValues;
          return properties;
        });
      }

      function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
      }

    return(
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit Category ${editedCategory.name}` : "New Category"}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                    type="text" 
                    placeholder="Category Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}/>
                    <select 
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}>
                        <option value="0">No Parent Category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id} key={category._id}>{category.name}</option>
                            )
                        )}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button onClick= {addProperty}
                            type="button"
                            className="btn-default text-sm mb-2">
                            Add New Property
                    </button>
                    {properties.length > 0 && properties.map((property, index) =>(
                        <div key={property.value} className="flex gap-1 mb-2">
                            <input type="text" 
                                    value={property.name} 
                                    onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}
                                    className="mb-0"
                                    placeholder="Property Name (example: Color)"/>
                            <input type="text" 
                                    value={property.values} 
                                    onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                                    className="mb-0"
                                    placeholder="Values, comma separated"/>
                            <button 
                            type="button"
                            onClick={() => removeProperty(index)}
                            className="btn-default">
                            Remove</button>
                        </div>
                    ))}
                </div>

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
                                    <button className="btn-primary" onClick={() => deleteCategory(category)}>Delete</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({swal}, ref) =>(
    <Categories swal={swal}/>
))