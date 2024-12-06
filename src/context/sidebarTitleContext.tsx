import { LucideProps } from "lucide-react";
import { createContext, ReactNode, useState } from "react";

type SidebarInsetObjType = {
  title: string;
  icon: null | React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

type SidebarTitleContextProps = {
  sidebarInsetObj: SidebarInsetObjType;
  setSidebarInsetObj: React.Dispatch<React.SetStateAction<SidebarInsetObjType>>;
};
const initialValue: SidebarTitleContextProps = {
  sidebarInsetObj: {
    title: "Home",
    icon: null,
  },
  setSidebarInsetObj: () => {},
};
const SidebarTitleContext =
  createContext<SidebarTitleContextProps>(initialValue);

type SidebarTitleProviderProps = {
  children?: ReactNode;
};

function SidebarTitleProvider({ children }: SidebarTitleProviderProps) {
  const [sidebarInsetObj, setSidebarInsetObj] = useState<SidebarInsetObjType>(
    initialValue.sidebarInsetObj
  );
  return (
    <SidebarTitleContext.Provider
      value={{ sidebarInsetObj, setSidebarInsetObj }}
    >
      {children}
    </SidebarTitleContext.Provider>
  );
}
export default SidebarTitleProvider;
export { SidebarTitleContext };
