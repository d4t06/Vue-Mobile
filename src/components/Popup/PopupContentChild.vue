<script setup lang="ts">
// type Props = {
// 	appendTo?: "parent" | "portal";
// };

// const props = withDefaults(defineProps<Props>(), {
// 	appendTo: "portal",
// });

import { injectPopup } from "./usePopup";

const { appendTo } = injectPopup();
</script>

<template>
	<Teleport v-if="appendTo === 'portal'" to="#portal">
		<slot />
	</Teleport>

	<template v-else>
		<slot />
	</template>
</template>
