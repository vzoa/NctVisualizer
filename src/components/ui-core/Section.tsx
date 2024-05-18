import { ParentComponent } from "solid-js";

interface SectionProps {
  header: string;
}

export const Section: ParentComponent<SectionProps> = (props) => {
  return (
    <div class="flex flex-col">
      <h2 class="text-white text-xl mb-1">{props.header}</h2>
      {props.children}
    </div>
  );
};
