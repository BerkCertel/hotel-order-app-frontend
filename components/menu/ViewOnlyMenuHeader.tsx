import MenuSheet from "./MenuSheet";

interface MenuSheetHeaderProps {
  HeaderText: string;
}

function ViewOnlyMenuHeader({ HeaderText }: MenuSheetHeaderProps) {
  return (
    <div className="flex md:flex-row-reverse justify-between gap-x-2 border-b border-indigo-500 pb-2">
      <span className="text-indigo-600 text-lg md:text-2xl font-bold">
        {HeaderText}
      </span>
      <MenuSheet />
    </div>
  );
}

export default ViewOnlyMenuHeader;
