import usePrivateRequest from "@/hooks/usePrivateRequest";
import { useProductDetailStore } from "@/stores/productDetail";
import { useToastStore } from "@/stores/toast";
import { sleep } from "@/utils/appHelper";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const SLIDER_IMAGE_URL = "/sliders/images";

export default function useProductSliderAction() {
	const p = useProductDetailStore();
	const { productDetail } = storeToRefs(p);

	const isFetching = ref<"add" | "delete" | "update" | "">("");

	const privateRequest = usePrivateRequest();
	const { setErrorToast, setSuccessToast } = useToastStore();

	type Add = {
		action: "Add";
		images: ImageType[];
		colorIndex: number;
		color: ProductColor;
	};

	type Edit = {
		action: "Edit";
		image: ImageType;
		index: number;
		sliderImage: SliderImageSchema;
		colorIndex: number;
		id: number;
	};

	type Delete = {
		action: "Delete";
		id: number;
		index: number;
		colorIndex: number;
	};

	type Props = Add | Edit | Delete;

	const actions = async (props: Props) => {
		if (!productDetail.value) throw new Error("productDetail is undefined");

		try {
			switch (props.action) {
				case "Add": {
					const { color, colorIndex, images } = props;

					const sliderImageSchemas = images.map(
						(image) =>
							({
								image_id: image.id,
								slider_id: color.product_slider.slider_id,
								link_to: "",
							}) as SliderImageSchema,
					);

					isFetching.value = "add";

					if (import.meta.env.DEV) await sleep(300);

					const res = await privateRequest.post(
						`${SLIDER_IMAGE_URL}`,
						sliderImageSchemas,
					);
					const newSliderImages = res.data.data as SliderImage[];

					productDetail.value.colors[
						colorIndex
					].product_slider.slider.slider_images.push(...newSliderImages);

					setSuccessToast("Add slider images successful");
					break;
				}

				case "Edit": {
					const { sliderImage, id, index, colorIndex, image } = props;
					await privateRequest.put(`${SLIDER_IMAGE_URL}/${id}`, sliderImage);

					Object.assign(
						productDetail.value.colors[colorIndex].product_slider.slider
							.slider_images[index],
						{ ...sliderImage, image },
					);

					setSuccessToast("Update slider image successful");

					break;
				}
				case "Delete": {
					const { index, id, colorIndex } = props;

					isFetching.value = "delete";
					if (import.meta.env.DEV) await sleep(300);

					await privateRequest.delete(`${SLIDER_IMAGE_URL}/${id}`);

					productDetail.value.colors[
						colorIndex
					].product_slider.slider.slider_images.splice(index, 1);

					setSuccessToast("Delete slider image successful");
				}
			}
		} catch (err) {
			console.log({ message: err });
			setErrorToast("");
		} finally {
			isFetching.value === "";
		}
	};

	return { actions, isFetching };
}
