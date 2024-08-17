// Define the interface for products
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    idpost: number;
  }
  
  // Define the interface for posts
  export interface Post {
    id: number;
    title: string;
    image: string;
    position: number;
    template: number;
    products: Product[]; // Array of products
  }
  
  // Define the interface for the data containing posts
  export interface PostData {
  id: number;
  title: string;
  image: string;
  position: number;
  template: number;
  products: Product[];
  }
  