export type SliderImage = {
   image_url: string;
   link_to: string;
   id?: number;
};

export type Product = {
   id: number;
   product_name: string;
   product_ascii: string;
   category_id: number;
   brand_id: number;
   image_url: string;
   installment: boolean;
   category: Category;
   brand: {
      brand_name: string;
      brand_ascii: string;
   };
   price: number;
};

export type ProductSchema = Omit<Product, "brand" | "category" | "id">;

export type Category = {
   id: number;
   category_ascii: string;
   category_name: string;
   hidden?: boolean;
   brands: Brand[];
};

export type CategorySchema = Omit<Category, "id" | "brands">;

export type Brand = {
   id: number;
   brand_ascii: string;
   brand_name: string;
   image_url: string;
   category_id: number;
};

export type BrandSchema = Omit<Brand, "id">;

export type ImageType = {
   id?: number;
   image_url: string;
   public_id: string;
   name: string;
   size: number;
   link_to: string;
};

export type ImageSchema = Omit<ImageType, "id" | "public_id">;

export type PriceRange = {
   id: number;
   category_id: number;
   from: number;
   to: number;
   label: string;
};

export type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};
