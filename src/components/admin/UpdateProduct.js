import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productAction";
import { clearError, clearProductUpdated } from "../../slices/productSlice";
import { toast } from "react-toastify";

export default function UpdateProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesCleared, setImagesCleared] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { id: productId } = useParams();

    const { loading, isProductUpdated, error, product } =
        useSelector((state) => state.products);

    const categories = [
        "Electronics",
        "Mobile Phones",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [...oldArray, reader.result]);
                    setImages((oldArray) => [...oldArray, file]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("description", description);
        formData.append("seller", seller);
        formData.append("category", category);

        images.forEach((image) => {
            formData.append("images", image);
        });

        formData.append("imagesCleared", imagesCleared);

        dispatch(updateProduct(productId, formData));
    };

    const clearImagesHandler = () => {
        setImages([]);
        setImagesPreview([]);
        setImagesCleared(true);
    };

    // ✅ Handle success & error + fetch product safely
    useEffect(() => {
        if (isProductUpdated) {
            toast("Product Updated Successfully!", {
                type: "success",
                position: "bottom-center",
            });

            dispatch(clearProductUpdated());
            navigate("/admin/products");
            return;
        }

        if (error) {
            toast(error, {
                position: "bottom-center",
                type: "error",
            });
            dispatch(clearError());
            return;
        }

        if (!product || product._id !== productId) {
            dispatch(getProduct(productId));
        }
    }, [dispatch, isProductUpdated, error, productId, product, navigate]);

    // ✅ Safely set product data
    useEffect(() => {
        if (product && product._id === productId) {
            setName(product.name || "");
            setPrice(product.price || "");
            setStock(product.stock || 0);
            setDescription(product.description || "");
            setSeller(product.seller || "");
            setCategory(product.category || "");

            if (product.images && product.images.length > 0) {
                const imgs = product.images.map((img) => img.image);
                setImagesPreview(imgs);
            }
        }
    }, [product, productId]);

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>

            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form
                            onSubmit={submitHandler}
                            className="shadow-lg"
                            encType="multipart/form-data"
                        >
                            <h1 className="mb-4">Update Product</h1>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    rows="6"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="form-control"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stock}
                                    onChange={(e) =>
                                        setStock(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Seller</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={seller}
                                    onChange={(e) =>
                                        setSeller(e.target.value)
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Images</label>

                                <input
                                    type="file"
                                    className="form-control"
                                    multiple
                                    onChange={onImagesChange}
                                />

                                {imagesPreview.length > 0 && (
                                    <span
                                        onClick={clearImagesHandler}
                                        style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        🗑 Clear
                                    </span>
                                )}

                                <div>
                                    {imagesPreview.map((image) => (
                                        <img
                                            key={image}
                                            src={image}
                                            alt="Preview"
                                            width="55"
                                            height="52"
                                            className="mt-3 mr-2"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-block py-3"
                            >
                                UPDATE
                            </button>
                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}