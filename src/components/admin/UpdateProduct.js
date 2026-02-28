import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productAction";
import { clearError, clearProductUpdated } from "../../slices/productSlice";
import { toast } from "react-toastify";

export default function UpdateProduct() {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.product,
  );

  const state = useSelector(state => state);
console.log("FULL REDUX STATE:", state);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);

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

  // 🔹 Fetch product when component loads
  useEffect(() => {
  console.log("Fetching product with ID:", productId);
  dispatch(getProduct(productId));
}, [dispatch, productId]);

  useEffect(() => {
    console.log("========== UPDATE PRODUCT DEBUG ==========");

    if (!product) {
      console.log("Product is NULL or UNDEFINED");
      return;
    }

    console.log("Full Product Object:", product);
    console.log("Product ID:", product._id);
    console.log("Name:", product.name);
    console.log("Price:", product.price);
    console.log("Stock:", product.stock);
    console.log("Description:", product.description);
    console.log("Seller:", product.seller);
    console.log("Category:", product.category);
    console.log("Images Array:", product.images);

    setName(product.name || "");
    setPrice(product.price || "");
    setStock(product.stock || 0);
    setDescription(product.description || "");
    setSeller(product.seller || "");
    setCategory(product.category || "");

    if (product.images && product.images.length > 0) {
      const imageList = product.images.map((img, index) => {
        console.log(`Image ${index + 1}:`, img);
        return img.image;
      });

      setImagesPreview(imageList);
    } else {
      console.log("No images found in product");
      setImagesPreview([]);
    }

    console.log("==========================================");
  }, [product]);

  // 🔹 Handle success & error
  useEffect(() => {
    if (isProductUpdated) {
      toast("Product Updated Successfully!", {
        type: "success",
        position: "bottom-center",
      });

      dispatch(clearProductUpdated());
      navigate("/admin/products");
    }

    if (error) {
      toast(error, {
        type: "error",
        position: "bottom-center",
      });
      dispatch(clearError());
    }
  }, [isProductUpdated, error, dispatch, navigate]);

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setImagesCleared(true);
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
    formData.append("imagesCleared", imagesCleared);

    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(updateProduct(productId, formData));
  };

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
              className="shadow-lg p-4"
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
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Seller</label>
                <input
                  type="text"
                  className="form-control"
                  value={seller}
                  onChange={(e) => setSeller(e.target.value)}
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
                    style={{ cursor: "pointer" }}
                    className="ml-2"
                  >
                    🗑 Clear
                  </span>
                )}

                <div className="mt-2">
                  {imagesPreview.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Preview"
                      width="55"
                      height="52"
                      className="mr-2 mt-2"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block py-2"
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
