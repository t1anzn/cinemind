/**
 * CustomSelect Component
 *
 * Reusable dropdown select component built with Headless UI Listbox.
 * Features:
 * - Styled dropdown with backdrop blur and hover effects
 * - Smooth transition animations for open/close states
 * - Selected state highlighting with visual feedback
 * - Support for optional icons in dropdown options
 * - Accessible keyboard navigation and focus management
 * - Customizable through options prop with value/label pairs
 *
 * Used throughout SearchBar for language, sorting, and filter selections.
 */

import { Fragment } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function CustomSelect({ value, onChange, options }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          className="w-full px-4 py-2.5 bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all duration-200 text-sm tracking-wide 
          cursor-pointer hover:bg-slate-700/80 hover:border-slate-600/50 shadow-lg shadow-black/20
          flex items-center justify-between backdrop-blur-sm"
        >
          <span className="flex items-center font-medium">
            {options.find((o) => o.value === value)?.label || "Select..."}
          </span>
          <ChevronUpDownIcon className="h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200" />
        </ListboxButton>

        <Transition
          as={Fragment}
          enter="transition ease-in duration-100"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <ListboxOptions
            className="absolute z-10 w-full mt-2 bg-slate-900/20 backdrop-blur-sm border border-slate-700/20 
            rounded-lg shadow-xl shadow-black/20 divide-y divide-slate-700/50 ring-1 ring-slate-700/50 focus:outline-none"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ selected }) =>
                  `relative cursor-pointer select-none py-2.5 px-4 text-sm transition-all duration-200
                  ${selected ? "bg-blue-900/40 text-white" : ""}
                  hover:bg-blue-600/20 group text-slate-400`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span
                      className={`${
                        selected ? "font-medium text-white" : "font-normal"
                      } transition-colors duration-200 group-hover:text-white`}
                    >
                      {option.label}
                    </span>
                    {option.icon && (
                      <span className="ml-4 text-slate-400 group-hover:text-white transition-colors duration-200">
                        {option.icon}
                      </span>
                    )}
                  </div>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
