<script setup lang="ts">
import Popup from "@/components/Popup/Popup.vue";
import PopupTrigger, {TriggerRef} from "@/components/Popup/PopupTrigger.vue";
import PopupContent from "@/components/Popup/PopupContent.vue";
import PopupWrapper from "@/components/Popup/PopupWrapper.vue";
import { CodeBracketIcon, PlusIcon } from "@heroicons/vue/16/solid";
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import { ref } from "vue";
import useImportProduct from "@/hooks/useImportProduct";
import JsonInput from "@/components/Modal/JsonInput.vue";
import AddProduct from "@/components/Form/AddProduct.vue";

type Modal = "add" | "import";

const modal = ref<Modal>("add");
const triggerRef = ref<TriggerRef>();

const { currentIndex, status: importStatus, submit, jsonProducts } = useImportProduct();

const modalRef = ref<ModalRef>();
const openModal = (m: Modal) => {
	modal.value = m;
	triggerRef.value?.close();
	modalRef.value?.open();
};

const closeModal = () => {
	modalRef.value?.close();
};
</script>

<template>
	<Popup>
		<PopupTrigger ref="triggerRef" variant="push" border="clear" class="ml-auto">
			<PlusIcon class="w-5 mr-[4px]" />
			Add product
		</PopupTrigger>
		<PopupContent>
			<PopupWrapper>
				<button @click="() => openModal('add')">
					<PlusIcon class="w-5" />
					<span> Add product </span>
				</button>
				<button @click="() => openModal('import')">
					<CodeBracketIcon class="w-5" />
					<span> Import </span>
				</button>
			</PopupWrapper>
		</PopupContent>
	</Popup>

	<Modal ref="modalRef">
		<template v-slot:children>
			<AddProduct v-if="modal === 'add'" :props="{ type: 'add', closeModal: closeModal }" />
			<JsonInput
				v-if="modal === 'import'"
				title="Import product"
				:submit="submit"
				:status="importStatus"
				:close-modal="closeModal"
			>
				<div
					v-if="importStatus === 'fetching' && jsonProducts.length"
					class="text-[#333]"
				>
					<p class="font-[500] text-[#333]">
						{{ currentIndex + 1 }} of {{ jsonProducts?.length }}
					</p>
					<div class="flex justify-between mt-1">
						<p>{{ jsonProducts[currentIndex].name }}</p>
						<ArrowPathIcon class="w-6 animate-spin" />
					</div>
				</div>
			</JsonInput>
		</template>
	</Modal>
</template>
