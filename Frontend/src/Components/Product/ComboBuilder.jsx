import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCombo } from "../../action/comboAction";
import { getProduct } from "../../action/productAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './comboBuilder.css';

const ComboBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);

  const { products } = useSelector((state) => state.products);
  const { loading, success, error } = useSelector((state) => state.comboCreate);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Combo created successfully!");
      navigate("/combos");
    }
    if (error) toast.error(error);
  }, [success, error, navigate]);

  const toggleProduct = (productId) => {
    setSelected((prev) => {
      const exists = prev.find((item) => item.productId === productId);
      if (exists) {
        return prev.filter((item) => item.productId !== productId);
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, qty) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Number(qty) } : item
      )
    );
  };

  const submitHandler = () => {
  if (selected.length < 2) return toast.error("Select at least 2 products.");

  navigate("/checkout-combo", {
    state: { products: selected },
  });
};



  return (
    <div className="combo-container">
      <h2 className="combo-title">🧩 Build Your Own Combo</h2>

      <div className="combo-grid">
        {products &&
          products.map((product) => {
            const isSelected = selected.find((item) => item.productId === product._id);

            return (
              <div
                key={product._id}
                onClick={() => toggleProduct(product._id)}
                className={`combo-card ${isSelected ? "selected" : ""}`}
              >
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="product-image"
                />
                <div className="combo-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>

                  {isSelected && (
                    <div className="quantity-box">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={
                          selected.find((item) => item.productId === product._id)
                            ?.quantity || 1
                        }
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateQuantity(product._id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <div className="submit-section">
        <button
          onClick={submitHandler}
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Creating Combo..." : "Create Combo"}
        </button>
      </div>
    </div>
  );
};

export default ComboBuilder;
