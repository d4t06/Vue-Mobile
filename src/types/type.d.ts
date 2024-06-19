type ProductStorageDetail = {
   id: number;
   product_id: number;
   storage_name: string;
   storage_name_ascii: string;
   default_combine: DefaultStorageCombineDetail;
};

type ProductStorage = Omit<ProductStorageDetail, "default_combine"> & {
   default_combine: DefaultStorageCombine;
};

type ProductStorageSchema = Omit<ProductStorage, "id" | "default_combine">;

type ProductColor = {
   id: number;
   product_id: number;
   color_name: string;
   color_name_ascii: string;
   product_slider: ProductSlider;
};

type ProductColorSchema = Omit<ProductColor, "id" | "product_slider">;

type ProductAttribute = {
   id: number;
   category_attribute_id: number;
   product_id: number;
   value: string;
};

type ProductDescription = {
   id: number;
   product_id: number;
   content: string;
};

type ProductDescriptionSchema = Omit<ProductDescription, "id">;

type ProductAttributeSchema = Omit<ProductAttribute, "id">;

type ProductCombine = {
   id: number;
   product_id: number;
   color_id: number;
   storage_id: number;
   quantity: number;
   price: number;
   default: boolean;
};

type DefaultStorageDetail = {
   product_id: number;
   storage_id: number;
   storage: ProductStorageDetail;
};

type DefaultStorage = Omit<DefaultStorageDetail, "storage">;

type DefaultStorageCombineDetail = {
   storage_id: number;
   combine_id: number;
   combine: ProductCombine;
};

type DefaultStorageCombine = Omit<DefaultStorageCombineDetail, "combine">;

type ProductSlider = {
   id: number;
   product_id: number;
   slider_id: number;
   color_id: number;
   slider: Slider;
};

type ProductDetail = {
   id: number;
   product_name: string;
   product_name_ascii: string;
   category_id: number;
   brand_id: number;
   image_url: string;
   installment: boolean;
   category: Category;
   colors: ProductColor[];
   storages: ProductStorage[];
   combines: ProductCombine[];
   attributes: ProductAttribute[];
   description: ProductDescription;
   default_storage: DefaultStorage;
};

type ProductList = Omit<
   ProductDetail,
   "category" | "colors" | "combines" | "attributes" | "description" | "storages"
> & {
   storages: ProductStorageDetail[];
};

type CartProduct = Omit<ProductList, "default_storage" | "storages"> & {
   colors: ProductColor[];
   storages: ProductStorage[];
};

type SearchProduct = Omit<
   ProductDetail,
   "comments_data" | "combines" | "colors" | "variants" | "default_variant"
> & {
   default_storage: DefaultStorageDetail;
};

type ProductSchema = Omit<ProductList, "id" | "storages">;

type SliderImage = {
   id: number;
   link_to: string;
   image: ImageType;
   image_id: number;
   slider_id: number;
};

type SliderImageSchema = Omit<SliderImage, "id" | "image">;

type Slider = {
   id: number;
   name: string;
   slider_images: SliderImage[];
};

type CategorySlider = {
   id: number;
   category_id: number;
   slider_id: number;
   slider: Slider;
};

type Category = {
   id: number;
   category_name: string;
   category_name_ascii: string;
   is_show: 0 | 1;
   brands: Brand[];
   price_ranges: PriceRange[];
   category_slider: CategorySlider;
   attribute_order: string;
   attributes: CategoryAttribute[];
};

type CategorySchema = Omit<
   Category,
   "id" | "brands" | "category_slider" | "price_ranges" | "attributes"
>;

type CategoryAttribute = {
   id: number;
   category_id: number;
   attribute_name: string;
   attribute_name_ascii: string;
};

type CategoryAttributeSchema = Omit<CategoryAttribute, "id">;

type Brand = {
   id: number;
   brand_name: string;
   brand_name_ascii: string;
   image_url: string;
   category_id: number;
};

type BrandSchema = Omit<Brand, "id">;

type ImageType = {
   id: number;
   image_url: string;
   public_id: string;
   name: string;
   size: number;
   link_to: string;
};

type ImageSchema = Omit<ImageType, "id" | "public_id">;

type PriceRange = {
   id: number;
   category_id: number;
   from_price: number;
   to_price: number;
   label: string;
};

type PriceRangeSchema = Omit<PriceRange, "id">;

type CartItem = {
   id: number;
   username: string;
   product_id: number;
   amount: number;
   color_id: number;
   storage_id: number;
   amount: number;
   product: CartProduct;
};

type cartItemDetail = {
   item: CartItem;
   price: number;
};

type CartItemSchema = Omit<CartItem, "id" | "product">;

type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};
