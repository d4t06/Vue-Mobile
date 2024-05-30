

export const inputClasses = {
   input: "p-[6px] pl-[12px] font-[500] bg-[#fff] w-full h-full rounded-[8px] placeholder:text-[#808080] outline-none text-[#333] border border-black/10 text-[16px] translate-y-[0] h-[calc(100%-4px)]",
   overlayButton:
      "p-[4px] text-[#333] transition-transform  bg-[#e1e1e1] hover:scale-[1.05] hover:bg-[#cd1818] hover:text-white",
};

export const loginClasses = {
   container:
      "rounded-[24px] w-[90vw] md:flex-grow md:w-auto mx-auto my-auto md:mx-[100px] bg-white p-[20px] md:p-[30px] md:pt-[calc(40px+30px+10px)]",
   HDMobile: 'text-[26px] font-[500] leading-[40px]',
   left: 'mt-0 md:mt-[-50px] text-center md:text-left',
   form: "flex flex-col md:flex-row justify-between",
   right: "space-y-[16px] mt-[20px] md:mt-0",
   inputGroup: "flex flex-col space-y-[2px]",
   label: "text-[#1f1f1f]",
   input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
   errorMessage: "bg-red-500/30 text-red-500 p-[6px] rounded-[6px] inline-block",
};

export const sleep = (time: number) => new Promise<void>((rs) => setTimeout(() => rs(), time));

export const moneyFormat = (money: string | number) => {
   const formatter = new Intl.NumberFormat("en-US");
   if (!money) return "";
   return formatter.format(+money) + " đ";
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
   const newImage: ImageSchema = {
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
