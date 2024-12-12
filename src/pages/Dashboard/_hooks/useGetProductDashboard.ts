import useCategory from "@/hooks/useCategory";
import useGetProduct from "@/hooks/useGetProduct";
import useProduct from "@/hooks/useProducts";
import { Ref, watch } from "vue";

type Props = {
	tab: Ref<string>;
};

export default function useGetProductDashboard({ tab }: Props) {
	const { categories } = useCategory();

	const { products, status, page, isLast, count } = useProduct();

	const { getProduct } = useGetProduct();

	const getMore = () => {
		getProduct({ page: page.value + 1, size: 10 }, { more: true, less: true });
	};

	watch(
		[tab, categories],
		() => {
			if (!categories.value.length || tab.value === "search") return;

			const targetCategory = categories.value.find(
				(cat) => cat.category_name_ascii === tab.value,
			);

			getProduct(
				{ category_id: targetCategory?.id, size: 10 },
				{ replace: true, less: true },
			);
		},
		{
			immediate: true,
		},
	);

	return {
		products,
		status,
		getMore,
		isLast,
		count
	};
}
