import { HTMLAttributes, inject, provide, ref } from "vue";

type Props = {
   index: number;
   handleDragEnd: () => void;
};

const useDragState = () => {
   const isDrag = ref(false);
   const endIndex = ref(0);
   const startIndex = ref(0);

   return {
      isDrag,
      startIndex,
      endIndex,
   };
};

type ProviderType = ReturnType<typeof useDragState>;

const inActiveStyles: Partial<CSSStyleDeclaration> = {
   borderColor: "rgba(0,0,0,0.15)",
};

const findDraggableItem = (el: HTMLDivElement) => {
   if (el.classList.contains("draggable")) return el;
   let i = 0;
   let parent = el.parentElement as HTMLDivElement;
   while (!parent.classList.contains("draggable") && i < 5) {
      parent = parent.parentElement as HTMLDivElement;
      i++;
   }

   if (i == 5) return null;
   return parent;
};

export default function dragProvider() {
   const state = useDragState();
   provide("drag_provider", state);

   return state;
}

export function injectDrag() {
   const state = inject<ProviderType>("drag_provider");
   if (!state) throw new Error("Drag not provided");

   return state;
}

export function useDrag({ index, handleDragEnd }: Props) {
   const { endIndex, startIndex, isDrag } = injectDrag();

   const handleDragStart = () => {
      isDrag.value = true;
      startIndex.value = index;
   };

   const handleDragEnter = (e: DragEvent) => {
      // endIndexRef = index;
      endIndex.value = index;
      const el = e.target as HTMLDivElement;
      isDrag.value = true;
      const parentEl = findDraggableItem(el);

      if (parentEl) {
         if (startIndex.value === index) return;
         const moveDir = startIndex.value > index ? "up" : "down";

         Object.assign(
            (parentEl.childNodes[0] as HTMLDivElement).style,
            moveDir === "up"
               ? { borderLeftColor: "#cd1818" }
               : { borderRightColor: "#cd1818" }
         );
         parentEl.classList.add("active");
      }
   };

   const handleDragOver = (e: DragEvent) => {
      const el = e.target as HTMLDivElement;
      const parentEl = findDraggableItem(el);

      if (parentEl) {
         console.log("adas");

         Object.assign((parentEl.childNodes[0] as HTMLDivElement).style, inActiveStyles);
         parentEl.classList.remove("active");
      }
   };

   const endDrag = () => {
      const activeItem = document.querySelector(".draggable.active");

      if (activeItem) {
         const childNode = activeItem.childNodes[0] as HTMLDivElement;
         if (childNode) {
            Object.assign(childNode.style, inActiveStyles);
            activeItem.classList.remove("active");
         }
      }

      isDrag.value = false;
      handleDragEnd();
   };

   const parentProps: Partial<HTMLAttributes> = {
      onDragenter: (e) => handleDragEnter(e),
      onDragend: endDrag,
      onDragover: (e) => {
         e.preventDefault();
      },
      onDragleave: (e) => {
         handleDragOver(e);
      },
      onDragstart: handleDragStart,
   };

   return { parentProps, isDrag };
}
