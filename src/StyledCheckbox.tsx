import { Checkbox } from "@kobalte/core/checkbox";
import { Check } from "lucide-solid";
import { Accessor } from "solid-js";

type StyledCheckboxProps = {
  label?: string;
  defaultChecked?: boolean;
  checked?: Accessor<boolean>;
  onChange?: (checked: boolean) => void;
};

const StyledCheckbox = (props: StyledCheckboxProps) => {
  return (
    <Checkbox
      class="items-center inline-flex"
      defaultChecked={props.defaultChecked}
      checked={props.checked?.()}
      onChange={props.onChange}
    >
      <Checkbox.Input class="" />
      <Checkbox.Control class="h-[20px] w-[20px] rounded-md border border-gray-700 bg-gray-300 ui-checked:bg-orange-700 ui-checked:text-white">
        <Checkbox.Indicator>
          <Check size={18} />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label class="ml-1.5 text-white text-sm select-none">
        {props.label}
      </Checkbox.Label>
    </Checkbox>
  );
};

export default StyledCheckbox;
