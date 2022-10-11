import { useContext } from "react";
import ProductCard from "../../component/product-card/product-card.component";
import { ProductsContext } from "../../contexts/products.context";

import "./shop.styles.scss";
const Shop = () => {
  const { products } = useContext(ProductsContext);
  return (
    <div className="products-container">
      {products.map((product) => {
        return (
          <div key={product.id}>
            <ProductCard product={product} />;
          </div>
        );
      })}
    </div>
  );
};

export default Shop;
