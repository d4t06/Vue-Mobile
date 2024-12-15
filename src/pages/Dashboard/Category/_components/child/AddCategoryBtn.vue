<script setup lang="ts">
import Popup from "@/components/Popup/Popup.vue";
import PopupTrigger, { TriggerRef } from "@/components/Popup/PopupTrigger.vue";
import PopupContent from "@/components/Popup/PopupContent.vue";
import PopupWrapper from "@/components/Popup/PopupWrapper.vue";
import { CodeBracketIcon, PlusIcon as PlusIconOutline } from "@heroicons/vue/24/outline";
import { PlusIcon, ArrowPathIcon } from "@heroicons/vue/16/solid";
import Modal, { ModalRef } from "@/components/Modal/Modal.vue";
import { ref } from "vue";
import useImportCategory from "@/hooks/useImportCategory";
import JsonInput from "@/components/Modal/JsonInput.vue";
import AddItem from "@/components/Modal/AddItem.vue";

type Modal = "add" | "import";

type Props = {
	isFetching: boolean;
	submit: (v: string) => void;
};

const props = defineProps<Props>();

const modal = ref<Modal>("add");
const triggerRef = ref<TriggerRef>();

const { status, submit } = useImportCategory();

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
		<PopupTrigger
			ref="triggerRef"
			variant="push"
			border="clear"
			size="clear"
			class="ml-auto p-1 sm:px-3 space-x-1 font-[500]"
		>
			<PlusIcon class="w-6" />
			<span class="hidden sm:block"> Add Category </span>
		</PopupTrigger>
		<PopupContent>
			<PopupWrapper>
				<button @click="() => openModal('add')">
					<PlusIconOutline class="w-5" />
					<span> Add category </span>
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
			<AddItem
				v-if="modal === 'add'"
				:closeModal="closeModal"
				:submit="(v) => props.submit(v)"
				:loading="props.isFetching"
				title="Add category"
			/>
			<JsonInput
				v-if="modal === 'import'"
				title="Import product"
				:submit="submit"
				:status="status"
				:close-modal="closeModal"
			>
				<ArrowPathIcon v-if="status === 'fetching'" class="w-6 animate-spin" />
				<p v-if="status === 'finish'">Xong roi fen.</p>
			</JsonInput>
		</template>
	</Modal>
</template>
