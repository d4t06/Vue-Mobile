import { Ref, watchEffect } from "vue";

type Props = {
   color: Ref<ProductColor | undefined>;
   storage: Ref<ProductStorage | undefined>;
   product: Ref<ProductDetail | null>;
};

export default function useGetDefaultCombine({ color, storage, product }: Props) {
   watchEffect(() => {
      if (!product.value?.default_storage.storage_id) return;

      const defaultStorage = product.value.storages.find(
         (s) => s.id === product.value!.default_storage.storage_id
      );

      if (!defaultStorage) {
         console.log("default storage not found");

         storage.value = product.value.storages[0];
         color.value = product.value.colors[0];

         return;
      }

      const defaultCombineOfStorage = product.value.combines.find(
         (c) => c.id === defaultStorage.default_combine.combine_id
      );

      if (!defaultCombineOfStorage) {
         console.log("default combine of storage not found");
      }

      const defaultColor = product.value.colors.find(
         (c) => c.id === defaultCombineOfStorage!.color_id
      );

      storage.value = defaultStorage;

      if (!defaultColor) {
         color.value = product.value.colors[0];
      } else {
         color.value = defaultColor;
      }
   });
}
