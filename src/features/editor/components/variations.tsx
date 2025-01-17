import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  variations: {
    buttonSize: string[];
    buttonBackgroundType: string[];
  };
}

const ProductVariations = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/products/all`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setProduct(data[0]); // Assuming the first product is what we need
        } else {
          setError('No products found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product data available</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <h2>Button Sizes</h2>
      <ul>
        {product.variations.buttonSize.map(size => (
          <li key={size}>{size}</li>
        ))}
      </ul>
      <h2>Button Background Types</h2>
      <ul>
        {product.variations.buttonBackgroundType.map(type => (
          <li key={type}>{type}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductVariations;