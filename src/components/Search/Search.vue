<script setup lang="ts">
import useDebounced from "@/hooks/useDebounced";
import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";
import useSearchProduct from "./useSearchProduct";
import PushFrame from "../ui/PushFrame.vue";
import { moneyFormat } from "@/utils/appHelper";
import { useRouter } from "vue-router";
import { Modal } from "../Modal";

const searchKey = ref("");
const show = ref(false);
const openModal = ref(false);

// hooks
const router = useRouter();
const { outValue, clear } = useDebounced({ inValue: searchKey, time: 800 });
const { isFetching, searchResult } = useSearchProduct({ searchKey: outValue });

const isShowResult = computed(
   () => !!searchResult.value.length && !!searchKey.value && show.value
);

const toggleModal = (v: boolean) => {
   show.value = v;
   openModal.value = v;
};

const handleSubmit = (e: Event) => {
   e.preventDefault();

   clear();
   toggleModal(false);
   router.push(`/search/${searchKey.value}`);
};

const handleClickProduct = (id: number) => {
   toggleModal(false);
   router.push(`/product/${id}`);
};
</script>

<template>
   <div class="wrap">
      <form class="form" @submit="handleSubmit">
         <input
            class="input"
            type="text"
            placeholder="iPhone 15 Pro Max..."
            v-model="searchKey"
            @focus="toggleModal(true)"
         />
         <button v-if="isFetching" class="loading-btn btn">
            <ArrowPathIcon class="w-[24px] animate-spin" />
         </button>

         <button
            v-if="searchKey && !isFetching"
            type="button"
            class="clear-btn btn"
            @click="
               searchKey = '';
               searchResult = [];
            "
         >
            <XMarkIcon class="w-[24px]" />
         </button>

         <button type="submit" class="search-btn btn">
            <MagnifyingGlassIcon class="w-[24px]" />
         </button>
      </form>

      <div v-if="isShowResult" class="absolute top-[calc(100%+10px)] w-full">
         <PushFrame pushAble="clear">
            <div class="search-result">
               <div
                  v-for="p in searchResult"
                  :onClick="() => handleClickProduct(p.id)"
                  class="product"
               >
                  <div class="product-img">
                     <img
                        :src="
                           p.image_url ||
                           'https://d4t06.github.io/HD-Mobile/assets/not-found-95813d48.png'
                        "
                        alt=""
                     />
                  </div>
                  <div class="product-info">
                     <h2 class="title">{{ p.product_name }}</h2>
                     <p class="price">
                        {{
                           p.default_storage.storage.default_combine.combine
                              ? moneyFormat(
                                   p.default_storage.storage.default_combine.combine.price
                                )
                              : "Contact"
                        }}
                     </p>
                  </div>
               </div>
            </div>
         </PushFrame>
      </div>
   </div>

   <Modal v-if="openModal" :close="() => toggleModal(false)"> </Modal>
</template>

<style lang="scss" scoped>
@import url("./Search.module.scss");
</style>
