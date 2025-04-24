import { ReactElement, ReactNode } from "react";

export type ApiTabsProps = {
  tabs: TabProps[];
  activeKey:string;
  className?:string;
  disabled?:boolean;
  intityName:string;

};

export type TabProps = {
  tabKey: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}