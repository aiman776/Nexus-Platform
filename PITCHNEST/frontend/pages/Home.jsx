import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:7000/api/products");

        // backend se jo aaye wahi set hoga
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
 
      {/* Hero Section 1 */}
      <div className="hero-section">
        <div className="overlay">
          <h1 className="hero-title">
            Smart Shopping, Better Choices
          </h1>

          <p className="hero-subtitle">
            Discover quality products at the best prices.
            <br />
            Browse, add to cart, and place your order easily with our
            simple and secure shopping experience.
          </p>

          <div className="hero-buttons">
            <Link to="/contact" className="btn btn-green">
              Contact For More Detail 
            </Link>

            <Link to="/cart" className="btn btn-dark">
              View Cart
            </Link>
          </div>
        </div>
      </div>

  

   
    </>
  );
};
