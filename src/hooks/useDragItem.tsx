import { HTMLAttributes } from "vue";

type Props = {
   index: number;
   // endIndexRef: number;
   handleDragEnd: () => void;
   setIsDrag: (x: boolean) => void;
   setEndIndex: (y: number) => void;
};

const activeStyles: Partial<CSSStyleDeclaration> = {
   border: "1px solid #cd1818",
};

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

export default function useDrag({ index, handleDragEnd, setIsDrag, setEndIndex }: Props) {
   const handleDragStart = () => {
      setIsDrag(true);
   };

   const handleDragEnter = (e: DragEvent) => {
      // endIndexRef = index;
      setEndIndex(index);
      const el = e.target as HTMLDivElement;
      setIsDrag(true);
      const parentEl = findDraggableItem(el);

      if (parentEl) {
         Object.assign((parentEl.childNodes[0] as HTMLDivElement).style, activeStyles);
         parentEl.classList.add("active");
      }
   };

   const handleDragOver = (e: DragEvent) => {
      const el = e.target as HTMLDivElement;
      const parentEl = findDraggableItem(el);

      if (parentEl) {
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

      setIsDrag(false);
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

   return { parentProps };
}
