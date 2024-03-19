import type { Category, ImageType } from "@/types";

export const inputClasses = {
   input: "p-[6px] pl-[12px] font-[500] bg-[#f1f1f1] w-full h-full rounded-[8px] placeholder:text-[#808080] outline-none text-[#333] border border-black/10 text-[16px] translate-y-[0] h-[calc(100%-4px)]",
};

export const sleep = (time: number) => new Promise<void>((rs) => setTimeout(() => rs(), time));

export const moneyFormat = (money: string | number) => {
   const formatter = new Intl.NumberFormat("en-US");
   if (!money) return "";
   return formatter.format(+money);
};

export const generateId = (name: string): string => {
   const convertToEn = (str: string) => {
      const newString = str
         .toLocaleLowerCase()
         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a")
         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
         .replace(/ì|í|ị|ỉ|ĩ/g, "i")
         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o")
         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
         .replace(/đ/g, "d");
      return newString;
   };
   return convertToEn(name).replace(/[\W_]/g, "-");
};

export const initImageObject = (data: Partial<ImageType>) => {
   const newImage: ImageType = {
      public_id: "",
      image_url: "",
      link_to: "",
      name: "",
      size: 0,
      ...data,
   };

   return newImage;
};

export const findCurCategory = (categories: Category[], curCategoryAscii: string) => {
   const curCategory = categories.find((cat) => cat.category_ascii === curCategoryAscii);
   return curCategory;
};

export const formatSize = (size: number) => {
   const units = ["Kb", "Mb"];
   let mb = 0;

   if (size < 1024) return size.toFixed(0) + units[mb];
   while (size > 1024) {
      size -= 1024;
      mb++;
   }

   return mb + "," + size.toFixed(1) + units[1];
};
