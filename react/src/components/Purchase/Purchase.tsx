import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProduct } from '../../services/product/productService';
import { useAlert } from '../../services/alert/alertService';
import { Product } from '../Product/Product';
import { NoData } from '../common/NoData/NoData';
// import { ProductHelper } from '../../helpers/product/productHelper';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryChips = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CategoryChip = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#1976d2' : '#ddd'};
  background: ${props => props.active ? '#1976d2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

export const Purchase = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { getProducts } = useProduct();
//   const { showError } = useAlert();
  
//   const [allProducts, setAllProducts] = useState<any[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [allCategories, setAllCategories] = useState<string[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true);
//       try {
//         const products = await getProducts();
//         const categories = ProductHelper.getCategories(products);
        
//         setAllProducts(products);
//         setAllCategories(categories);
        
//         // Set initial category from URL hash or first category
//         const hash = location.hash.slice(1);
//         const initialCategory = hash || (categories.length > 0 ? categories[0] : '');
        
//         if (initialCategory) {
//           selectCategory(initialCategory);
//         }
//       } catch (error: any) {
//         showError(error?.error?.error || error?.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const handleHashChange = () => {
//       const hash = location.hash.slice(1);
//       if (hash && allCategories.includes(hash)) {
//         selectCategory(hash);
//       }
//     };

//     window.addEventListener('hashchange', handleHashChange);
//     return () => window.removeEventListener('hashchange', handleHashChange);
//   }, [allCategories]);

//   const selectCategory = (category: string) => {
//     setSelectedCategory(category);
//     navigate(`#${category}`, { replace: true });
//     const filtered = allProducts.filter(x => x.category === category);
//     setFilteredProducts(filtered);
//   };

//   if (isLoading) {
//     return (
//       <LoadingContainer>
//         Loading...
//       </LoadingContainer>
//     );
//   }

//   if (!allProducts.length) {
//     return <NoData message="No products available" />;
//   }

//   return (
//     <Container>
//       <CategoryChips>
//         {allCategories.map(category => (
//           <CategoryChip
//             key={category}
//             active={category === selectedCategory}
//             onClick={() => selectCategory(category)}
//           >
//             {category}
//           </CategoryChip>
//         ))}
//       </CategoryChips>

//       <ProductsGrid>
//         {filteredProducts.map(product => (
//           <Product key={product.id} product={product} />
//         ))}
//       </ProductsGrid>
//     </Container>
//   );
}; 