import { Ref, ref, watchEffect } from "vue";

type Props = {
   inValue: Ref<string>;
   time: number;
};

export default function useDebounced({ inValue, time }: Props) {
   let outValue = ref("");

   let timerId = 0;

   const clear = () => clearTimeout(timerId);

   watchEffect((onCancel) => {
      if (!inValue.value) return (outValue.value = "");
      else timerId = setTimeout(() => (outValue.value = inValue.value), time);

      onCancel(() => clearTimeout(timerId));
   });

   return { outValue, clear };
}
