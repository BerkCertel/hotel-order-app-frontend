import CartSheet from "./CartSheet";
import MenuSheet from "./MenuSheet";

interface MenuSheetHeaderProps {
  HeaderText: string;
}

function MenuHeader({ HeaderText }: MenuSheetHeaderProps) {
  return (
    <div className="flex justify-between gap-x-2 border-b border-indigo-500 pb-2">
      <MenuSheet />
      <span className="text-indigo-600 text-lg md:text-2xl font-bold">
        {HeaderText}
      </span>
      <CartSheet />
    </div>
  );
}

export default MenuHeader;
