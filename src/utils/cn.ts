import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export const cn = (...classes: classNames.ArgumentArray) => twMerge(classNames(...classes))