import usePrivateRequest from "@/hooks/usePrivateRequest";
import { useProductStore } from "@/stores/product";
import { sleep } from "@/utils/appHelper";
import { Ref, ref } from "vue";

type Props = {
	tab: Ref<string>;
};

export default function useSearchProductDashboard({ tab }: Props) {
	const productStore = useProductStore();

	const isFetching = ref(false);
	const value = ref("");

	const privateRequest = usePrivateRequest();

	const search = async () => {
		try {
			isFetching.value = true;

			if (import.meta.env.DEV) await sleep(300);

			const res = await privateRequest.get(`/products/search/less?q=${value.value}`);

			const payload = res.data.data as ProductList[];

			if (payload) {
				tab.value = "search";

				productStore.storingProducts({
					replace: true,
					products: payload,
					count: payload.length,
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			isFetching.value = false;
		}
	};

	return {
		isFetching,
		value,
		search,
	};
}
